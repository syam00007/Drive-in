// src/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="mb-4">
      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/create" className="nav-link">Create Profile</Link>
        </li>
        <li className="nav-item">
          <Link to="/view" className="nav-link">View Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
