import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  

  return (
    <header>
      <div className="logo">
        <Link to="/" style={{ color: "black" }}>
          <i className="fas fa-utensils"></i> Bismi{" "}
          <span style={{ color: "#f39c12" }}>Restaurant</span>
        </Link>
      </div>

      <nav>
       
            <Link to="/">Home</Link>
            <Link to="/booking">Reserve</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin">Admin</Link>
         </nav>
    </header>
  );
}

export default Header;
