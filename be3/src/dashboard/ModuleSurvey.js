import "./survey.css";

export default function ModuleSurvey({ onSubmit }) {
  return (
    <div className="survey-overlay">
      <div className="survey-card large">
        <h2>Module Feedback 🎉</h2>
        <p>You’ve completed this module. Tell us about your experience.</p>

        <label>
          What was the most valuable part?
          <textarea />
        </label>

        <label>
          Which topic was hardest?
          <textarea />
        </label>

        <label>
          Do you feel more confident now?
          <select>
            <option>Yes</option>
            <option>Somewhat</option>
            <option>No</option>
          </select>
        </label>

        <label>
          Rate overall module quality
          <div className="rating">
            {[1,2,3,4,5].map(n => (
              <span key={n}>⭐</span>
            ))}
          </div>
        </label>

        <label>
          Any suggestions?
          <textarea />
        </label>

        <div className="survey-actions">
          <button className="primary" onClick={onSubmit}>
            Finish Module
          </button>
        </div>
      </div>
    </div>
  );
}
