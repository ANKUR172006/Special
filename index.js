document.addEventListener('DOMContentLoaded', () => {
  const pages = Array.from(document.querySelectorAll('.page'));
  const navButtons = Array.from(document.querySelectorAll('[data-page]'));
  let currentPage = document.querySelector('.page.active') || pages[0];

  initLoader();
  initPageNavigation();
  initSky();
  initSpotlight();
  initTyping();
  initLetter();
  initMemories();
  initReasons();
  initPanda();
  initFinale();
  initMusic();

  function initLoader(){
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    const app = document.getElementById('app');
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + 8 + Math.random() * 14);
      fill.style.width = progress + '%';
      if (progress >= 100){
        clearInterval(timer);
        setTimeout(() => {
          loader.classList.add('done');
          app.classList.remove('is-hidden');
          burst(window.innerWidth / 2, window.innerHeight * 0.42, 28);
        }, 300);
      }
    }, 120);
  }

  function initPageNavigation(){
    navButtons.forEach((button) => {
      button.addEventListener('click', () => showPage(button.dataset.page));
    });

    document.addEventListener('keydown', (event) => {
      if (document.getElementById('memoryModal').classList.contains('active')) return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const index = pages.indexOf(currentPage);
      const next = event.key === 'ArrowRight'
        ? pages[(index + 1) % pages.length]
        : pages[(index - 1 + pages.length) % pages.length];
      showPage(next.id);
    });
  }

  function showPage(id){
    const next = document.getElementById(id);
    if (!next || next === currentPage) return;
    const previous = currentPage;
    const direction = pages.indexOf(next) > pages.indexOf(previous) ? 'exit-left' : 'exit-right';
    previous.classList.remove('active');
    previous.classList.add(direction);
    next.classList.add('active');
    setTimeout(() => previous.classList.remove('exit-left', 'exit-right'), 720);
    currentPage = next;
    navButtons.forEach((button) => button.classList.toggle('active', button.dataset.page === id));
    if (window.matchMedia('(max-width: 900px)').matches) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.dispatchEvent(new CustomEvent('girlfriendday:pagechange', { detail: { page: id } }));
    burst(window.innerWidth / 2, 120, 14);
  }

  function initSky(){
    const canvas = document.getElementById('skyCanvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    let width = 0;
    let height = 0;

    function resize(){
      width = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
      height = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }

    function makeParticle(){
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 8,
        speed: 0.2 + Math.random() * 0.8,
        drift: -0.3 + Math.random() * 0.6,
        alpha: 0.14 + Math.random() * 0.55,
        type: Math.random() > 0.68 ? 'heart' : 'spark'
      };
    }

    resize();
    for (let i = 0; i < 70; i++) particles.push(makeParticle());
    window.addEventListener('resize', resize);

    function drawHeart(p){
      const s = p.size / 10;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.moveTo(0, 4 * s);
      ctx.bezierCurveTo(-7 * s, -2 * s, -4 * s, -9 * s, 0, -4 * s);
      ctx.bezierCurveTo(4 * s, -9 * s, 7 * s, -2 * s, 0, 4 * s);
      ctx.fillStyle = `rgba(255,143,189,${p.alpha})`;
      ctx.fill();
      ctx.restore();
    }

    function tick(){
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -30){ p.y = height + 30; p.x = Math.random() * width; }
        if (p.type === 'heart') drawHeart(p);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.fill();
        }
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  function initSpotlight(){
    const spotlight = document.getElementById('spotlight');
    window.addEventListener('mousemove', (event) => {
      spotlight.style.left = event.clientX + 'px';
      spotlight.style.top = event.clientY + 'px';
      if (Math.random() > 0.88) burst(event.clientX, event.clientY, 1);
    });
  }

  function initTyping(){
    const target = document.getElementById('typedText');
    if (!target) return;
    const lines = [
      'You are my favorite notification.',
      'Your smile is my favorite weather.',
      'Every little moment with you feels special.',
      'I choose you, today and always.'
    ];
    let line = 0;
    let char = 0;
    let deleting = false;

    function step(){
      const text = lines[line];
      char += deleting ? -1 : 1;
      target.textContent = text.slice(0, char);
      if (!deleting && char === text.length){
        deleting = true;
        setTimeout(step, 1400);
        return;
      }
      if (deleting && char === 0){
        deleting = false;
        line = (line + 1) % lines.length;
      }
      setTimeout(step, deleting ? 35 : 58);
    }
    step();
  }

  function initLetter(){
    const button = document.getElementById('openLetterBtn');
    const letter = document.getElementById('loveLetter');
    if (!button || !letter) return;
    button.addEventListener('click', () => {
      button.classList.add('open');
      letter.classList.add('show');
      const rect = button.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + 70, 32);
      fireConfetti(70);
    });
  }

  function initMemories(){
    const grid = document.getElementById('memoryGrid');
    const modal = document.getElementById('memoryModal');
    const modalImage = document.getElementById('modalImage');
    const close = document.getElementById('modalClose');
    const prev = document.getElementById('modalPrev');
    const next = document.getElementById('modalNext');
    if (!grid) return;

    const labels = [
      'My Bubby',
      'My Love',
      'My Shona',
      'My Partner',
      'My Moto',
      'My Second Mother',
      'Your happy place',
      'My Life'
    ];
    const images = labels.map((_, i) => `images/${i + 1}.jpeg`);
    let current = 0;

    labels.forEach((label, index) => {
      const card = document.createElement('button');
      card.className = 'memory-card';
      card.type = 'button';
      card.dataset.label = label;
      card.style.transitionDelay = `${index * 35}ms`;
      const img = document.createElement('img');
      img.src = images[index];
      img.alt = label;
      img.loading = 'lazy';
      img.onerror = () => {
        img.onerror = null;
        img.src = `https://placehold.co/700x920/261238/ff8fbd?text=${encodeURIComponent(label)}`;
      };
      card.appendChild(img);
      card.addEventListener('click', () => openModal(index));
      grid.appendChild(card);
    });

    function openModal(index){
      current = index;
      modalImage.src = images[index];
      modalImage.alt = labels[index];
      modalImage.onerror = () => {
        modalImage.onerror = null;
        modalImage.src = `https://placehold.co/900x1200/261238/ff8fbd?text=${encodeURIComponent(labels[index])}`;
      };
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    function closeModal(){
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    function move(dir){
      current = (current + dir + images.length) % images.length;
      openModal(current);
    }

    close.addEventListener('click', closeModal);
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => {
      if (!modal.classList.contains('active')) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    });
  }

  function initReasons(){
    const wheel = document.getElementById('reasonWheel');
    if (!wheel) return;
    const reasons = [
      ['fa-face-smile', 'Your smile', 'It changes my whole mood in a second.'],
      ['fa-heart', 'Your heart', 'So kind, so soft, so deeply lovable.'],
      ['fa-eye', 'Your eyes', 'They make the world feel quieter and sweeter.'],
      ['fa-hand-holding-heart', 'Your care', 'You love in the most beautiful little ways.'],
      ['fa-star', 'Your vibe', 'No one else feels like you.'],
      ['fa-infinity', 'Everything', 'All your little details are my favorite.']
    ];
    reasons.forEach(([icon, title, text]) => {
      const card = document.createElement('article');
      card.className = 'reason-card';
      card.innerHTML = `<i class="fa-solid ${icon}"></i><h3>${title}</h3><p>${text}</p>`;
      wheel.appendChild(card);
    });
  }

  function initPanda(){
    const canvas = document.getElementById('pandaCanvas');
    const button = document.getElementById('pandaLoveBtn');
    if (!canvas) return;

    button.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height * 0.46, 42);
      fireConfetti(120);
    });

    if (!window.THREE) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (error) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.1, 7.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const panda = new THREE.Group();
    scene.add(panda);

    const white = new THREE.MeshStandardMaterial({ color: 0xfffbf6, roughness: 0.58 });
    const black = new THREE.MeshStandardMaterial({ color: 0x17131a, roughness: 0.75 });
    const blush = new THREE.MeshStandardMaterial({ color: 0xff8fbd, roughness: 0.45, emissive: 0x441126, emissiveIntensity: 0.15 });
    const red = new THREE.MeshStandardMaterial({ color: 0xef476f, roughness: 0.35, emissive: 0x5c1025, emissiveIntensity: 0.28 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.42 });
    const mint = new THREE.MeshStandardMaterial({ color: 0x8ee6c8, roughness: 0.5 });

    function addSphere(material, scale, position, parent = panda){
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 56, 36), material);
      mesh.scale.set(...scale);
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    addSphere(white, [1.25, 1.45, 0.98], [0, -0.55, 0]);
    addSphere(white, [1.04, 0.94, 0.88], [0, 1.05, 0]);
    addSphere(black, [0.38, 0.4, 0.3], [-0.72, 1.78, -0.04]);
    addSphere(black, [0.38, 0.4, 0.3], [0.72, 1.78, -0.04]);
    addSphere(black, [0.29, 0.36, 0.08], [-0.38, 1.11, 0.8]);
    addSphere(black, [0.29, 0.36, 0.08], [0.38, 1.11, 0.8]);
    addSphere(white, [0.075, 0.075, 0.04], [-0.38, 1.13, 0.875]);
    addSphere(white, [0.075, 0.075, 0.04], [0.38, 1.13, 0.875]);
    addSphere(black, [0.13, 0.09, 0.06], [0, 0.9, 0.86]);
    addSphere(blush, [0.13, 0.06, 0.03], [-0.58, 0.82, 0.84]);
    addSphere(blush, [0.13, 0.06, 0.03], [0.58, 0.82, 0.84]);
    addSphere(black, [0.34, 0.9, 0.34], [-1.03, -0.38, 0.08]).rotation.z = -0.45;
    addSphere(black, [0.34, 0.9, 0.34], [1.03, -0.38, 0.08]).rotation.z = 0.45;
    addSphere(black, [0.45, 0.24, 0.34], [-0.55, -1.86, 0.38]);
    addSphere(black, [0.45, 0.24, 0.34], [0.55, -1.86, 0.38]);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.34);
    heartShape.bezierCurveTo(0, 0.62, -0.42, 0.7, -0.5, 0.4);
    heartShape.bezierCurveTo(-0.64, 0.02, -0.12, -0.22, 0, -0.54);
    heartShape.bezierCurveTo(0.12, -0.22, 0.64, 0.02, 0.5, 0.4);
    heartShape.bezierCurveTo(0.42, 0.7, 0, 0.62, 0, 0.34);
    const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.17,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      bevelSegments: 6
    }), red);
    heart.position.set(0, -0.45, 1.08);
    heart.rotation.x = Math.PI;
    heart.scale.setScalar(0.98);
    heart.castShadow = true;
    panda.add(heart);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.6, 100),
      new THREE.MeshStandardMaterial({ color: 0x4b183d, roughness: 0.82, transparent: true, opacity: 0.64 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.13;
    floor.receiveShadow = true;
    scene.add(floor);

    const orbit = new THREE.Group();
    for (let i = 0; i < 34; i++){
      const material = i % 3 === 0 ? gold : i % 3 === 1 ? blush : mint;
      const petal = addSphere(material, [0.05, 0.028, 0.05], [0, 0, 0], orbit);
      const angle = (i / 34) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 2.55, -1.72 + Math.sin(i) * 0.08, Math.sin(angle) * 1.55);
    }
    scene.add(orbit);

    scene.add(new THREE.AmbientLight(0xffffff, 1.05));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(3.2, 5, 4);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.PointLight(0xff8fbd, 3.4, 10);
    rim.position.set(-2.4, 1.8, 2.8);
    scene.add(rim);

    let targetRotation = 0;
    let drag = null;
    canvas.addEventListener('pointerdown', (event) => {
      drag = { x: event.clientX, rotation: targetRotation };
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
      if (drag) targetRotation = drag.rotation + (event.clientX - drag.x) * 0.01;
    });
    canvas.addEventListener('pointerup', () => { drag = null; });
    canvas.addEventListener('pointercancel', () => { drag = null; });
    canvas.addEventListener('mousemove', (event) => {
      if (drag) return;
      const rect = canvas.getBoundingClientRect();
      targetRotation = ((event.clientX - rect.left) / rect.width - 0.5) * 0.75;
    });

    function resize(){
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('girlfriendday:pagechange', (event) => {
      if (event.detail.page === 'panda') {
        requestAnimationFrame(resize);
      }
    });

    function animate(time){
      const t = time * 0.001;
      panda.rotation.y += (targetRotation - panda.rotation.y) * 0.055;
      panda.position.y = Math.sin(t * 2.1) * 0.08;
      panda.rotation.z = Math.sin(t * 1.55) * 0.045;
      heart.scale.setScalar(0.93 + Math.sin(t * 5.5) * 0.08);
      heart.rotation.z = Math.sin(t * 2.6) * 0.08;
      orbit.rotation.y = t * 0.24;
      renderer.render(scene, camera);
      if (!document.body.classList.contains('has-three')) {
        document.body.classList.add('has-three');
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  function initFinale(){
    const button = document.getElementById('finalBtn');
    const message = document.getElementById('finalMessage');
    if (!button) return;
    button.addEventListener('click', () => {
      message.classList.add('show');
      fireConfetti(180);
      for (let i = 0; i < 70; i++){
        setTimeout(() => burst(Math.random() * window.innerWidth, window.innerHeight + 20, 1, true), i * 35);
      }
    });
  }

  function initMusic(){
    const toggle = document.getElementById('musicToggle');
    const panel = document.getElementById('musicPanel');
    const audio = document.getElementById('bgMusic');
    const volume = document.getElementById('volumeSlider');
    const mute = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');
    if (!toggle || !audio) return;
    audio.volume = 0.5;

    toggle.addEventListener('click', () => {
      panel.classList.toggle('show');
      if (audio.paused){
        audio.play().then(() => toggle.classList.add('playing')).catch(() => {
          panel.classList.add('show');
        });
      } else {
        audio.pause();
        toggle.classList.remove('playing');
      }
    });
    volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
    mute.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteIcon.className = audio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    });
  }

  function burst(x, y, count = 16, rise = false){
    for (let i = 0; i < count; i++){
      const heart = document.createElement('span');
      heart.className = 'float-heart';
      heart.textContent = ['\u2665', '\u2726', '\u2736'][Math.floor(Math.random() * 3)];
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.fontSize = `${12 + Math.random() * 18}px`;
      document.body.appendChild(heart);

      const angle = rise ? -Math.PI / 2 + (Math.random() - 0.5) * 0.8 : (Math.PI * 2 * i) / Math.max(1, count);
      const distance = rise ? 180 + Math.random() * 420 : 70 + Math.random() * 160;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      heart.animate([
        { transform: 'translate(-50%, -50%) scale(0.7) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.25) rotate(${Math.random() * 240 - 120}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.16,.84,.44,1)' });
      setTimeout(() => heart.remove(), 1700);
    }
  }

  function fireConfetti(count){
    if (!window.confetti) return;
    confetti({
      particleCount: count,
      spread: 90,
      origin: { y: 0.58 },
      colors: ['#ef476f', '#ff8fbd', '#ffd166', '#8ee6c8', '#fff8fb']
    });
  }
});
