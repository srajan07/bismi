// src/components/Reviews.js
import React from "react";
import "./Review.css"; // You can style the reviews in a separate CSS file

const reviewsData = [
  {
    name: "John Doe",
    rating: 5,
    comment: "The food was amazing! Will definitely come again.",
  },
  {
    name: "Jane Smith",
    rating: 4,
    comment: "Great ambiance and tasty food, but a bit slow service.",
  },
  {
    name: "Sam Wilson",
    rating: 5,
    comment: "Absolutely loved the experience. Highly recommend!",
  },
];

const Review = () => {
  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      <div className="reviews-list">
        {reviewsData.map((review, index) => (
          <div key={index} className="review-card">
            <h3>{review.name}</h3>
            <p>Rating: {review.rating} / 5</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
