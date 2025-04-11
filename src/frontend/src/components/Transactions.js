import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5001/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    property_id: "",
    company_id: "",
    transaction_date: "",
    gross_amount: "",
    net_amount: "",
    taxes_paid_amount: "",
    merchandise_transacted: "",
    amount_of_merch_transacted: "",
    merchandise_type: "",
    barrels_of_oil: "",
    service1: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchProperties();
    fetchCompanies();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleOpen = (transaction = null) => {
    if (transaction) {
      setEditMode(true);
      setSelectedTransaction(transaction);
      setFormData({
        property_id: transaction.property_id,
        company_id: transaction.company_id,
        transaction_date: transaction.transaction_date
          ? transaction.transaction_date.split("T")[0]
          : "",
        gross_amount: transaction.gross_amount || "",
        net_amount: transaction.net_amount || "",
        taxes_paid_amount: transaction.taxes_paid_amount || "",
        merchandise_transacted: transaction.merchandise_transacted || "",
        amount_of_merch_transacted:
          transaction.amount_of_merch_transacted || "",
        merchandise_type: transaction.merchandise_type || "",
        barrels_of_oil: transaction.barrels_of_oil || "",
        service1: transaction.service1 || "",
      });
    } else {
      setEditMode(false);
      setSelectedTransaction(null);
      setFormData({
        property_id: "",
        company_id: "",
        transaction_date: "",
        gross_amount: "",
        net_amount: "",
        taxes_paid_amount: "",
        merchandise_transacted: "",
        amount_of_merch_transacted: "",
        merchandise_type: "",
        barrels_of_oil: "",
        service1: "",
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedTransaction(null);
    setFormData({
      property_id: "",
      company_id: "",
      transaction_date: "",
      gross_amount: "",
      net_amount: "",
      taxes_paid_amount: "",
      merchandise_transacted: "",
      amount_of_merch_transacted: "",
      merchandise_type: "",
      barrels_of_oil: "",
      service1: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${API_BASE_URL}/transactions/${selectedTransaction._id}`,
          formData
        );
        setSuccess("Transaction updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/transactions`, formData);
        setSuccess("Transaction created successfully");
      }
      fetchTransactions();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save transaction");
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`);
        setSuccess("Transaction deleted successfully");
        fetchTransactions();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to delete transaction");
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    return property ? property.name : propertyId;
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.name : companyId;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Transactions</Typography>
        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Transaction
        </MuiButton>
      </Box>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Gross Amount</TableCell>
              <TableCell>Net Amount</TableCell>
              <TableCell>Taxes Paid</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  {transaction.transaction_date
                    ? new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {getPropertyName(transaction.property_id)}
                </TableCell>
                <TableCell>{getCompanyName(transaction.company_id)}</TableCell>
                <TableCell>
                  ${Number(transaction.gross_amount || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  ${Number(transaction.net_amount || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  ${Number(transaction.taxes_paid_amount || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(transaction)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(transaction._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="property_id"
                  label="Property"
                  value={formData.property_id}
                  onChange={handleChange}
                  fullWidth
                  required
                  select
                >
                  {properties.map((property) => (
                    <MenuItem key={property._id} value={property._id}>
                      {property.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="company_id"
                  label="Company"
                  value={formData.company_id}
                  onChange={handleChange}
                  fullWidth
                  required
                  select
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="transaction_date"
                  label="Transaction Date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="gross_amount"
                  label="Gross Amount"
                  type="number"
                  value={formData.gross_amount}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="net_amount"
                  label="Net Amount"
                  type="number"
                  value={formData.net_amount}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="taxes_paid_amount"
                  label="Taxes Paid"
                  type="number"
                  value={formData.taxes_paid_amount}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="merchandise_transacted"
                  label="Merchandise Description"
                  value={formData.merchandise_transacted}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="amount_of_merch_transacted"
                  label="Amount of Merchandise"
                  type="number"
                  value={formData.amount_of_merch_transacted}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="merchandise_type"
                  label="Merchandise Type"
                  value={formData.merchandise_type}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="barrels_of_oil"
                  label="Barrels of Oil"
                  type="number"
                  value={formData.barrels_of_oil}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="service1"
                  label="Service"
                  value={formData.service1}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleClose}>Cancel</MuiButton>
            <MuiButton type="submit" variant="contained" color="primary">
              {editMode ? "Update" : "Add"}
            </MuiButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Transactions;
