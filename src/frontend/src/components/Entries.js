import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5001/api";

function Entries() {
  const [entries, setEntries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    transaction_ids: [],
    entry_date: "",
    entry_type: "monthly",
    status: "draft",
  });
  const [transactionForm, setTransactionForm] = useState({
    property_id: "",
    company_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionErrorMessage, setTransactionErrorMessage] = useState("");
  const [transactionSuccessMessage, setTransactionSuccessMessage] =
    useState("");

  useEffect(() => {
    fetchEntries();
    fetchCompanies();
    fetchProperties();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/entries`);
      setEntries(response.data);
    } catch (error) {
      setError("Failed to fetch entries");
      console.error("Error fetching entries:", error);
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

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleOpen = (entry = null) => {
    if (entry) {
      setEditMode(true);
      setSelectedEntry(entry);
      setFormData({
        title: entry.title || "",
        description: entry.description || "",
        transaction_ids: entry.transaction_ids || [],
        entry_date: entry.entry_date ? entry.entry_date.split("T")[0] : "",
        entry_type: entry.entry_type || "monthly",
        status: entry.status || "draft",
      });
    } else {
      setEditMode(false);
      setSelectedEntry(null);
      setFormData({
        title: "",
        description: "",
        transaction_ids: [],
        entry_date: "",
        entry_type: "monthly",
        status: "draft",
      });
    }
    setShowModal(true);
  };

  const handleView = async (entry) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/entries/${entry._id}?include_transactions=true`
      );
      setSelectedEntry(response.data);
      setShowViewModal(true);
    } catch (error) {
      setError("Failed to fetch entry details");
      console.error("Error fetching entry details:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowViewModal(false);
    setEditMode(false);
    setSelectedEntry(null);
    setFormData({
      title: "",
      description: "",
      transaction_ids: [],
      entry_date: "",
      entry_type: "monthly",
      status: "draft",
    });
    setTransactionForm({
      property_id: "",
      company_id: "",
      transaction_date: new Date().toISOString().split("T")[0],
      amount: "",
      description: "",
    });
    setShowTransactionForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${API_BASE_URL}/entries/${selectedEntry._id}`,
          formData
        );
        setSuccess("Entry updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/entries`, formData);
        setSuccess("Entry created successfully");
      }
      fetchEntries();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save entry");
      console.error("Error saving entry:", error);
    }
  };

  const handleDelete = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`${API_BASE_URL}/entries/${entryId}`);
        setSuccess("Entry deleted successfully");
        fetchEntries();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to delete entry");
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransactionChange = (e) => {
    setTransactionForm({
      ...transactionForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transactions`,
        transactionForm
      );
      const newTransaction = response.data;
      setTransactions([...transactions, newTransaction]);
      setTransactionModalOpen(false);
      setTransactionForm({
        property_id: "",
        company_id: "",
        transaction_date: new Date().toISOString().split("T")[0],
        amount: "",
        description: "",
      });
      setTransactionSuccessMessage("Transaction created successfully");
    } catch (error) {
      setTransactionErrorMessage(
        error.response?.data?.error || "Error creating transaction"
      );
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.name : "Unknown Company";
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    return property ? property.name : "Unknown Property";
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
        <Typography variant="h4">Entries</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Entry
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Transactions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell>{entry.title}</TableCell>
                <TableCell>
                  {entry.entry_date
                    ? new Date(entry.entry_date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{entry.entry_type}</TableCell>
                <TableCell>{entry.status}</TableCell>
                <TableCell>{entry.transaction_ids?.length || 0}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleView(entry)}
                    title="View"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(entry)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(entry._id)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Entry Form Modal */}
      <Dialog open={showModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? "Edit Entry" : "Add Entry"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Entry Date"
                  name="entry_date"
                  type="date"
                  value={formData.entry_date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Entry Type</InputLabel>
                  <Select
                    name="entry_type"
                    value={formData.entry_type}
                    onChange={handleChange}
                    label="Entry Type"
                    required
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annual">Annual</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                    required
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="submitted">Submitted</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Transactions</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowTransactionForm(!showTransactionForm)}
                >
                  {showTransactionForm ? "Cancel" : "Add Transaction"}
                </Button>
              </Box>

              {showTransactionForm && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    New Transaction
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        value={transactionForm.amount}
                        onChange={handleTransactionChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date"
                        name="transaction_date"
                        type="date"
                        value={transactionForm.transaction_date}
                        onChange={handleTransactionChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Property</InputLabel>
                        <Select
                          name="property_id"
                          value={transactionForm.property_id}
                          onChange={handleTransactionChange}
                          label="Property"
                          required
                        >
                          {properties.map((property) => (
                            <MenuItem key={property._id} value={property._id}>
                              {property.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Company</InputLabel>
                        <Select
                          name="company_id"
                          value={transactionForm.company_id}
                          onChange={handleTransactionChange}
                          label="Company"
                          required
                        >
                          {companies.map((company) => (
                            <MenuItem key={company._id} value={company._id}>
                              {company.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={transactionForm.description}
                        onChange={handleTransactionChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTransactionSubmit}
                        sx={{ mt: 1 }}
                      >
                        Add Transaction
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Divider sx={{ my: 2 }} />

              <List>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <ListItem key={transaction._id}>
                      <ListItemText
                        primary={`Transaction #${
                          transactions.indexOf(transaction) + 1
                        }`}
                        secondary={`ID: ${transaction._id}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            const updatedTransactions = transactions.filter(
                              (t) => t._id !== transaction._id
                            );
                            setTransactions(updatedTransactions);
                            setTransactionSuccessMessage(
                              "Transaction removed successfully"
                            );
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No transactions added yet
                  </Typography>
                )}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Entry Modal */}
      <Dialog
        open={showViewModal}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Entry Details</DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{selectedEntry.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEntry.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Entry Date:</Typography>
                  <Typography variant="body1">
                    {selectedEntry.entry_date
                      ? new Date(selectedEntry.entry_date).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Entry Type:</Typography>
                  <Typography variant="body1">
                    {selectedEntry.entry_type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Typography variant="body1">
                    {selectedEntry.status}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Transactions
              </Typography>

              {selectedEntry.transactions &&
              selectedEntry.transactions.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Property</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedEntry.transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            {new Date(
                              transaction.transaction_date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getCompanyName(transaction.company_id)}
                          </TableCell>
                          <TableCell>
                            {getPropertyName(transaction.property_id)}
                          </TableCell>
                          <TableCell>
                            ${parseFloat(transaction.amount).toFixed(2)}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  No transactions found
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Modal */}
      <Dialog
        open={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
      >
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Property ID"
            type="text"
            fullWidth
            value={transactionForm.property_id}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                property_id: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Company ID"
            type="text"
            fullWidth
            value={transactionForm.company_id}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                company_id: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Transaction Date"
            type="date"
            fullWidth
            value={transactionForm.transaction_date}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                transaction_date: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={transactionForm.amount}
            onChange={(e) =>
              setTransactionForm({ ...transactionForm, amount: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={transactionForm.description}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                description: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransactionModalOpen(false)}>Cancel</Button>
          <Button onClick={handleTransactionSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Entries;
