// src/Components/Header.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "./Components/css/Header.css";

function Header() {
  const [logindetails, setLogindetails] = useState({ username: "", password: "" });
  const [adminlogin, setAdminlogin] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9098/api/cp/login", logindetails);
      if (response.status === 200) {
        sessionStorage.setItem("login", "200");
        setAdminlogin(200);
        setShowLogin(false);
        // Replace the history entry so that the home page is removed
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      window.alert("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("login");
    setAdminlogin(0);
    setShowLogoutConfirm(false);
    navigate("/");
  };

  useEffect(() => {
    const sessionLogin = sessionStorage.getItem("login");
    setAdminlogin(sessionLogin === "200" ? 200 : 0);
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <span className="brand-text">Drive-In</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {adminlogin === 200 ? (
              <Button variant="outline-danger" onClick={() => setShowLogoutConfirm(true)}>
                Logout <i className="bi bi-box-arrow-right ms-2"></i>
              </Button>
            ) : (
              <Button variant="outline-warning" onClick={() => setShowLogin(true)}>
                Admin Login <i className="bi bi-lock-fill ms-2"></i>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <h4 className="fw-bold">Admin Portal</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                autoFocus
                value={logindetails.username}
                onChange={(e) => setLogindetails({ ...logindetails, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={logindetails.password}
                  onChange={(e) => setLogindetails({ ...logindetails, password: e.target.value })}
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </Button>
              </div>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="warning" type="submit" size="lg">
                Sign In
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowLogin(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutConfirm} onHide={() => setShowLogoutConfirm(false)} centered>
        <Modal.Body className="text-center py-4">
          <h5 className="mb-3">Are you sure you want to logout?</h5>
          <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)} className="me-2">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Confirm Logout
          </Button>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}

export default Header;
