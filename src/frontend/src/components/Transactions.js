import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Grid,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entryId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    property_id: "",
    account_id: "",
    amount: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    if (entryId) {
      fetchEntryTransactions();
    }
    fetchProperties();
    fetchAccounts();
  }, [entryId]);

  const fetchEntryTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/entries/${entryId}?include_transactions=true`
      );
      setEntry(response.data);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      setError("Failed to fetch entry transactions");
      console.error("Error fetching entry transactions:", error);
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

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleOpen = (transaction = null) => {
    if (transaction) {
      setEditMode(true);
      setSelectedTransaction(transaction);
      setFormData({
        property_id: transaction.property_id,
        account_id: transaction.account_id,
        amount: transaction.amount || "",
        description: transaction.description || "",
      });
    } else {
      setEditMode(false);
      setSelectedTransaction(null);
      setFormData({
        property_id: "",
        account_id: "",
        amount: "",
        description: "",
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
      account_id: "",
      amount: "",
      description: "",
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
        const response = await axios.post(
          `${API_BASE_URL}/transactions`,
          formData
        );
        if (entryId) {
          await axios.put(`${API_BASE_URL}/entries/${entryId}`, {
            transaction_ids: [...entry.transaction_ids, response.data._id],
          });
        }
        setSuccess("Transaction created successfully");
      }
      fetchEntryTransactions();
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
        if (entryId) {
          await axios.put(`${API_BASE_URL}/entries/${entryId}`, {
            transaction_ids: entry.transaction_ids.filter(
              (id) => id !== transactionId
            ),
          });
        }
        setSuccess("Transaction deleted successfully");
        fetchEntryTransactions();
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

  const getAccountName = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.name : accountId;
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {entryId && (
            <IconButton onClick={() => navigate("/entries")} color="primary">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h4">
            {entry ? `Transactions for ${entry.title}` : "Transactions"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Transaction
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  {getPropertyName(transaction.property_id)}
                </TableCell>
                <TableCell>{getAccountName(transaction.account_id)}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(transaction)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(transaction._id)}
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
                  name="account_id"
                  label="Account"
                  value={formData.account_id}
                  onChange={handleChange}
                  fullWidth
                  required
                  select
                >
                  {accounts.map((account) => (
                    <MenuItem key={account._id} value={account._id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Transactions;
