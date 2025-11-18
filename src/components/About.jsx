import React from 'react';

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm Shahd Ahmed — Creative Director, Video Editor, and Content Creator. I love working on video editing, photography, and sound adjustments, and anything related to content creation.
            </p>
            <p>
              My goal is to deliver creative, high-quality content and help brands and projects communicate their message in a visually compelling way.
            </p>
          </div>
          
          <div className="skills">
            <h3>Skills</h3>
            <div className="skill-tags">
              <span className="skill-tag">Video Editing</span>
              <span className="skill-tag">Photography</span>
              <span className="skill-tag">Sound Adjustment</span>
              <span className="skill-tag">Content Creation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;