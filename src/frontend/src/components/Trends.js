import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5001/api";

function Trends() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [years, setYears] = useState(3); // Default to 3 years
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchTrendData();
    }
  }, [selectedProperty, years]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      setError("Failed to fetch properties");
      console.error("Error fetching properties:", error);
    }
  };

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/properties/${selectedProperty}/trends?years=${years}`
      );
      setTrendData(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch trend data");
      console.error("Error fetching trend data:", error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    return new Date(2000, month - 1).toLocaleString("default", {
      month: "long",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Property Income Trends
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Property</InputLabel>
            <Select
              value={selectedProperty}
              label="Select Property"
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              {properties.map((property) => (
                <MenuItem key={property._id} value={property._id}>
                  {property.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Years to Show</InputLabel>
            <Select
              value={years}
              label="Years to Show"
              onChange={(e) => setYears(e.target.value)}
            >
              <MenuItem value={1}>1 Year</MenuItem>
              <MenuItem value={2}>2 Years</MenuItem>
              <MenuItem value={3}>3 Years</MenuItem>
              <MenuItem value={5}>5 Years</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : selectedProperty && trendData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                {trendData.map((year) => (
                  <TableCell key={year.year} align="right">
                    {year.year}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <TableRow key={month}>
                  <TableCell>{getMonthName(month)}</TableCell>
                  {trendData.map((year) => (
                    <TableCell key={`${year.year}-${month}`} align="right">
                      {formatCurrency(
                        year.monthly_data.find((m) => m.month === month)?.amount
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : selectedProperty ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No trend data available for the selected property.
        </Typography>
      ) : null}
    </Box>
  );
}

export default Trends;
