import "./survey.css";

export default function TopicSurvey({ onSubmit }) {
  return (
    <div className="survey-overlay">
      <div className="survey-card">
        <h2>Quick Feedback</h2>
        <p>Help us improve this topic 😊</p>

        <label>
          What did you understand best?
          <textarea placeholder="Your thoughts..." />
        </label>

        <label>
          Was this topic easy to follow?
          <select>
            <option>Yes</option>
            <option>Somewhat</option>
            <option>No</option>
          </select>
        </label>

        <label>
          Rate this topic
          <div className="rating">
            {[1,2,3,4,5].map(n => (
              <span key={n}>⭐</span>
            ))}
          </div>
        </label>

        <div className="survey-actions">
          <button className="secondary">Skip</button>
          <button className="primary" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
