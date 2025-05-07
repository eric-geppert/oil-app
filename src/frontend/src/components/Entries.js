import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5001/api";

function Entries() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    entry_date: "",
    entry_type: "monthly",
    status: "draft",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

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
      navigate(`/entries/${entry._id}/transactions`, {
        state: { entry: response.data },
      });
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
      entry_date: "",
      entry_type: "monthly",
      status: "draft",
    });
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
          <Box sx={{ mt: 2 }}>
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
                  rows={4}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Entries;
