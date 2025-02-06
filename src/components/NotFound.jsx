import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ textDecoration: "none", color: "#008CBA" }}>
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
