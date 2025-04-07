import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";

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
    is_current_owner: true,
    date_from: "",
    date_to: "",
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
      const response = await axios.get("/api/company-ownership");
      setOwnerships(response.data);
    } catch (err) {
      setError("Failed to fetch company ownership records");
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
      if (selectedOwnership) {
        await axios.put(
          `/api/company-ownership/${selectedOwnership._id}`,
          formData
        );
        setSuccess("Company ownership record updated successfully");
      } else {
        await axios.post("/api/company-ownership", formData);
        setSuccess("Company ownership record created successfully");
      }
      setShowModal(false);
      fetchOwnerships();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (ownership) => {
    setSelectedOwnership(ownership);
    setFormData({
      property_id: ownership.property_id,
      company_id: ownership.company_id,
      interest_type: ownership.interest_type,
      percentage: ownership.percentage,
      well_type: ownership.well_type || "",
      is_current_owner: ownership.is_current_owner,
      date_from: ownership.date_from.split("T")[0],
      date_to: ownership.date_to ? ownership.date_to.split("T")[0] : "",
      status: ownership.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this company ownership record?"
      )
    ) {
      try {
        await axios.delete(`/api/company-ownership/${id}`);
        setSuccess("Company ownership record deleted successfully");
        fetchOwnerships();
      } catch (err) {
        setError("Failed to delete company ownership record");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      property_id: "",
      company_id: "",
      interest_type: "",
      percentage: "",
      well_type: "",
      is_current_owner: true,
      date_from: "",
      date_to: "",
      status: "active",
    });
    setSelectedOwnership(null);
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    return property ? property.name : "Unknown Property";
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.name : "Unknown Company";
  };

  const handleCurrentOwnerChange = (e) => {
    const isCurrentOwner = e.target.checked;
    setFormData({
      ...formData,
      is_current_owner: isCurrentOwner,
      date_to: isCurrentOwner ? "" : formData.date_to,
    });
  };

  return (
    <div>
      <h2>Company Ownership</h2>
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
            <th>Current Owner</th>
            <th>Date From</th>
            <th>Date To</th>
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
              <td>{ownership.well_type || "-"}</td>
              <td>{ownership.is_current_owner ? "Yes" : "No"}</td>
              <td>{new Date(ownership.date_from).toLocaleDateString()}</td>
              <td>
                {ownership.date_to
                  ? new Date(ownership.date_to).toLocaleDateString()
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
                min="0"
                max="100"
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
                placeholder="e.g., vertical, horizontal, directional"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Current Owner"
                checked={formData.is_current_owner}
                onChange={handleCurrentOwnerChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date From</Form.Label>
              <Form.Control
                type="date"
                value={formData.date_from}
                onChange={(e) =>
                  setFormData({ ...formData, date_from: e.target.value })
                }
                required
              />
            </Form.Group>

            {!formData.is_current_owner && (
              <Form.Group className="mb-3">
                <Form.Label>Date To</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date_to}
                  onChange={(e) =>
                    setFormData({ ...formData, date_to: e.target.value })
                  }
                  required
                />
              </Form.Group>
            )}

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
