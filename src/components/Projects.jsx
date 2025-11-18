import React, { useEffect, useState } from 'react';

function Projects() {
  const projects = [
    { id: 1, title: 'ForCoaching intro', description: 'Portfolio video project', technologies: ['Video'], video: 'ForCoaching intro.mp4', liveLink: '/Videos/ForCoaching intro.mp4', group: 'youtube' },
    { id: 2, title: 'Ghalia & 7.7', description: 'Portfolio video project', technologies: ['Reel'], video: 'Ghalia & 7.7.mp4', liveLink: '/Videos/Ghalia & 7.7.mp4', group: 'reel' },
    { id: 3, title: 'Red Sharm promo', description: 'Portfolio video project', technologies: ['Promo'], video: 'Red Sharm promo.mp4', liveLink: '/Videos/Red Sharm promo.mp4', group: 'promo' },
    { id: 4, title: 'Reel sample', description: 'Portfolio video project', technologies: ['Reel'], video: 'Reel sample.mp4', liveLink: '/Videos/Reel sample.mp4', group: 'reel' },
    { id: 5, title: 'TUTHUB VID', description: 'Portfolio video project', technologies: ['Reel'], video: 'TUTHUB VID.mp4', liveLink: '/Videos/TUTHUB VID.mp4', group: 'reel' },
    { id: 6, title: 'YouTube Sample', description: 'Portfolio video project', technologies: ['Video'], video: 'YouTube Sample.mp4', liveLink: '/Videos/YouTube Sample.mp4', group: 'youtube' },
  ];

  // Generate posters from video frames and avoid black starts
  const [posters, setPosters] = useState({});

  function isFrameDark(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      // perceived luminance
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sum += luminance;
    }
    const avg = sum / (data.length / 4);
    return avg < 15; // threshold for "mostly black"
  }

  async function generatePosterFromVideo(src) {
    return new Promise(async (resolve) => {
      try {
        const video = document.createElement('video');
        video.src = src;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.preload = 'auto';
        video.playsInline = true;

        const waitEvent = (el, event) => new Promise(res => el.addEventListener(event, res, { once: true }));
        await waitEvent(video, 'loadeddata');

        const canvas = document.createElement('canvas');
        // sample down to reduce cost but preserve aspect ratio
        const targetWidth = 480;
        const ratio = video.videoWidth / video.videoHeight || 16 / 9;
        canvas.width = targetWidth;
        canvas.height = Math.round(targetWidth / ratio);
        const ctx = canvas.getContext('2d');

        const candidates = [0, 0.5, 1, 2, 3];
        for (const t of candidates) {
          try {
            video.currentTime = t;
            await waitEvent(video, 'seeked');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (!isFrameDark(ctx, canvas.width, canvas.height)) {
              return resolve(canvas.toDataURL('image/jpeg', 0.8));
            }
          } catch (e) {
            // ignore seek errors and continue
          }
        }
        // fallback: use last drawn frame (even if dark)
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (err) {
        resolve(null);
      }
    });
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        projects.map(async (p) => {
          const poster = await generatePosterFromVideo(p.liveLink);
          return [p.id, poster];
        })
      );
      if (!cancelled) {
        setPosters(Object.fromEntries(entries));
      }
    })();
    return () => { cancelled = true; };
  }, [projects]);

  // Order: Reels first (three in a row), then the rest of the videos
  const orderedProjects = [...projects].sort((a, b) => {
    const weight = (p) => (p.type === 'reel' ? 0 : 1);
    return weight(a) - weight(b);
  });
  const reels = projects.filter(p => p.group === 'reel');
  const promos = projects.filter(p => p.group === 'promo');
  const youtubes = projects.filter(p => p.group === 'youtube');
  const otherVideos = projects.filter(p => p.type !== 'reel');
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <h2>1. Reel</h2>
        <div className="projects-grid">
          {reels.map(project => (
            <div className="project-card" key={project.id}>
              <div className="project-image">
                <video src={project.liveLink} poster={posters[project.id]} preload="metadata" controls muted playsInline />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.liveLink} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">Open Video</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br></br>
        <br />
        <h2>2. Promo</h2>
        <div className="projects-grid">
          {promos.map(project => (
            <div className="project-card" key={project.id}>
              <div className="project-image">
                <video src={project.liveLink} poster={posters[project.id]} preload="metadata" controls muted playsInline />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.liveLink} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">Open Video</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br></br>
        <br />
        <h2>3. YouTube</h2>
        <div className="projects-grid">
          {youtubes.map(project => (
            <div className="project-card" key={project.id}>
              <div className="project-image">
                <video src={project.liveLink} poster={posters[project.id]} preload="metadata" controls muted playsInline />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.liveLink} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">Open Video</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;