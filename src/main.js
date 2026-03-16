function initHeaderMenu() {
  const button = document.querySelector('.mobile-menu-btn');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (!button || !hamburger || !nav) return;
  button.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    }),
  );
}

function initFooterYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    form.reset();
  });
}

const projects = [
  { id: 1, title: 'ForCoaching intro', description: 'Portfolio video project', technologies: ['Video'], video: 'ForCoaching intro.mp4', liveLink: 'public/Videos/ForCoaching.mp4', group: 'youtube' },
  { id: 2, title: 'Ghalia & 7.7', description: 'Portfolio video project', technologies: ['Reel'], video: 'Ghalia & 7.7.mp4', liveLink: 'public/Videos/Ghalia.mp4', group: 'reel' },
  { id: 3, title: 'Red Sharm promo', description: 'Portfolio video project', technologies: ['Promo'], video: 'Red Sharm promo.mp4', liveLink: 'public/Videos/Red.mp4', group: 'promo' },
  { id: 4, title: 'Reel sample', description: 'Portfolio video project', technologies: ['Reel'], video: 'Reel sample.mp4', liveLink: 'public/Videos/Reel.mp4', group: 'reel' },
  { id: 5, title: 'TUTHUB VID', description: 'Portfolio video project', technologies: ['Reel'], video: 'TUTHUB VID.mp4', liveLink: 'public/Videos/TUTHUB.mp4', group: 'reel' },
  { id: 6, title: 'YouTube Sample', description: 'Portfolio video project', technologies: ['Video'], video: 'YouTube Sample.mp4', liveLink: 'public/Videos/YouTube.mp4', group: 'youtube' },
];

function renderProjects() {
  const reelEl = document.getElementById('reel-grid');
  const promoEl = document.getElementById('promo-grid');
  const ytEl = document.getElementById('youtube-grid');
  if (!reelEl || !promoEl || !ytEl) return;

  const reels = projects.filter((p) => p.group === 'reel');
  const promos = projects.filter((p) => p.group === 'promo');
  const youtubes = projects.filter((p) => p.group === 'youtube');

  const createCard = (p) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'project-image';

    const video = document.createElement('video');
    video.src = p.liveLink;
    video.setAttribute('preload', 'metadata');
    video.setAttribute('controls', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsInline', '');
    imgWrap.appendChild(video);

    const info = document.createElement('div');
    info.className = 'project-info';

    const h3 = document.createElement('h3');
    h3.textContent = p.title;
    info.appendChild(h3);

    if (p.description) {
      const desc = document.createElement('p');
      desc.textContent = p.description;
      info.appendChild(desc);
    }

    const techWrap = document.createElement('div');
    techWrap.className = 'project-tech';
    p.technologies.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      techWrap.appendChild(span);
    });
    info.appendChild(techWrap);

    const links = document.createElement('div');
    links.className = 'project-links';
    const a = document.createElement('a');
    a.href = p.liveLink;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'btn btn-sm btn-primary';
    a.textContent = 'Open Video';
    links.appendChild(a);
    info.appendChild(links);

    card.appendChild(imgWrap);
    card.appendChild(info);
    return { card, video };
  };

  const reelCards = reels.map(createCard);
  reelCards.forEach(({ card }) => reelEl.appendChild(card));
  const promoCards = promos.map(createCard);
  promoCards.forEach(({ card }) => promoEl.appendChild(card));
  const ytCards = youtubes.map(createCard);
  ytCards.forEach(({ card }) => ytEl.appendChild(card));

  // Generate and assign posters
  const videos = [...reelCards, ...promoCards, ...ytCards];
  assignPosters(videos.map((v, i) => ({ id: i, video: v.video, src: v.video.src })));
}

function isFrameDark(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += luminance;
  }
  const avg = sum / (data.length / 4);
  return avg < 15;
}

function generatePosterFromVideo(src) {
  return new Promise((resolve) => {
    (async () => {
      try {
        const video = document.createElement('video');
        video.src = src;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.preload = 'auto';
        video.playsInline = true;
        const waitEvent = (el, event) =>
          new Promise((res) => el.addEventListener(event, res, { once: true }));
        await waitEvent(video, 'loadeddata');

        const canvas = document.createElement('canvas');
        const targetWidth = 480;
        const ratio = (video.videoWidth || 16) / (video.videoHeight || 9);
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
              resolve(canvas.toDataURL('image/jpeg', 0.8));
              return;
            }
          } catch {
            // continue
          }
        }
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        resolve(null);
      }
    })();
  });
}

async function assignPosters(items) {
  for (const item of items) {
    try {
      const poster = await generatePosterFromVideo(item.src);
      if (poster) {
        item.video.setAttribute('poster', poster);
      }
    } catch {
      // ignore poster errors
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderMenu();
  initFooterYear();
  initContactForm();
  renderProjects();
});
