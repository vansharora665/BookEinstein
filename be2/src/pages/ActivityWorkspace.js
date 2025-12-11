// src/components/pages/ActivityWorkspace.jsx
import React from "react";

function ActivityWorkspace({ module, topicIndex, onBack }) {
  const topicTitle = module.topics[topicIndex];

  return (
    <section className="activity-workspace">
      <div className="activity-header">
        <div>
          <p className="activity-breadcrumb">
            {module.title} • Topic {topicIndex + 1}
          </p>
          <h1>{topicTitle}</h1>
          <p>
            This is your dedicated activity space. Here you can place a video,
            game, or quiz for this topic.
          </p>
        </div>
        <button
          type="button"
          className="module-secondary-btn"
          onClick={onBack}
        >
          ← Back to topic overview
        </button>
      </div>

      {/* FULL-WIDTH PLAY AREA WITH VIDEO */}
      <div className="activity-play-area">
        <p className="activity-label">Activity play area</p>

        <div className="activity-video-wrapper">
          <iframe
            className="activity-video-frame"
            src="https://www.youtube.com/embed/w8HdOHrc3OQ"
            title="Sample AI explainer video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <p className="activity-play-text">
          Replace this embedded YouTube video with your own lesson, demo, or
          interactive content for this topic.
        </p>
      </div>
    </section>
  );
}

export default ActivityWorkspace;
