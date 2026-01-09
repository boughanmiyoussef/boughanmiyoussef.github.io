// -------- reveal on scroll --------
const sections = document.querySelectorAll('.section');
const reveal = () => {
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) sec.classList.add('visible');
  });
};
window.addEventListener('scroll', reveal);
reveal();

// -------- smooth nav --------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// -------- CV real download --------
document.getElementById('downloadCvBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = 'https://flowcv.com/resume/9sca2vpmin/pdf';
  link.download = 'Youssef_Boughanmi_CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // tiny UX feedback
  const btn = document.getElementById('downloadCvBtn');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
  setTimeout(() => (btn.innerHTML = original), 2000);
});

// -------- gallery slider --------
const track = document.querySelector('.gallery-track');
const imgs = Array.from(track.children);
const prev = document.querySelector('.gallery-btn.prev');
const next = document.querySelector('.gallery-btn.next');
const dotsContainer = document.querySelector('.gallery-dots');
let idx = 0;

// create dots
imgs.forEach((_, i) => {
  const d = document.createElement('span');
  d.classList.add('dot');
  if (i === 0) d.classList.add('active');
  d.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(d);
});
const dots = Array.from(dotsContainer.children);

function goTo(index) {
  idx = index;
  track.style.transform = `translateX(-${idx * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[idx].classList.add('active');
}
prev.addEventListener('click', () => goTo(idx === 0 ? imgs.length - 1 : idx - 1));
next.addEventListener('click', () => goTo(idx === imgs.length - 1 ? 0 : idx + 1));

// auto-rotate every 5 s
setInterval(() => goTo((idx + 1) % imgs.length), 5000);

// footer year
document.getElementById('year').textContent = new Date().getFullYear();
