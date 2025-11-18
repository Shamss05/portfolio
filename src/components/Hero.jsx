import React from 'react';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <h1>Hi, I'm <span className="highlight">Shahd Ahmed</span></h1>
        <h2>Creative Director • Video Editor • Content Creator</h2>
        <p>I deliver high-quality creative content in video editing, photography, and sound adjustment, helping brands communicate their message in an engaging and impactful way.</p>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Contact Me</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;