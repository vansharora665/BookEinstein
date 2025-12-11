import React from "react";

function HelpPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Help &amp; support</h1>
        <p>
          Stuck somewhere? Explore quick guides, FAQs, and ways to contact our
          support team or your school coordinator.
        </p>
      </div>

      <div className="page-grid">
        <div className="help-card">
          <h3>Getting started guide</h3>
          <p>
            Learn how to navigate modules, complete activities, and track your
            progress across devices.
          </p>
          <ul>
            <li>How to choose your first module</li>
            <li>How XP and badges are calculated</li>
            <li>Device and browser recommendations</li>
          </ul>
          <button className="module-primary-btn">Open guide</button>
        </div>

        <div className="help-card">
          <h3>Frequently asked questions</h3>
          <p>
            Find answers about accounts, progress reset, certificates, and
            parental access to reports.
          </p>
          <ul>
            <li>How do I reset a module?</li>
            <li>Can my parents see my progress?</li>
            <li>What if I miss a live session?</li>
          </ul>
          <button className="module-secondary-btn">View FAQs</button>
        </div>

        <div className="help-card">
          <h3>Contact support</h3>
          <p>
            Reach out for technical issues or content doubts that teachers
            cannot resolve directly.
          </p>
          <ul>
            <li>Email: support@bookeinstein.ai</li>
            <li>Response within 24 hours on school days</li>
            <li>Emergency chat during live exams &amp; contests</li>
          </ul>
          <button className="module-secondary-btn">Send a message</button>
        </div>
      </div>
    </section>
  );
}

export default HelpPage;
