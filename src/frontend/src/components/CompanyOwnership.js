import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

function CompanyOwnership() {
  const [ownerships, setOwnerships] = useState([]);
  const [properties, setProperties] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOwnership, setSelectedOwnership] = useState(null);
  const [formData, setFormData] = useState({
    property_id: "",
    company_id: "",
    interest_type: "",
    percentage: "",
    well_type: "",
    current_owner_status: "",
    start_date: "",
    end_date: "",
    status: "active",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOwnerships();
    fetchProperties();
    fetchCompanies();
  }, []);

  const fetchOwnerships = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-ownership`);
      setOwnerships(response.data);
    } catch (error) {
      setError("Failed to fetch company ownership records");
      console.error("Error fetching company ownership records:", error);
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

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedOwnership) {
        await axios.put(
          `${API_BASE_URL}/company-ownership/${selectedOwnership._id}`,
          formData
        );
        setSuccess("Company ownership record updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/company-ownership`, formData);
        setSuccess("Company ownership record created successfully");
      }
      setShowModal(false);
      fetchOwnerships();
      resetForm();
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to save company ownership record"
      );
      console.error("Error saving company ownership record:", error);
    }
  };

  const handleEdit = (ownership) => {
    setSelectedOwnership(ownership);
    setFormData({
      property_id: ownership.property_id,
      company_id: ownership.company_id,
      interest_type: ownership.interest_type,
      percentage: ownership.percentage,
      well_type: ownership.well_type,
      current_owner_status: ownership.current_owner_status,
      start_date: ownership.start_date.split("T")[0],
      end_date: ownership.end_date ? ownership.end_date.split("T")[0] : "",
      status: ownership.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (ownershipId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this company ownership record?"
      )
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/company-ownership/${ownershipId}`);
        setSuccess("Company ownership record deleted successfully");
        fetchOwnerships();
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Failed to delete company ownership record"
        );
        console.error("Error deleting company ownership record:", error);
      }
    }
  };

  const resetForm = () => {
    setSelectedOwnership(null);
    setFormData({
      property_id: "",
      company_id: "",
      interest_type: "",
      percentage: "",
      well_type: "",
      current_owner_status: "",
      start_date: "",
      end_date: "",
      status: "active",
    });
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
    <div className="container mt-4">
      <h2>Company Ownership</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        Add New Company Ownership
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Property</th>
            <th>Company</th>
            <th>Interest Type</th>
            <th>Percentage</th>
            <th>Well Type</th>
            <th>Current Owner Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ownerships.map((ownership) => (
            <tr key={ownership._id}>
              <td>{getPropertyName(ownership.property_id)}</td>
              <td>{getCompanyName(ownership.company_id)}</td>
              <td>{ownership.interest_type}</td>
              <td>{ownership.percentage}%</td>
              <td>{ownership.well_type}</td>
              <td>{ownership.current_owner_status}</td>
              <td>{new Date(ownership.start_date).toLocaleDateString()}</td>
              <td>
                {ownership.end_date
                  ? new Date(ownership.end_date).toLocaleDateString()
                  : "-"}
              </td>
              <td>{ownership.status}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(ownership)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(ownership._id)}
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
            {selectedOwnership
              ? "Edit Company Ownership"
              : "Add New Company Ownership"}
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
              <Form.Label>Interest Type</Form.Label>
              <Form.Control
                type="text"
                value={formData.interest_type}
                onChange={(e) =>
                  setFormData({ ...formData, interest_type: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Percentage</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData({ ...formData, percentage: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Well Type</Form.Label>
              <Form.Control
                type="text"
                value={formData.well_type}
                onChange={(e) =>
                  setFormData({ ...formData, well_type: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Owner Status</Form.Label>
              <Form.Control
                type="text"
                value={formData.current_owner_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current_owner_status: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
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
              {selectedOwnership ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CompanyOwnership;
