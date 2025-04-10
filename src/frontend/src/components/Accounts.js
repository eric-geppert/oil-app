import React, { useState, useEffect } from "react";
import axios from "axios";
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
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    account_type: "",
    account_number: "",
    bank_name: "",
    description: "",
    status: "active",
  });

  const accountTypes = ["checking", "savings", "investment", "credit", "other"];

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/accounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpen = (account = null) => {
    if (account) {
      setEditMode(true);
      setSelectedAccount(account);
      setFormData({
        name: account.name,
        account_type: account.account_type,
        account_number: account.account_number,
        bank_name: account.bank_name || "",
        description: account.description || "",
        status: account.status,
      });
    } else {
      setEditMode(false);
      setSelectedAccount(null);
      setFormData({
        name: "",
        account_type: "",
        account_number: "",
        bank_name: "",
        description: "",
        status: "active",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedAccount(null);
    setFormData({
      name: "",
      account_type: "",
      account_number: "",
      bank_name: "",
      description: "",
      status: "active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5001/api/accounts/${selectedAccount._id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5001/api/accounts", formData);
      }
      fetchAccounts();
      handleClose();
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await axios.delete(`http://localhost:5001/api/accounts/${accountId}`);
        fetchAccounts();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        <Typography variant="h4">Accounts</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Account
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Account Number</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.account_type}</TableCell>
                <TableCell>{account.account_number}</TableCell>
                <TableCell>{account.bank_name || "-"}</TableCell>
                <TableCell>{account.description || "-"}</TableCell>
                <TableCell>{account.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(account)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(account._id)}
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Edit Account" : "Add Account"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Account Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="account_type"
                  label="Account Type"
                  value={formData.account_type}
                  onChange={handleChange}
                  fullWidth
                  required
                  select
                >
                  {accountTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="account_number"
                  label="Account Number"
                  value={formData.account_number}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="bank_name"
                  label="Bank Name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                  required
                  select
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
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
};

export default Accounts;
