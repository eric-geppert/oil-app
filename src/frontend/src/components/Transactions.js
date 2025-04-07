import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";

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
    description: "",
    status: "active",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchProperties();
    fetchCompanies();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions");
      setTransactions(response.data);
    } catch (err) {
      setError("Failed to fetch transactions");
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get("/api/properties");
      setProperties(response.data);
    } catch (err) {
      setError("Failed to fetch properties");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("/api/companies");
      setCompanies(response.data);
    } catch (err) {
      setError("Failed to fetch companies");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTransaction) {
        await axios.put(
          `/api/transactions/${selectedTransaction._id}`,
          formData
        );
        setSuccess("Transaction updated successfully");
      } else {
        await axios.post("/api/transactions", formData);
        setSuccess("Transaction created successfully");
      }
      setShowModal(false);
      fetchTransactions();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      property_id: transaction.property_id,
      company_id: transaction.company_id,
      transaction_date: transaction.transaction_date.split("T")[0],
      gross_amount: transaction.gross_amount,
      net_amount: transaction.net_amount || "",
      taxes_paid_amount: transaction.taxes_paid_amount || "",
      description: transaction.description,
      status: transaction.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        setSuccess("Transaction deleted successfully");
        fetchTransactions();
      } catch (err) {
        setError("Failed to delete transaction");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      property_id: "",
      company_id: "",
      transaction_date: "",
      gross_amount: "",
      net_amount: "",
      taxes_paid_amount: "",
      description: "",
      status: "active",
    });
    setSelectedTransaction(null);
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    return property ? property.name : "Unknown Property";
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.name : "Unknown Company";
  };

  return (
    <div>
      <h2>Transactions</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button
        variant="primary"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="mb-3"
      >
        Add New Transaction
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Property</th>
            <th>Company</th>
            <th>Date</th>
            <th>Gross Amount</th>
            <th>Net Amount</th>
            <th>Taxes Paid</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{getPropertyName(transaction.property_id)}</td>
              <td>{getCompanyName(transaction.company_id)}</td>
              <td>
                {new Date(transaction.transaction_date).toLocaleDateString()}
              </td>
              <td>${transaction.gross_amount.toFixed(2)}</td>
              <td>${transaction.net_amount?.toFixed(2) || "-"}</td>
              <td>${transaction.taxes_paid_amount?.toFixed(2) || "-"}</td>
              <td>{transaction.description}</td>
              <td>{transaction.status}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(transaction)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(transaction._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTransaction ? "Edit Transaction" : "Add New Transaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Property</Form.Label>
              <Form.Select
                value={formData.property_id}
                onChange={(e) =>
                  setFormData({ ...formData, property_id: e.target.value })
                }
                required
              >
                <option value="">Select Property</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Select
                value={formData.company_id}
                onChange={(e) =>
                  setFormData({ ...formData, company_id: e.target.value })
                }
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.transaction_date}
                onChange={(e) =>
                  setFormData({ ...formData, transaction_date: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gross Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.gross_amount}
                onChange={(e) =>
                  setFormData({ ...formData, gross_amount: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Net Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.net_amount}
                onChange={(e) =>
                  setFormData({ ...formData, net_amount: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Taxes Paid Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.taxes_paid_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxes_paid_amount: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedTransaction ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Transactions;
