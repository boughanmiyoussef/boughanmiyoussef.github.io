/* ---------- Glitch Canvas ---------- */
const canvas = document.getElementById('mesh');
const ctx = canvas.getContext('2d');
let w = (canvas.width = innerWidth);
let h = (canvas.height = innerHeight);
const nodes = 70;
const waves = [];
for(let i = 0; i < nodes; i++){
  waves.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    r: Math.random() * 2 + 1
  });
}
function drawMesh(){
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = 0.4;
  waves.forEach((n, i) => {
    n.x += n.vx;
    n.y += n.vy;
    if(n.x < 0 || n.x > w) n.vx *= -1;
    if(n.y < 0 || n.y > h) n.vy *= -1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = '#00f2ff';
    ctx.fill();
    for(let j = i + 1; j < waves.length; j++){
      const d = Math.hypot(waves[i].x - waves[j].x, waves[i].y - waves[j].y);
      if(d < 180){
        ctx.beginPath();
        ctx.moveTo(waves[i].x, waves[i].y);
        ctx.lineTo(waves[j].x, waves[j].y);
        ctx.strokeStyle = `rgba(0,242,255,${1 - d / 180})`;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawMesh);
}
drawMesh();
addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
});

/* ---------- Image Carousel ---------- */
const imgs = [];
for(let i = 1; i <= 8; i++) imgs.push(`ShopEase/ShopEase${i}.png`);
const viewer = document.querySelector('.viewer');
let idx = 0;
imgs.forEach(src => {
  const img = new Image();
  img.src = src;
  viewer.appendChild(img);
});
const images = [...viewer.querySelectorAll('img')];
images[idx].classList.add('active');

function show(){
  images.forEach(img => img.classList.remove('active'));
  images[idx].classList.add('active');
}
document.querySelector('.arrow.right').onclick = () => {
  idx = (idx + 1) % imgs.length;
  show();
};
document.querySelector('.arrow.left').onclick = () => {
  idx = (idx - 1 + imgs.length) % imgs.length;
  show();
};

/* ---------- Footer Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();