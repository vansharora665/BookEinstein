import React from "react";

function CommunityPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Community</h1>
        <p>
          Join other learners, share your AI projects, and participate in
          monthly challenges curated by mentors.
        </p>
      </div>

      <div className="page-grid">
        <div className="community-card">
          <h3>Discussion rooms</h3>
          <p>
            Ask questions, share ideas, and get help from peers learning the
            same topics. Separate rooms for Class 9–10 and Class 11–12.
          </p>
          <ul>
            <li>#intro-to-ai – beginners ask anything</li>
            <li>#projects – showcase your builds</li>
            <li>#doubts – quick conceptual questions</li>
          </ul>
          <button className="module-primary-btn">Open discussions</button>
        </div>

        <div className="community-card">
          <h3>Monthly AI challenges</h3>
          <p>
            Work on a themed project every month – from chatbots to image
            classifiers – and climb a separate challenge leaderboard.
          </p>
          <ul>
            <li>Guided prompts &amp; starter datasets</li>
            <li>Peer feedback and mentor comments</li>
            <li>Digital certificates for top performers</li>
          </ul>
          <button className="module-secondary-btn">
            View this month’s brief
          </button>
        </div>

        <div className="community-card">
          <h3>Mentor sessions</h3>
          <p>
            Attend live Q&amp;A with AI engineers and researchers to understand
            how AI is used in real companies and research labs.
          </p>
          <ul>
            <li>Career guidance and college tips</li>
            <li>Demo of real ML tools and platforms</li>
            <li>Short recorded recaps for revision</li>
          </ul>
          <button className="module-secondary-btn">Upcoming sessions</button>
        </div>
      </div>
    </section>
  );
}

export default CommunityPage;
