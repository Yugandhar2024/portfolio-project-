
    const loader = document.getElementById('loader');
    const loaderPct = document.getElementById('loader-pct');
    const loaderBar = document.querySelector('.loader-bar');
    let progress = 0;

    function updateProgress() {
      progress += Math.floor(Math.random() * 8) + 2;
      if (progress > 100) progress = 100;

      loaderPct.textContent = progress;
      loaderBar.style.width = progress + '%';

      if (progress < 100) {
        setTimeout(updateProgress, Math.random() * 60 + 20);
      } else {
        setTimeout(() => {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';

          document.querySelectorAll('.hero-text > *').forEach(el => {
            el.style.animationPlayState = 'running';
          });
        }, 400);
      }
    }
    window.addEventListener('load', updateProgress);

    const cursor = document.getElementById('cursor'), ring = document.getElementById('cursor-ring'), dot = document.getElementById('cursor-dot');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
    (function animRing() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing) })();

    function setCursorState(state) {
      cursor.classList.remove('is-text', 'is-pointer');
      ring.classList.remove('is-text', 'is-pointer');
      if (state === 'text') { cursor.classList.add('is-text'); ring.classList.add('is-text'); }
      else if (state === 'pointer') { cursor.classList.add('is-pointer'); ring.classList.add('is-pointer'); }
    }

    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => setCursorState('pointer'));
      el.addEventListener('mouseleave', () => setCursorState('default'));
    });

    document.querySelectorAll('p,h1,h2,h3,.about-text,.tl-title,.tl-org,.tl-detail,.project-title,.project-desc,.edu-degree,.edu-school,.stat-label,.contact-subtitle').forEach(el => {
      el.addEventListener('mouseenter', () => setCursorState('text'));
      el.addEventListener('mouseleave', () => setCursorState('default'));
    });

    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCyan = new THREE.Color('#00f5ff');
    const colorPurple = new THREE.Color('#a855f7');
    const colorBlue = new THREE.Color('#3b82f6');

    for (let i = 0; i < count; i++) {

      const r = Math.random() * 12;
      const spin = r * 0.9;
      const branches = 3;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const x = Math.cos(branchAngle + spin) * r + (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 1.2;
      const z = Math.sin(branchAngle + spin) * r + (Math.random() - 0.5) * 1.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = colorCyan.clone();
      if (Math.random() > 0.5) {
        mixedColor.lerp(colorPurple, r / 12);
      } else {
        mixedColor.lerp(colorBlue, r / 12);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let scrollY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2.0;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2.0;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY / window.innerHeight;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      points.rotation.y = elapsedTime * 0.03;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = -targetY + 0.8;

      camera.position.z = 8 - scrollY * 2.2;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer.render(scene, camera);
    }
    animate();

    const cards = document.querySelectorAll('.skill-cat, .project-card, .edu-card, .stat-card');
    cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const angleX = (yc - y) / 12;
        const angleY = (x - xc) / 12;
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-6px)`;
        card.style.boxShadow = `${-angleY * 1.2}px ${angleX * 1.2}px 20px rgba(0, 245, 255, 0.15), 0 12px 24px rgba(0,0,0,0.4)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.boxShadow = '';
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const navToggle = document.querySelector('.nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (navToggle && mobileOverlay) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
