import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5001/api";

function Dashboard() {
  const [stats, setStats] = useState({
    companies: 0,
    transactions: 0,
    companyOwnerships: 0,
    entries: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const [companiesRes, transactionsRes, ownershipsRes, entriesRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/companies`),
          axios.get(`${API_BASE_URL}/transactions`),
          axios.get(`${API_BASE_URL}/company-ownership`),
          axios.get(`${API_BASE_URL}/entries`),
        ]);

      // Get recent transactions
      const recentTransactionsRes = await axios.get(
        `${API_BASE_URL}/transactions?limit=5`
      );

      setStats({
        companies: companiesRes.data.length,
        transactions: transactionsRes.data.length,
        companyOwnerships: ownershipsRes.data.length,
        entries: entriesRes.data.length,
      });

      setRecentTransactions(recentTransactionsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <BusinessIcon
                sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4">{stats.companies}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Companies
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <ReceiptIcon
                sx={{ fontSize: 40, color: "success.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4">{stats.transactions}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Transactions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <AccountBalanceIcon
                sx={{ fontSize: 40, color: "info.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4">{stats.companyOwnerships}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ownership Records
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <DescriptionIcon
                sx={{ fontSize: 40, color: "warning.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4">{stats.entries}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Entries
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentTransactions.length > 0 ? (
              <Grid container spacing={2}>
                {recentTransactions.map((transaction) => (
                  <Grid item xs={12} key={transaction._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              Date
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(transaction.transaction_date)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              Amount
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {formatCurrency(transaction.gross_amount)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              From
                            </Typography>
                            <Typography variant="body1">
                              {transaction.company_from_name || "Unknown"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              To
                            </Typography>
                            <Typography variant="body1">
                              {transaction.company_to_name || "Unknown"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1">
                No recent transactions found.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
