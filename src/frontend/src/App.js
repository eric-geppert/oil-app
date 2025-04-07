import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import Properties from "./components/Properties";
import Companies from "./components/Companies";
import Transactions from "./components/Transactions";
import CompanyOwnership from "./components/CompanyOwnership";

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Oil App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/properties">
                  Properties
                </Nav.Link>
                <Nav.Link as={Link} to="/companies">
                  Companies
                </Nav.Link>
                <Nav.Link as={Link} to="/transactions">
                  Transactions
                </Nav.Link>
                <Nav.Link as={Link} to="/company-ownership">
                  Company Ownership
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/" element={<Properties />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/company-ownership" element={<CompanyOwnership />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
