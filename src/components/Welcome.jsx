import React from 'react';
import './Welcome.css'; 
import Menu from './Menu';  // Assuming Menu is another component
import Review from './Review';  // Assuming Review is another component

function Welcome() {
  return (
    <div>
      <div className="welcome">
        <div className="text-content">
          <h2>Welcome to Bismi Restaurant</h2>
          <p>
            Experience the finest Indian cuisine with a delightful variety of flavors. 
            Enjoy delicious dishes made with authentic recipes and fresh ingredients. 
            Our menu is crafted with care, offering a true taste of India.
          </p>
          <a href="#menu" className="explore-btn">Explore Our Menu</a>
        </div>
      </div>

      {/* Ensure that Menu and Review are shown below the welcome text */}
      <Menu />
      <Review />
    </div>
  );
}

export default Welcome;



