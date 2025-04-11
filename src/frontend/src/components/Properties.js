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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5001/api";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    section: "",
    block: "",
    lot: "",
    acres: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      setError("Failed to fetch properties");
      console.error("Error fetching properties:", error);
    }
  };

  const handleOpen = (property = null) => {
    if (property) {
      setEditMode(true);
      setSelectedProperty(property);
      setFormData({
        name: property.name || "",
        description: property.description || "",
        location: {
          street: property.location?.street || "",
          city: property.location?.city || "",
          state: property.location?.state || "",
          zip: property.location?.zip || "",
        },
        section: property.section || "",
        block: property.block || "",
        lot: property.lot || "",
        acres: property.acres || "",
      });
    } else {
      setEditMode(false);
      setSelectedProperty(null);
      setFormData({
        name: "",
        description: "",
        location: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        section: "",
        block: "",
        lot: "",
        acres: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedProperty(null);
    setFormData({
      name: "",
      description: "",
      location: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      section: "",
      block: "",
      lot: "",
      acres: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${API_BASE_URL}/properties/${selectedProperty._id}`,
          formData
        );
        setSuccess("Property updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/properties`, formData);
        setSuccess("Property created successfully");
      }
      fetchProperties();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save property");
      console.error("Error saving property:", error);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`${API_BASE_URL}/properties/${propertyId}`);
        setSuccess("Property deleted successfully");
        fetchProperties();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to delete property");
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
        <Typography variant="h4">Properties</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Property
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
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Section/Block/Lot</TableCell>
              <TableCell>Acres</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property._id}>
                <TableCell>{property.name}</TableCell>
                <TableCell>{property.description}</TableCell>
                <TableCell>
                  {property.location && (
                    <>
                      {property.location.street && (
                        <>
                          {property.location.street}
                          <br />
                        </>
                      )}
                      {property.location.city && property.location.state && (
                        <>
                          {property.location.city}, {property.location.state}{" "}
                          {property.location.zip}
                        </>
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {property.section && `Section ${property.section}`}
                  {property.block && ` Block ${property.block}`}
                  {property.lot && ` Lot ${property.lot}`}
                </TableCell>
                <TableCell>{property.acres}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(property)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(property._id)}
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
        <DialogTitle>{editMode ? "Edit Property" : "Add Property"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Street Address"
              name="location.street"
              value={formData.location.street}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="City"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="State"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="ZIP Code"
                name="location.zip"
                value={formData.location.zip}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <TextField
              fullWidth
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Block"
              name="block"
              value={formData.block}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Lot"
              name="lot"
              value={formData.lot}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Acres"
              name="acres"
              type="number"
              value={formData.acres}
              onChange={handleChange}
              margin="normal"
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

export default Properties;
