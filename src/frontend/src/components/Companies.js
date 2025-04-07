import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    status: "active",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

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
      if (selectedCompany) {
        await axios.put(`/api/companies/${selectedCompany._id}`, formData);
        setSuccess("Company updated successfully");
      } else {
        await axios.post("/api/companies", formData);
        setSuccess("Company created successfully");
      }
      setShowModal(false);
      fetchCompanies();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      description: company.description,
      status: company.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`/api/companies/${id}`);
        setSuccess("Company deleted successfully");
        fetchCompanies();
      } catch (err) {
        setError("Failed to delete company");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      status: "active",
    });
    setSelectedCompany(null);
  };

  return (
    <div>
      <h2>Companies</h2>
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
        Add New Company
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.type}</td>
              <td>{company.description}</td>
              <td>{company.status}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(company)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(company._id)}
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
            {selectedCompany ? "Edit Company" : "Add New Company"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="">Select Type</option>
                <option value="operator">Operator</option>
                <option value="investor">Investor</option>
                <option value="service">Service Provider</option>
              </Form.Select>
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
              {selectedCompany ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Companies;
