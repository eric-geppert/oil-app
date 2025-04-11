import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5001/api";

function CompanyOwnership() {
  const [ownerships, setOwnerships] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_id: "",
    property_id: "",
    percentage: "",
    interest_type: "",
    date_from: "",
    date_to: "",
    notes: "",
    is_current_owner: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedOwnership, setSelectedOwnership] = useState(null);

  useEffect(() => {
    fetchOwnerships();
    fetchCompanies();
    fetchProperties();
  }, []);

  const fetchOwnerships = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-ownership`);
      setOwnerships(response.data);
    } catch (error) {
      setError("Failed to fetch company ownership relationships");
      console.error("Error fetching company ownership:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      setError("Failed to fetch companies");
      console.error("Error fetching companies:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      setError("Failed to fetch properties");
      console.error("Error fetching properties:", error);
    }
  };

  const handleOpen = (ownership = null) => {
    if (ownership) {
      setEditMode(true);
      setSelectedOwnership(ownership);
      setFormData({
        company_id: ownership.company_id || "",
        property_id: ownership.property_id || "",
        percentage: ownership.percentage || "",
        interest_type: ownership.interest_type || "",
        date_from: ownership.date_from ? ownership.date_from.split("T")[0] : "",
        date_to: ownership.date_to ? ownership.date_to.split("T")[0] : "",
        notes: ownership.notes || "",
        is_current_owner: ownership.is_current_owner ?? true,
      });
    } else {
      setEditMode(false);
      setSelectedOwnership(null);
      setFormData({
        company_id: "",
        property_id: "",
        percentage: "",
        interest_type: "",
        date_from: "",
        date_to: "",
        notes: "",
        is_current_owner: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedOwnership(null);
    setFormData({
      company_id: "",
      property_id: "",
      percentage: "",
      interest_type: "",
      date_from: "",
      date_to: "",
      notes: "",
      is_current_owner: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "company_id",
      "property_id",
      "percentage",
      "interest_type",
      "date_from",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Validate percentage is a valid number
    const percentage = parseFloat(formData.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setError("Percentage must be a valid number between 0 and 100");
      return;
    }

    // Validate date_to is required when is_current_owner is false
    if (!formData.is_current_owner && !formData.date_to) {
      setError(
        "End date is required when the company is not the current owner"
      );
      return;
    }

    try {
      // Convert percentage to a number
      const formDataToSubmit = {
        ...formData,
        percentage: percentage,
        is_current_owner: formData.is_current_owner,
      };

      // Remove date_to if is_current_owner is true
      if (formDataToSubmit.is_current_owner) {
        delete formDataToSubmit.date_to;
      }

      if (editMode) {
        await axios.put(
          `${API_BASE_URL}/company-ownership/${selectedOwnership._id}`,
          formDataToSubmit
        );
        setSuccess("Company property ownership updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/company-ownership`, formDataToSubmit);
        setSuccess("Company property ownership created successfully");
      }
      fetchOwnerships();
      handleClose();
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to save company property ownership"
      );
      console.error("Error saving company property ownership:", error);
    }
  };

  const handleDelete = async (ownershipId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this company property ownership?"
      )
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/company-ownership/${ownershipId}`);
        setSuccess("Company property ownership deleted successfully");
        fetchOwnerships();
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Failed to delete company property ownership"
        );
        console.error("Error deleting company property ownership:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_current_owner" ? checked : value,
    });
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.name : companyId;
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    return property ? property.name : propertyId;
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
        <Typography variant="h4">Company Property Ownership</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Property Ownership
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
              <TableCell>Company</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Interest Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Current Owner</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownerships.map((ownership) => (
              <TableRow key={ownership._id}>
                <TableCell>{getCompanyName(ownership.company_id)}</TableCell>
                <TableCell>{getPropertyName(ownership.property_id)}</TableCell>
                <TableCell>{ownership.percentage}%</TableCell>
                <TableCell>{ownership.interest_type}</TableCell>
                <TableCell>
                  {ownership.date_from
                    ? new Date(ownership.date_from).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {ownership.date_to
                    ? new Date(ownership.date_to).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {ownership.is_current_owner ? "Yes" : "No"}
                </TableCell>
                <TableCell>{ownership.notes}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(ownership)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(ownership._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Edit Property Ownership" : "Add Property Ownership"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Company</InputLabel>
              <Select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
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

            <FormControl fullWidth margin="normal">
              <InputLabel>Property</InputLabel>
              <Select
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
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

            <TextField
              fullWidth
              label="Percentage"
              name="percentage"
              type="number"
              value={formData.percentage}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: "%",
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Interest Type</InputLabel>
              <Select
                name="interest_type"
                value={formData.interest_type}
                onChange={handleChange}
                label="Interest Type"
                required
              >
                <MenuItem value="working interest">Working Interest</MenuItem>
                <MenuItem value="royalty interest">Royalty Interest</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Start Date"
              name="date_from"
              type="date"
              value={formData.date_from}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_current_owner}
                  onChange={handleChange}
                  name="is_current_owner"
                />
              }
              label="Current Owner"
            />

            {!formData.is_current_owner && (
              <TextField
                fullWidth
                label="End Date"
                name="date_to"
                type="date"
                value={formData.date_to}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            )}

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
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

export default CompanyOwnership;
