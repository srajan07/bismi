import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="about-us">
          <h3>About Us</h3>
          <p>
            Welcome to Bismi Restaurant, where we serve delicious and freshly prepared dishes in a cozy and elegant atmosphere.
            Our chefs use the finest ingredients to bring you mouth-watering meals that will make you feel at home.
            Experience the joy of dining with us!
          </p>
        </div>

        <div className="contact-info">
          <span><strong>Email:</strong> <a href="mailto:info@bismirestaurant.com">info@bismi.com</a></span>
          <span><strong>Phone:</strong> <a href="tel:+1234567890">+1 234567890</a></span>
          <p><strong>Address:</strong> 1234 Flavor Street, Delhi, India</p>
        </div>
      </div>

      <div className="social-media">
        <a href="https://facebook.com/bismirestaurant" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://instagram.com/bismirestaurant" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://twitter.com/bismirestaurant" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <i className="fab fa-twitter"></i>
        </a>
      </div>

      <div className="copyright">
        <p>© 2025 Bismi Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
