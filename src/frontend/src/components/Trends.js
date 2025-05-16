import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [years, setYears] = useState(3); // Default to 3 years
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTrendData();
    }
  }, [selectedAccount, years]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      setError("Failed to fetch accounts");
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      // Get initial account balance
      const accountResponse = await axios.get(
        `${API_BASE_URL}/accounts/${selectedAccount}`
      );
      const initialBalance = accountResponse.data.balance || 0;

      // Get all transactions for the account
      const transactionsResponse = await axios.get(
        `${API_BASE_URL}/transactions`
      );
      const accountTransactions = transactionsResponse.data.filter(
        (t) => t.account_id === selectedAccount
      );

      // Calculate monthly balances
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - years + 1;
      const monthlyBalances = {};

      // Initialize monthly balances with initial balance
      for (let year = startYear; year <= currentYear; year++) {
        monthlyBalances[year] = {};
        for (let month = 1; month <= 12; month++) {
          monthlyBalances[year][month] = initialBalance;
        }
      }

      // Sort transactions by date
      accountTransactions.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      // Calculate running balance for each transaction
      let runningBalance = initialBalance;
      for (const transaction of accountTransactions) {
        const date = new Date(transaction.created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (year >= startYear && year <= currentYear) {
          runningBalance += parseFloat(transaction.amount);
          monthlyBalances[year][month] = runningBalance;
        }
      }

      // Format data for display
      const formattedData = Object.entries(monthlyBalances).map(
        ([year, months]) => ({
          year: parseInt(year),
          monthly_data: Object.entries(months).map(([month, balance]) => ({
            month: parseInt(month),
            amount: balance,
          })),
        })
      );

      setTrendData(formattedData);
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

  const handleCellClick = (year, month) => {
    // Navigate to transactions page with filters
    navigate(`/entries`, {
      state: {
        filters: {
          account_id: selectedAccount,
          year: year,
          month: month,
        },
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Balance Trends
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Account</InputLabel>
            <Select
              value={selectedAccount}
              label="Select Account"
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.map((account) => (
                <MenuItem key={account._id} value={account._id}>
                  {account.name} ({account.account_type})
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
      ) : selectedAccount && trendData.length > 0 ? (
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
                  {trendData.map((year) => {
                    const amount = year.monthly_data.find(
                      (m) => m.month === month
                    )?.amount;
                    return (
                      <TableCell
                        key={`${year.year}-${month}`}
                        align="right"
                        onClick={() => handleCellClick(year.year, month)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                          "&:active": {
                            backgroundColor: "rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        {formatCurrency(amount)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : selectedAccount ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No trend data available for the selected account.
        </Typography>
      ) : null}
    </Box>
  );
}

export default Trends;
