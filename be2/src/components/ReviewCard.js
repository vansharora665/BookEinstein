import React from "react";

function ReviewCard({ name, role, text }) {
  return (
    <article className="review-card">
      <p className="review-text">“{text}”</p>
      <div className="review-meta">
        <div className="avatar-circle" />
        <div>
          <p className="review-name">{name}</p>
          <p className="review-role">{role}</p>
        </div>
      </div>
    </article>
  );
}

export default ReviewCard;
