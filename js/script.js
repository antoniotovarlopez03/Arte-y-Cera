document.addEventListener('DOMContentLoaded', () => {

  /* ===== YEAR ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ===== FONDO DEL HERO: destellos tipo llama + rayos de luz + polvo dorado =====
     Sustituye a los antiguos símbolos religiosos flotantes (se quitaron
     por completo del Hero; los <symbol> del SVG en #heroSymbols se dejan
     intactos porque "El Proceso" los reutiliza vía <use>, ver
     buildProcessSymbols más abajo). Las chispas (.hero-spark) llevan tono
     de llama (naranja/ámbar) y parpadeo más frecuente que un destello
     normal, a propósito: la marca es de velas. El polvo reutiliza el mismo
     .p-gold-mote de "Nuestro Universo". Los rayos de luz son puro CSS
     (.hero-rays), sin JS. */
  (function buildHeroAmbient() {
    const sparkHost = document.getElementById('heroSparkles');
    const moteHost = document.getElementById('heroMotes');
    if (!sparkHost && !moteHost) return;

    let seed = 5101;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    // El Hero es lo primero que se ve, así que esto no se puede diferir —
    // pero en táctil se genera bastante menos cantidad (mismo efecto
    // general, menos elementos animados desde el primer fotograma).
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    if (sparkHost) {
      const SPARK_COUNT = isCoarse ? 12 : 26;
      let html = '';
      for (let i = 0; i < SPARK_COUNT; i++) {
        const x = (rnd() * 96 + 2).toFixed(1);
        const y = (rnd() * 90 + 4).toFixed(1);
        const pdur = (3 + rnd() * 3).toFixed(1);
        const pdelay = (rnd() * 8).toFixed(1);
        html += `<span class="hero-spark" style="--x:${x}%; --y:${y}%; --pdur:${pdur}s; --pdelay:${pdelay}s;"></span>`;
      }
      sparkHost.innerHTML = html;
    }

    if (moteHost) {
      const MOTE_COUNT = isCoarse ? 5 : 10;
      let html = '';
      for (let i = 0; i < MOTE_COUNT; i++) {
        const x = (rnd() * 100).toFixed(1);
        const y = (rnd() * 100).toFixed(1);
        const s = (1.4 + rnd() * 1.6).toFixed(1);
        const mop = (0.2 + rnd() * 0.25).toFixed(2);
        const mdur = (55 + rnd() * 40).toFixed(1);
        const mdelay = (rnd() * 30).toFixed(1);
        const mdx = (rnd() * 20 - 10).toFixed(1);
        const mdy = (-(35 + rnd() * 45)).toFixed(1);
        html += `<span class="p-gold-mote" style="left:${x}%; top:${y}%; width:${s}px; height:${s}px; --mop:${mop}; --mdur:${mdur}s; --mdelay:${mdelay}s; --mdx:${mdx}px; --mdy:${mdy}px;"></span>`;
      }
      moteHost.innerHTML = html;
    }
  })();

  /* ===== COLECCIONES "TODAS": cielo estrellado de la cabecera =====
     Mismo truco que el cosmos de "Nuestro Universo" (un único box-shadow
     con cientos de estrellas por capa), a menor escala, para que la
     cabecera del catálogo y la esfera de más abajo compartan un único
     fondo continuo cuando la pestaña activa es "Todas". Se mide contra
     #colecciones (cubre cabecera + lo que esté montado debajo) y se
     recalcula solo al cargar y al redimensionar, igual que buildCosmosAmbience. */
  /* ===== NOSOTROS: mosaico vivo (1 pieza grande + 3 pequeñas) =====
     Las 4 piezas reproducen en bucle real el MISMO montaje original (los 25
     clips que no se querían recortar), cada una empezando en un instante
     distinto — así se ve mucho más montaje a la vez. Todo arranca solo
     cuando la sección se acerca al viewport, igual que el resto de vídeos
     de la página.
     Decodificar 4 copias del mismo vídeo A LA VEZ Y SIN PARAR es caro en
     móvil — pero la solución no es dejar de reproducirlas (el cliente
     quiere las 4 vivas en cualquier dispositivo), sino que decodifiquen
     mucho menos: en móvil las 4 piezas usan una copia mucho más ligera del
     mismo vídeo (480x270 en vez de 1280x720, ~7x menos píxeles por
     fotograma) — mismo montaje, mismo bucle en las 4, solo más barato de
     decodificar. En escritorio se usa la copia de calidad completa. */
  (function initAboutMosaic() {
    const section = document.getElementById('nosotros');
    const mosaic = document.getElementById('aboutMosaic');
    if (!section || !mosaic) return;

    const videos = Array.from(mosaic.querySelectorAll('video'));
    if (!videos.length) return;

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const SRC = isCoarse ? 'videos/nosotros-bg-mobile.mp4' : 'videos/nosotros-bg.mp4';
    const DURATION = 108.2;
    const offsetFor = (i) => (i / videos.length) * DURATION;

    videos.forEach((video, i) => {
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = offsetFor(i);
      }, { once: true });
      video.addEventListener('loadeddata', () => { video.style.opacity = '1'; }, { once: true });
    });

    function playVideo(video) {
      video.play().catch(() => {});
    }

    let started = false;
    function start() {
      if (started) return;
      started = true;
      videos.forEach((video) => {
        video.src = SRC;
        video.load();
        playVideo(video);
      });
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          videos.forEach((v) => playVideo(v));
        } else {
          videos.forEach((v) => v.pause());
        }
      });
    }, { rootMargin: '200px 0px' });
    io.observe(section);
  })();

  (function buildCollAllStars() {
    const section = document.getElementById('colecciones');
    const farHost = document.getElementById('collAllFar');
    const midHost = document.getElementById('collAllMid');
    const goldHost = document.getElementById('collAllGold');
    if (!section || !farHost || !midHost) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Miles de box-shadow generados y aplicados de golpe en el arranque
    // (aunque la sección estuviera fuera de pantalla) es justo el tipo de
    // trabajo que puede colgar un móvil de gama media/baja. Recuento mucho
    // más bajo en táctil + construcción diferida hasta que la sección esté
    // a punto de entrar en pantalla (mismo patrón que la esfera 3D).
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    let seed = 8117;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

    function build() {
      const sr = section.getBoundingClientRect();
      const w = sr.width, h = sr.height;

      const FAR_COUNT = isCoarse ? 260 : 900;
      const farShadow = [];
      for (let i = 0; i < FAR_COUNT; i++) {
        const x = (rnd() * w).toFixed(1);
        const y = (rnd() * h).toFixed(1);
        const a = (0.2 + rnd() * 0.45).toFixed(2);
        farShadow.push(`${x}px ${y}px 0 rgba(255,255,255,${a})`);
      }
      farHost.style.boxShadow = farShadow.join(',');

      const MID_COUNT = isCoarse ? 40 : 130;
      const midShadow = [];
      for (let i = 0; i < MID_COUNT; i++) {
        const x = (rnd() * w).toFixed(1);
        const y = (rnd() * h).toFixed(1);
        const a = (0.3 + rnd() * 0.45).toFixed(2);
        const blur = (rnd() * 1.6).toFixed(1);
        midShadow.push(`${x}px ${y}px ${blur}px rgba(255,255,255,${a})`);
      }
      midHost.style.boxShadow = midShadow.join(',');

      if (goldHost) {
        const GOLD_COUNT = isCoarse ? 8 : 20;
        const goldShadow = [];
        for (let i = 0; i < GOLD_COUNT; i++) {
          const x = (rnd() * w).toFixed(1);
          const y = (rnd() * h).toFixed(1);
          const a = (0.25 + rnd() * 0.35).toFixed(2);
          goldShadow.push(`${x}px ${y}px 2px rgba(255,204,120,${a})`);
        }
        goldHost.style.boxShadow = goldShadow.join(',');
      }
    }

    let built = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || built) return;
        built = true;
        build();
        io.disconnect();
      });
    }, { rootMargin: '400px 0px' });
    io.observe(section);
    window.addEventListener('resize', () => { if (built) build(); });
  })();

  /* ===== NAVIDAD: la sección se "prende" y las velas se encienden en cascada ===== */
  const christmasSection = document.getElementById('navidad');
  if (christmasSection) {
    const xmasCards = Array.from(christmasSection.querySelectorAll('.xmas-card'));
    const christmasIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        christmasSection.classList.add('in-view');
        xmasCards.forEach((card, i) => {
          setTimeout(() => card.classList.add('lit'), 400 + i * 350);
        });
        christmasIO.unobserve(christmasSection);
      });
    }, { threshold: 0.2 });
    christmasIO.observe(christmasSection);
  }

  /* ===== SCROLL PROGRESS BAR ===== */
  const progressBar = document.getElementById('progressBar');
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';

    header.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('show', scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== MOBILE MENU ===== */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ===== ACTIVE NAV ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(sec => navObserver.observe(sec));

  /* ===== REVEAL ON SCROLL ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.06}s`;
    revealObserver.observe(el);
  });

  /* ===== ANIMATED COUNTERS ===== */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ===== COLLECTION FILTERS =====
     "Todas" ya no muestra el catálogo: muestra el contenido de "Nuestro
     universo de velas" (la antigua sección Universo, trasladada aquí tal
     cual — ver el <section id="esfera"> dentro de #colecciones). El resto
     de pestañas siguen mostrando únicamente su propia categoría, igual que
     antes. */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const collBlocks = document.querySelectorAll('.coll-block');
  const collectionsBg = document.getElementById('collectionsBg');
  const universeBlock = document.getElementById('esfera');
  const collectionsSection = document.getElementById('colecciones');
  // Las 4 "escenas" de fondo (all/pascua/bautizo/boda) se construyeron para
  // las 3 categorías originales; con las 6 colecciones actuales se reutilizan
  // por afinidad temática en vez de duplicar 3 escenas nuevas sin pedir.
  const SCENE_BY_FILTER = {
    cirios: 'pascua', bautizo: 'bautizo', mesa: 'boda',
    navidad: 'navidad', toallas: 'toallas', 'toallas-vela': 'toallas-vela'
  };

  // Los vídeos de fondo de Navidad/Toallas/Toallas con vela pesan varios MB
  // cada uno; en vez de autoplay+preload="auto" desde el primer segundo
  // (se descargaban aunque el usuario nunca pulsara esa pestaña), llevan
  // preload="none" y su URL real en data-src — solo se cargan y arrancan
  // la primera vez que su escena se activa. En táctil ni siquiera se cargan:
  // cada .photo-* ya tiene su propia foto fija de fondo (background-image,
  // ver styles.css) detrás del <video> — en móvil se deja esa foto quieta
  // tal cual, sin pedir ni decodificar ningún vídeo. En escritorio sigue
  // reproduciéndose el vídeo como siempre.
  const isCoarseScenes = window.matchMedia('(pointer: coarse)').matches;
  function lazyLoadSceneVideo(sceneName) {
    if (!collectionsBg || isCoarseScenes) return;
    const video = collectionsBg.querySelector(`.scene-${sceneName} video[data-src]`);
    if (!video) return;
    if (!video.src) {
      video.src = video.dataset.src;
      video.load();
    }
    video.play().catch(() => {});
  }

  function applyCollectionFilter(filter) {
    const isAll = filter === 'all';

    collBlocks.forEach(block => {
      const show = isAll || block.dataset.cat === filter;
      block.classList.toggle('hide', !show);
    });

    if (universeBlock) universeBlock.classList.toggle('hide', !isAll);

    // Cabecera dorada sobre cielo estrellado solo en "Todas" (ver
    // .is-all-scene en CSS) — clase explícita en vez de :has() porque el
    // motor de este navegador no siempre invalida bien :has() al cambiar
    // un atributo por JS.
    if (collectionsSection) collectionsSection.classList.toggle('is-all-scene', isAll);

    // El fondo cambia de "escena" en sincronía con el filtro — cada
    // categoría tiene su propia identidad visual (ver .paper-scene en CSS).
    const sceneName = SCENE_BY_FILTER[filter] || 'all';
    if (collectionsBg) collectionsBg.dataset.scene = sceneName;
    lazyLoadSceneVideo(sceneName);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCollectionFilter(btn.dataset.filter);
    });
  });

  // Estado inicial: coincide con el botón "Todas", activo por defecto en el HTML.
  applyCollectionFilter('all');

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const lightboxImages = Array.from(document.querySelectorAll('img[data-lightbox]'));
  let currentIndex = 0;

  function renderLightbox(index){
    currentIndex = (index + lightboxImages.length) % lightboxImages.length;
    const img = lightboxImages[currentIndex];
    lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    const zoomImg = lightboxContent.querySelector('img');
    zoomImg.addEventListener('click', (e) => {
      if (zoomImg.classList.contains('is-zoomed')) {
        zoomImg.classList.remove('is-zoomed');
        zoomImg.style.transformOrigin = 'center center';
      } else {
        const rect = zoomImg.getBoundingClientRect();
        const ox = ((e.clientX - rect.left) / rect.width) * 100;
        const oy = ((e.clientY - rect.top) / rect.height) * 100;
        zoomImg.style.transformOrigin = `${ox}% ${oy}%`;
        zoomImg.classList.add('is-zoomed');
      }
    });
  }

  lightboxImages.forEach((img, idx) => {
    img.addEventListener('click', () => {
      renderLightbox(idx);
      lightbox.classList.add('open');
    });
  });

  document.querySelectorAll('[data-lightbox-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetImg = btn.closest('.product-card').querySelector('img[data-lightbox]');
      const idx = lightboxImages.indexOf(targetImg);
      renderLightbox(idx);
      lightbox.classList.add('open');
    });
  });

  function closeLightbox(){ lightbox.classList.remove('open'); }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => renderLightbox(currentIndex - 1));
  lightboxNext.addEventListener('click', () => renderLightbox(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') renderLightbox(currentIndex + 1);
  });


  /* ===== PROCESO: fondo "taller vivo" generado (motas, bocetos, destellos,
     pan de oro) — decenas de elementos repartidos por toda la sección en
     vez de un puñado a mano, para que el fondo tenga presencia real. ===== */
  (function buildAtelierBg() {
    const section = document.getElementById('proceso');
    const dustHost = document.getElementById('processDust');
    const sketchHost = document.getElementById('processSketches');
    const sparkHost = document.getElementById('processSparkles');
    const goldHost = document.getElementById('processGoldLeaf');
    const symbolHost = document.getElementById('processSymbols');
    if (!section || !dustHost || !sketchHost || !sparkHost || !goldHost) return;

    // En táctil este fondo se congela por CSS (ver @media (pointer:coarse)
    // en styles.css) — ni falta generar las motas/bocetos/símbolos/destellos,
    // así que en móvil no se construye nada de esto. En escritorio, igual
    // que siempre: construcción diferida hasta que la sección esté cerca.
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;
    function build() {
    // PRNG determinista: mismo reparto en cada carga, sin patrón de rejilla visible.
    let seed = 7919;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

    const DUST_COUNT = isCoarse ? 12 : 28;
    let dustHTML = '';
    for (let i = 0; i < DUST_COUNT; i++) {
      const tier = i % 3 === 0 ? 'far' : (i % 3 === 1 ? 'mid' : 'near');
      const x = (rnd() * 96 + 2).toFixed(1);
      const dur = (20 + rnd() * 26).toFixed(1);
      const delay = (rnd() * 20).toFixed(1);
      dustHTML += `<span class="p-dust p-dust--${tier}" style="--x:${x}%; --dur:${dur}s; --delay:${delay}s;"></span>`;
    }
    dustHost.innerHTML = dustHTML;

    // 9 motivos de boceto: rama, flor, flourish, espiral, onda, brote (los
    // mismos motivos florales que se pintan a mano en las velas reales) más
    // pincel, paleta de pintor y silueta de vela — nada de iconos genéricos
    // (corazones, estrellas), todo ligado al oficio de pintar velas.
    const SKETCHES = [
      ['M22 104C30 78 26 50 44 20', 'M30 82C39 80 45 73 43 63', 'M26 58C35 58 41 51 39 42'],
      ['M60 30C68 22 78 24 80 34C84 26 94 28 94 38C94 50 76 60 60 66C56 52 52 40 60 30Z', 'M60 30C54 38 50 48 52 58'],
      ['M18 60C40 40 60 78 84 56C96 45 92 30 78 32'],
      ['M60 90C60 74 74 74 74 62C74 52 62 50 58 58C54 66 62 70 68 64'],
      ['M14 70C30 58 44 78 60 64C76 50 90 68 106 58'],
      ['M20 40C34 30 30 14 46 12', 'M46 12C50 20 44 26 36 24'],
      ['M28 104L56 64', 'M52 70L62 58', 'M56 64C62 54 68 44 80 34C82 40 78 48 70 54C64 60 60 62 56 64Z', 'M86 28A2.2 2.2 0 1 1 85.9 28'],
      ['M20 60C20 36 42 20 66 22C92 24 104 42 100 60C97 74 82 78 74 72C68 68 70 60 62 60C50 60 44 78 30 76C22 75 18 68 20 60Z', 'M38 42A4 4 0 1 1 37.9 42', 'M58 34A4 4 0 1 1 57.9 34', 'M78 40A4 4 0 1 1 77.9 40', 'M86 56A4 4 0 1 1 85.9 56'],
      ['M50 30L50 100C50 104 70 104 70 100L70 30', 'M50 30C50 26 70 26 70 30', 'M58 30L58 18', 'M58 18C60 12 64 10 62 4C60 8 56 10 58 18Z']
    ];
    const SKETCH_COUNT = isCoarse ? 10 : 26;
    let sketchHTML = '';
    for (let i = 0; i < SKETCH_COUNT; i++) {
      const tmpl = SKETCHES[i % SKETCHES.length];
      const x = (rnd() * 92 + 2).toFixed(1);
      const y = (rnd() * 92 + 2).toFixed(1);
      const size = (7 + rnd() * 8).toFixed(1);
      const sdur = (16 + rnd() * 12).toFixed(1);
      const sdelay = (rnd() * 20).toFixed(1);
      const paths = tmpl.map((d) => `<path d="${d}"/>`).join('');
      sketchHTML += `
        <div class="process-sketch-wrap" style="--x:${x}%; --y:${y}%; --ssize:${size}vw;">
          <svg class="process-sketch" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="animation-duration:${sdur}s; animation-delay:${sdelay}s;">${paths}</svg>
        </div>`;
    }
    sketchHost.innerHTML = sketchHTML;

    const SPARK_COUNT = isCoarse ? 6 : 14;
    let sparkHTML = '';
    for (let i = 0; i < SPARK_COUNT; i++) {
      const x = (rnd() * 96 + 2).toFixed(1);
      const y = (rnd() * 96 + 2).toFixed(1);
      const pdur = (5.5 + rnd() * 3).toFixed(1);
      const pdelay = (rnd() * 10).toFixed(1);
      sparkHTML += `<span class="p-spark" style="--x:${x}%; --y:${y}%; --pdur:${pdur}s; --pdelay:${pdelay}s;"></span>`;
    }
    sparkHost.innerHTML = sparkHTML;

    const GOLD_COUNT = isCoarse ? 4 : 8;
    let goldHTML = '';
    for (let i = 0; i < GOLD_COUNT; i++) {
      const x = (rnd() * 94 + 3).toFixed(1);
      const y = (rnd() * 94 + 3).toFixed(1);
      const pdur = (5 + rnd() * 2.5).toFixed(1);
      const pdelay = (rnd() * 8).toFixed(1);
      goldHTML += `<span class="p-gold" style="--x:${x}%; --y:${y}%; --pdur:${pdur}s; --pdelay:${pdelay}s;"></span>`;
    }
    goldHost.innerHTML = goldHTML;

    // ---- Símbolos flotantes: mismos <symbol> del hero, reutilizados vía
    // <use> (viven en el <svg> de #heroSymbols, con ids globales al
    // documento) — un acento discreto, nunca tantos como en el hero. ----
    if (symbolHost) {
      const SYMBOL_IDS = [
        'sym-cross', 'sym-chrismon', 'sym-dove', 'sym-wheat', 'sym-grapes',
        'sym-star', 'sym-flame', 'sym-crown', 'sym-olive'
      ];
      const LAYERS = ['back', 'mid', 'front'];
      const SYMBOL_COUNT = isCoarse ? 7 : 16;
      const golden = Math.PI * (3 - Math.sqrt(5));
      let symbolHTML = '';
      for (let i = 0; i < SYMBOL_COUNT; i++) {
        const r = Math.sqrt((i + 0.5) / SYMBOL_COUNT);
        const theta = i * golden;
        const x = (50 + r * Math.cos(theta) * 45).toFixed(1);
        const y = (50 + r * Math.sin(theta) * 44).toFixed(1);
        const layer = LAYERS[i % LAYERS.length];
        const size = layer === 'back' ? 96 + rnd() * 30 : layer === 'mid' ? 62 + rnd() * 20 : 40 + rnd() * 14;
        const dur = (18 + rnd() * 14).toFixed(1);
        const delay = (-(rnd() * 16)).toFixed(1);
        const driftX = (10 + rnd() * 10).toFixed(0);
        const driftY = (-(8 + rnd() * 10)).toFixed(0);
        const rot = (2 + rnd() * 3).toFixed(1);
        // Ciclo de aparición propio (nunca sincronizado entre símbolos): cada
        // uno sube de tenue a nítido y vuelve a bajar en su propio tiempo.
        const appearDur = (7 + rnd() * 6).toFixed(1);
        const appearDelay = (-(rnd() * 12)).toFixed(1);
        const id = SYMBOL_IDS[i % SYMBOL_IDS.length];
        symbolHTML += `<div class="process-symbol process-symbol--${layer}" style="--x:${x}%; --y:${y}%; --psize:${size.toFixed(0)}px; --float-dur:${dur}s; --float-delay:${delay}s; --drift-x:${driftX}px; --drift-y:${driftY}px; --rot-a:-${rot}deg; --rot-b:${rot}deg; --appear-dur:${appearDur}s; --appear-delay:${appearDelay}s;"><svg viewBox="0 0 48 48" focusable="false"><use href="#${id}"></use></svg></div>`;
      }
      symbolHost.innerHTML = symbolHTML;
    }
    } // fin build()

    let built = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || built) return;
        built = true;
        build();
        io.disconnect();
      });
    }, { rootMargin: '600px 0px' });
    io.observe(section);
  })();

  /* ===== PROCESO: sendero que se enciende a medida que se recorre ===== */
  const processPath = document.getElementById('processPath');
  const processPathFill = document.getElementById('processPathFill');
  const processSection = document.getElementById('proceso');
  if (processPath && processPathFill) {
    const phases = Array.from(processPath.querySelectorAll('.process-phase'));

    const phaseIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-path');
      });
    }, { threshold: 0.4 });
    phases.forEach((phase) => phaseIO.observe(phase));

    const reduceMotionProcess = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let processInView = false;
    const processSectionIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { processInView = entry.isIntersecting; });
    }, { threshold: 0 });
    processSectionIO.observe(processPath);

    if (!reduceMotionProcess) {
      function fillProcessPath() {
        requestAnimationFrame(fillProcessPath);
        if (!processInView) return;
        const rect = processPath.getBoundingClientRect();
        const total = rect.height;
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - rect.top) / total));
        processPathFill.style.transform = `scaleY(${progress})`;
        // El fondo del taller (bocetos, cera, pinceladas, pan de oro, destello
        // final) escucha esta misma variable para evolucionar con el scroll.
        if (processSection) processSection.style.setProperty('--pp', progress.toFixed(4));
      }
      requestAnimationFrame(fillProcessPath);
    } else {
      processPathFill.style.transform = 'scaleY(1)';
      if (processSection) processSection.style.setProperty('--pp', '0.5');
    }
  }

  /* ===== SLIDERS DE UNA SOLA PIEZA VISIBLE (Colecciones): flechas + swipe
     para pasar a la siguiente, nunca varias piezas a la vez. =====
     El deslizamiento es scroll horizontal NATIVO del navegador, con "snap"
     a cada foto (ver .coll-slider-viewport en styles.css) — no un arrastre
     simulado a mano con eventos de puntero/táctiles. Después de varios
     intentos con Pointer Events y con Touch Events, en algunos iPhone reales
     el segundo gesto se perdía sin más (el toque no llegaba a generar ni
     touchmove); dejar que sea el propio Safari quien gestione el scroll
     elimina ese problema de raíz — es exactamente el mecanismo que usan las
     galerías nativas de fotos. Nuestro JS solo escucha a qué foto ha
     llegado el scroll para actualizar el contador y los botones. */
  function initSlider(root) {
    const viewport = root.querySelector('.coll-slider-viewport');
    const track = root.querySelector('.coll-slider-track');
    const slides = Array.from(track.children);
    if (slides.length < 2) { root.querySelectorAll('.gallery-arrow').forEach(b => b.style.display = 'none'); }
    const prevBtn = root.querySelector('.gallery-arrow.prev');
    const nextBtn = root.querySelector('.gallery-arrow.next');
    const curEl = root.querySelector('.coll-slider-count .cur');
    let index = 0;

    function syncUI() {
      if (curEl) curEl.textContent = String(index + 1);
      // Solo se reproduce el vídeo de la foto activa: cualquier otro se pausa
      // al navegar, para no dejar audio/decodificación de fondo sin que se vea.
      slides.forEach((slide, i) => {
        const v = slide.querySelector('video');
        if (v && i !== index) v.pause();
      });
    }
    function goTo(i, animate) {
      index = (i + slides.length) % slides.length;
      viewport.scrollTo({ left: index * viewport.clientWidth, behavior: animate === false ? 'auto' : 'smooth' });
      syncUI();
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    // Cuando el usuario desliza con el dedo o arrastra con el ratón, es el
    // navegador el que mueve el scroll — aquí solo detectamos a qué foto ha
    // llegado (una vez que el gesto se asienta) para poner al día el
    // contador y pausar vídeos que ya no se ven.
    let scrollTimer = null;
    viewport.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const w = viewport.clientWidth || 1;
        const i = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / w)));
        if (i !== index) { index = i; syncUI(); }
      }, 80);
    }, { passive: true });

    goTo(0, false);
  }

  document.querySelectorAll('.coll-slider').forEach((slider) => initSlider(slider));

  /* ===== CONTACT FORM VALIDATION ===== */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field){
    const input = field.querySelector('input, select, textarea');
    if (!input) return true;
    const valid = input.checkValidity();
    field.classList.toggle('invalid', !valid);
    return valid;
  }

  form.querySelectorAll('.field').forEach(field => {
    const input = field.querySelector('input, select, textarea');
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => { if (field.classList.contains('invalid')) validateField(field); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('.field');
    let allValid = true;
    fields.forEach(field => { if (!validateField(field)) allValid = false; });

    if (allValid) {
      formSuccess.classList.add('show');
      form.reset();
      fields.forEach(f => f.classList.remove('invalid'));
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    } else {
      const firstInvalid = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  /* ===== HALO DE CURSOR (desktop pointer only) =====
     El cursor del sistema (flecha, pointer nativo en clicables) no se toca
     en ningún momento; esto solo mueve un halo de luz cálida por detrás,
     con interpolación (lerp) hacia la posición real del ratón para que el
     movimiento se sienta fluido en vez de clavado al pixel. Todo vía
     transform: translate3d en un rAF loop, sin tocar left/top (evita
     repaints, solo compositing). */
  const cursorHalo = document.getElementById('cursorHalo');
  if (window.matchMedia('(pointer: fine)').matches && cursorHalo) {
    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let x = targetX, y = targetY;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX; targetY = e.clientY;
      if (!active) { active = true; cursorHalo.classList.add('is-visible'); }
    });
    window.addEventListener('mouseleave', () => {
      active = false;
      cursorHalo.classList.remove('is-visible');
    });

    const LERP = 0.16;
    function tick() {
      x += (targetX - x) * LERP;
      y += (targetY - y) * LERP;
      cursorHalo.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.querySelectorAll('a, button, [role="button"], input, textarea, select, .cosmic-gallery-item, .coll-slide, .sphere-stage').forEach(el => {
      el.addEventListener('mouseenter', () => cursorHalo.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursorHalo.classList.remove('is-hover'));
    });
  }

  /* ===== TOALLAS: nombres bordados apareciendo por el fondo, en bucle
     continuo y asíncrono. Sin agujas ni SVG: cada nombre es un <span> HTML
     con un barrido de clip-path (izquierda a derecha, continuo y suave) que
     simula el bordado formándose, seguido de una pausa y un desvanecido en
     dos tiempos. Reutiliza los mismos nodos — nunca se crean/destruyen. ===== */
  (function initEmbroidery() {
    const section = document.getElementById('toallas');
    const field = document.getElementById('embroideryField');
    if (!section || !field) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const NAMES = ['Martina', 'Sofía', 'Lucas', 'Carmen', 'Valentina', 'Daniel', 'Emma', 'Pablo', 'Elena', 'Mateo', 'Julia', 'Hugo'];
    const THREAD_COLORS = ['#c9a463', '#b5651d', '#a4677a', '#6f8f7c', '#6f8fa6'];
    // En táctil, menos "hilos" animándose en bucle a la vez (además, en
    // pantallas estrechas solo hay 2 zonas — ver ZONES_NARROW — así que
    // menos unidades también evita que se amontonen).
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const UNIT_COUNT = isCoarse ? 3 : 5;
    const ZONES_WIDE = [
      { x0: .04, y0: .10, x1: .30, y1: .26 },
      { x0: .70, y0: .10, x1: .95, y1: .26 },
      { x0: .04, y0: .72, x1: .30, y1: .90 },
      { x0: .70, y0: .72, x1: .95, y1: .90 },
      { x0: .04, y0: .40, x1: .15, y1: .62 }
    ];
    const ZONES_NARROW = [
      { x0: .06, y0: .05, x1: .92, y1: .14 },
      { x0: .06, y0: .88, x1: .92, y1: .96 }
    ];

    let W = 0, H = 0, contentRect = null, sectionVisible = true;

    function measure() {
      const r = section.getBoundingClientRect();
      W = r.width; H = r.height;
      const content = section.querySelector('.towels-content');
      const cr = content.getBoundingClientRect();
      contentRect = {
        x0: cr.left - r.left - 55, y0: cr.top - r.top - 45,
        x1: cr.right - r.left + 55, y1: cr.bottom - r.top + 45
      };
    }
    measure();
    // Reasegura la medición cuando las fuentes (Dancing Script) terminen de
    // cargar: si tardan, el ancho de los nombres y el rect protegido del
    // contenido podrían haberse calculado con las fuentes de reserva.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);

    function rectsOverlap(a, b) {
      return !(a.x1 < b.x0 || a.x0 > b.x1 || a.y1 < b.y0 || a.y0 > b.y1);
    }
    function rnd(min, max) { return min + Math.random() * (max - min); }
    function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }
    function animate(el, kf, opts) { return el.animate(kf, opts).finished.catch(() => {}); }

    // ---- Cola de nombres: recorre la lista entera barajada antes de repetir
    // ninguno, y nunca deja que dos zonas muestren el mismo nombre a la vez. ----
    let nameQueue = [];
    const activeNames = new Set();
    function shuffledNames() {
      const arr = NAMES.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    function nextName(prevName) {
      if (nameQueue.length === 0) nameQueue = shuffledNames();
      let idx = nameQueue.findIndex((n) => !activeNames.has(n) && n !== prevName);
      if (idx === -1) idx = nameQueue.findIndex((n) => !activeNames.has(n));
      if (idx === -1) idx = 0;
      const name = nameQueue.splice(idx, 1)[0];
      activeNames.add(name);
      return name;
    }

    function makeUnit(i) {
      const color = THREAD_COLORS[i % THREAD_COLORS.length];
      const text = document.createElement('span');
      text.className = 'stitch-text';
      text.style.color = color;
      field.appendChild(text);
      return { text, lastName: null, zoneIdx: i };
    }

    const units = [];
    for (let i = 0; i < UNIT_COUNT; i++) units.push(makeUnit(i));

    function pickSpawn(unit, textWidth) {
      const narrow = W < 760;
      const zones = narrow ? ZONES_NARROW : ZONES_WIDE;
      const zone = zones[unit.zoneIdx % zones.length];
      const zx0 = zone.x0 * W, zx1 = zone.x1 * W, zy0 = zone.y0 * H, zy1 = zone.y1 * H;
      for (let attempt = 0; attempt < 10; attempt++) {
        const maxX = Math.max(zx0, Math.min(zx1 - textWidth, W - textWidth - 20));
        const x = rnd(zx0, Math.max(zx0 + 1, maxX));
        const y = rnd(zy0, zy1);
        const rect = { x0: x - 10, y0: y - 34, x1: x + textWidth + 10, y1: y + 16 };
        if (!contentRect || !rectsOverlap(rect, contentRect)) return { x, y };
      }
      return { x: Math.max(20, W * 0.05), y: Math.max(50, H * 0.12) };
    }

    async function waitUntilVisible() {
      while (!sectionVisible) await sleep(400);
    }

    async function cycle(unit) {
      while (true) {
        await waitUntilVisible();

        const name = nextName(unit.lastName);
        unit.lastName = name;
        const fontSize = W < 760 ? 34 : 46;
        unit.text.style.fontSize = fontSize + 'px';
        unit.text.textContent = name;
        unit.text.style.opacity = '1';
        unit.text.style.clipPath = 'inset(0 100% 0 0)';
        const textWidth = unit.text.getBoundingClientRect().width || name.length * fontSize * 0.5;

        const spawn = pickSpawn(unit, textWidth);
        const tilt = rnd(-6, 6);
        unit.text.style.left = spawn.x.toFixed(1) + 'px';
        unit.text.style.top = (spawn.y - fontSize * 0.78).toFixed(1) + 'px';
        unit.text.style.transformOrigin = 'left center';
        unit.text.style.transform = `rotate(${tilt.toFixed(2)}deg)`;

        // -- 1) El bordado se va formando: un barrido continuo y muy suave,
        // como si el hilo fuera cosiendo el nombre de izquierda a derecha. --
        const stitchDuration = 2800 + textWidth * 9 + Math.random() * 500;
        await animate(unit.text,
          [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
          { duration: stitchDuration, easing: 'cubic-bezier(.32,.08,.24,1)', fill: 'forwards' }
        );

        // -- 2) Reposo: el nombre terminado permanece visible, quieto. --
        await sleep(3600 + Math.random() * 1200);

        // -- 3) Se apaga en dos tiempos: primero pierde algo de opacidad,
        // después se desvanece del todo — nunca de golpe. --
        await animate(unit.text,
          [{ opacity: 1 }, { opacity: .55, offset: .4 }, { opacity: 0 }],
          { duration: 1900, easing: 'ease-in', fill: 'forwards' }
        );

        activeNames.delete(name);
        await sleep(500 + Math.random() * 900);
      }
    }

    units.forEach((unit, i) => {
      setTimeout(() => cycle(unit), i * 700 + Math.random() * 500);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { sectionVisible = entry.isIntersecting; });
    }, { threshold: 0.05 });
    io.observe(section);
  })();

  /* ===== UNIVERSO: ambientación de fondo cinematográfica. Genera el campo
     estelar denso, el polvo cósmico, las estrellas fugaces y los meteoritos
     lejanos — todo dentro de #cosmos (ya existía, ya es z-index:0, ya está
     detrás de .sphere-stage). No toca sphere.js ni ningún selector de la
     esfera; solo LEE la posición del stage (getBoundingClientRect, sin
     mutarlo) para mantener las fugaces/meteoritos siempre fuera de ella. ===== */
  (function buildCosmosAmbience() {
    const section = document.getElementById('esfera');
    const stage = document.getElementById('sphereStage');
    const farHost = document.getElementById('cosmosFar');
    const midHost = document.getElementById('cosmosMid');
    const goldFarHost = document.getElementById('cosmosGoldFar');
    const goldDustHost = document.getElementById('cosmosGoldDust');
    const moteHost = document.getElementById('cosmosMotes');
    const shootHost = document.getElementById('cosmosShooting');
    const farMeteorHost = document.getElementById('cosmosFarMeteor');
    if (!section || !stage || !farHost || !midHost || !moteHost || !shootHost || !farMeteorHost) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let seed = 6421;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function rndRange(min, max) { return min + rnd() * (max - min); }

    // ---- Campo estelar: lejano (denso, diminuto) + medio (menos denso, algo mayor).
    // Los offsets se calculan en px reales sobre la altura/anchura de la
    // sección (medición de solo lectura), no en vw/vh: la sección es más alta
    // que un viewport, así que vh dejaba las estrellas solo en la franja
    // superior. Con px sobre el alto real, cubren toda la sección de forma
    // homogénea, de borde a borde.
    // 7200+880 sombras generadas y aplicadas de golpe (aunque la sección
    // estuviera fuera de pantalla) es un trabajo pesado de sobra para
    // colgar un móvil de gama media/baja — mucho menos recuento en táctil,
    // y todo el bloque diferido hasta que la sección esté a punto de
    // entrar en pantalla (ver buildAll más abajo). ----
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const FAR_COUNT = isCoarse ? 900 : 3200;
    const MID_COUNT = isCoarse ? 140 : 420;
    function buildStars() {
      const sr = section.getBoundingClientRect();
      const w = sr.width, h = sr.height;

      const farShadow = [];
      for (let i = 0; i < FAR_COUNT; i++) {
        const x = (rnd() * w).toFixed(1);
        const y = (rnd() * h).toFixed(1);
        const a = (0.2 + rnd() * 0.45).toFixed(2);
        farShadow.push(`${x}px ${y}px 0 rgba(255,255,255,${a})`);
      }
      farHost.style.boxShadow = farShadow.join(',');

      const midShadow = [];
      for (let i = 0; i < MID_COUNT; i++) {
        const x = (rnd() * w).toFixed(1);
        const y = (rnd() * h).toFixed(1);
        const a = (0.3 + rnd() * 0.45).toFixed(2);
        const blur = (rnd() * 1.6).toFixed(1);
        midShadow.push(`${x}px ${y}px ${blur}px rgba(255,255,255,${a})`);
      }
      midHost.style.boxShadow = midShadow.join(',');

      // ---- Estrellas doradas: capa extra, muy dispersa y tenue, sobre el
      // cielo blanco de arriba — un acento cálido, nunca una segunda capa
      // que compita en densidad con las 8000 estrellas blancas. ----
      if (goldFarHost) {
        const GOLD_STAR_COUNT = isCoarse ? 35 : 110;
        const goldShadow = [];
        for (let i = 0; i < GOLD_STAR_COUNT; i++) {
          const x = (rnd() * w).toFixed(1);
          const y = (rnd() * h).toFixed(1);
          const a = (0.25 + rnd() * 0.35).toFixed(2);
          goldShadow.push(`${x}px ${y}px 2px rgba(255,204,120,${a})`);
        }
        goldFarHost.style.boxShadow = goldShadow.join(',');
      }
    }
    // ---- Polvo cósmico: motas diminutas, movimiento muy lento, dos profundidades ----
    function buildMotes() {
      const MOTE_COUNT = 34;
      let moteHTML = '';
      for (let i = 0; i < MOTE_COUNT; i++) {
        const far = i % 2 === 0;
        const x = (rnd() * 100).toFixed(1);
        const y = (rnd() * 100).toFixed(1);
        const s = far ? (0.8 + rnd() * 0.7).toFixed(1) : (1.4 + rnd() * 1.1).toFixed(1);
        const mop = far ? (0.12 + rnd() * 0.15).toFixed(2) : (0.22 + rnd() * 0.22).toFixed(2);
        const mdur = (far ? 80 + rnd() * 50 : 55 + rnd() * 35).toFixed(1);
        const mdelay = (rnd() * 40).toFixed(1);
        const mdx = (rnd() * 16 - 8).toFixed(1);
        const mdy = (-30 - rnd() * 40).toFixed(1);
        moteHTML += `<span class="p-mote" style="left:${x}%; top:${y}%; width:${s}px; height:${s}px; --mop:${mop}; --mdur:${mdur}s; --mdelay:${mdelay}s; --mdx:${mdx}px; --mdy:${mdy}px;"></span>`;
      }
      moteHost.innerHTML = moteHTML;

      // ---- Polvo dorado: pocas motas, mismo movimiento que el polvo blanco,
      // solo que cálidas y con halo — un acento elegante, no una lluvia. ----
      if (goldDustHost) {
        const GOLD_MOTE_COUNT = 12;
        let goldMoteHTML = '';
        for (let i = 0; i < GOLD_MOTE_COUNT; i++) {
          const far = i % 2 === 0;
          const x = (rnd() * 100).toFixed(1);
          const y = (rnd() * 100).toFixed(1);
          const s = far ? (1 + rnd() * 0.8).toFixed(1) : (1.6 + rnd() * 1.2).toFixed(1);
          const mop = far ? (0.15 + rnd() * 0.15).toFixed(2) : (0.25 + rnd() * 0.2).toFixed(2);
          const mdur = (far ? 85 + rnd() * 50 : 60 + rnd() * 35).toFixed(1);
          const mdelay = (rnd() * 40).toFixed(1);
          const mdx = (rnd() * 16 - 8).toFixed(1);
          const mdy = (-30 - rnd() * 40).toFixed(1);
          goldMoteHTML += `<span class="p-gold-mote" style="left:${x}%; top:${y}%; width:${s}px; height:${s}px; --mop:${mop}; --mdur:${mdur}s; --mdelay:${mdelay}s; --mdx:${mdx}px; --mdy:${mdy}px;"></span>`;
        }
        goldDustHost.innerHTML = goldMoteHTML;
      }
    }

    // ---- Zonas seguras: franjas donde generar fugaces/meteoritos que nunca
    // se solapan con el rectángulo (con margen) donde vive la esfera —
    // medición de solo lectura, no se modifica nada del stage. ----
    function getSafeZones() {
      const sr = section.getBoundingClientRect();
      const gr = stage.getBoundingClientRect();
      const pad = 6;
      const box = {
        x0: ((gr.left - sr.left) / sr.width) * 100 - pad,
        x1: ((gr.right - sr.left) / sr.width) * 100 + pad,
        y0: ((gr.top - sr.top) / sr.height) * 100 - pad,
        y1: ((gr.bottom - sr.top) / sr.height) * 100 + pad
      };
      const zones = [];
      if (box.y0 > 4) zones.push({ x0: 0, x1: 100, y0: 1, y1: Math.max(1, box.y0) });
      if (box.y1 < 96) zones.push({ x0: 0, x1: 100, y0: Math.min(99, box.y1), y1: 99 });
      if (box.x0 > 4) zones.push({ x0: 1, x1: Math.max(1, box.x0), y0: 0, y1: 100 });
      if (box.x1 < 96) zones.push({ x0: Math.min(99, box.x1), x1: 99, y0: 0, y1: 100 });
      return zones.length ? zones : [{ x0: 1, x1: 99, y0: 1, y1: 12 }];
    }

    function buildStreak(host, count, opts) {
      let html = '';
      const zones = getSafeZones();
      for (let i = 0; i < count; i++) {
        const zone = zones[i % zones.length];
        const x = rndRange(zone.x0, zone.x1);
        const y = rndRange(zone.y0, zone.y1);
        const angle = rndRange(opts.angleMin, opts.angleMax) * (rnd() < 0.5 ? 1 : -1);
        const travel = rndRange(opts.travelMin, opts.travelMax);
        const ex = (Math.cos(angle * Math.PI / 180) * travel).toFixed(1);
        const ey = (Math.sin(angle * Math.PI / 180) * travel).toFixed(1);
        const dur = rndRange(opts.durMin, opts.durMax).toFixed(1);
        const delay = rndRange(0, opts.durMax).toFixed(1);
        html += `<span class="${opts.cls}" style="left:${x.toFixed(1)}%; top:${y.toFixed(1)}%; --${opts.prefix}a:${angle.toFixed(1)}deg; --${opts.prefix}ex:${ex}px; --${opts.prefix}ey:${ey}px; --${opts.prefix}dur:${dur}s; --${opts.prefix}delay:${delay}s;"></span>`;
      }
      host.innerHTML = html;
    }

    // 36 fugaces desfasadas y 32 meteoritos lejanos, siempre dentro de las
    // franjas seguras (nunca cruzan la esfera).
    function regenerate() {
      buildStreak(shootHost, 36, { cls: 'p-shootingstar', prefix: 'sh', angleMin: 12, angleMax: 36, travelMin: 70, travelMax: 130, durMin: 16, durMax: 26 });
      buildStreak(farMeteorHost, 32, { cls: 'p-farmeteor', prefix: 'fm', angleMin: 22, angleMax: 44, travelMin: 40, travelMax: 75, durMin: 20, durMax: 32 });
    }

    // ---- Constelaciones: varias figuras fijas y discretas, siempre dentro
    // de las mismas franjas seguras que las fugaces/meteoritos — repartidas
    // en sub-tramos de cada franja para que no se amontonen entre sí. ----
    const NS = 'http://www.w3.org/2000/svg';
    function buildConstellations() {
      const svg = document.getElementById('cosmosConstellations');
      if (!svg) return;
      const sr = section.getBoundingClientRect();
      svg.innerHTML = '';
      const zones = getSafeZones();
      const count = 7;
      const repeatsPerZone = Math.ceil(count / zones.length);
      for (let c = 0; c < count; c++) {
        const zone = zones[c % zones.length];
        const slot = Math.floor(c / zones.length);
        const slotSpan = (zone.x1 - zone.x0) / repeatsPerZone;
        const slotX0 = zone.x0 + slotSpan * slot;
        const slotX1 = slotX0 + slotSpan;
        const boxW = Math.min(140, (slotX1 - slotX0) / 100 * sr.width * 0.75);
        const boxH = Math.min(100, (zone.y1 - zone.y0) / 100 * sr.height * 0.7);
        const originX = rndRange(slotX0, Math.max(slotX0 + 0.1, slotX1)) / 100 * sr.width;
        const originY = rndRange(zone.y0, zone.y1) / 100 * sr.height;
        const pointCount = 4 + Math.floor(rnd() * 2);
        const pts = [];
        for (let p = 0; p < pointCount; p++) {
          pts.push({
            x: originX + rndRange(0, boxW),
            y: originY + rndRange(0, boxH)
          });
        }
        const g = document.createElementNS(NS, 'g');
        for (let p = 1; p < pts.length; p++) {
          const line = document.createElementNS(NS, 'line');
          line.setAttribute('x1', pts[p - 1].x.toFixed(1));
          line.setAttribute('y1', pts[p - 1].y.toFixed(1));
          line.setAttribute('x2', pts[p].x.toFixed(1));
          line.setAttribute('y2', pts[p].y.toFixed(1));
          g.appendChild(line);
        }
        pts.forEach((pt) => {
          const circle = document.createElementNS(NS, 'circle');
          circle.setAttribute('cx', pt.x.toFixed(1));
          circle.setAttribute('cy', pt.y.toFixed(1));
          circle.setAttribute('r', (1.3 + rnd() * 0.6).toFixed(1));
          g.appendChild(circle);
        });
        svg.appendChild(g);
      }
    }

    // ---- Rayos de sol: convergen desde una esquina hacia el centro real de
    // la esfera (medición de solo lectura del stage, nunca se modifica). ----
    const rayHost = document.getElementById('cosmosRays');
    function buildRays() {
      if (!rayHost) return;
      const sr = section.getBoundingClientRect();
      const gr = stage.getBoundingClientRect();
      const target = { x: (gr.left + gr.right) / 2 - sr.left, y: (gr.top + gr.bottom) / 2 - sr.top };
      const origin = { x: sr.width * 0.92, y: sr.height * 0.06 };
      const baseAngle = Math.atan2(target.y - origin.y, target.x - origin.x) * 180 / Math.PI;
      const dist = Math.hypot(target.x - origin.x, target.y - origin.y);
      // Menos rayos, más finos y con origen ligeramente disperso: evita que
      // se acumulen todos en el mismo píxel y generen una mancha clara.
      const RAY_COUNT = 4;
      let html = '';
      for (let i = 0; i < RAY_COUNT; i++) {
        const spread = rndRange(-7, 7);
        const len = (dist * rndRange(1.05, 1.35)).toFixed(0);
        const w = (8 + rnd() * 14).toFixed(0);
        const rdur = (24 + rnd() * 20).toFixed(1);
        const rdelay = (rnd() * 22).toFixed(1);
        const jx = origin.x + rndRange(-18, 18);
        const jy = origin.y + rndRange(-14, 14);
        html += `<span class="p-ray" style="width:${len}px; height:${w}px; --rdur:${rdur}s; --rdelay:${rdelay}s; transform: translate(${jx.toFixed(0)}px, ${jy.toFixed(0)}px) rotate(${(baseAngle + spread).toFixed(1)}deg);"></span>`;
      }
      rayHost.innerHTML = html;
    }

    // Todo lo anterior es DOM + miles de box-shadow — pesado de sobra para
    // generarlo de golpe al cargar la página si la sección está muy por
    // debajo del pliegue (como aquí). Se construye una sola vez, solo
    // cuando la sección está a punto de entrar en pantalla.
    // En táctil el fondo se queda en una "captura" fija: el campo de
    // estrellas y las constelaciones (estáticos, un solo pintado), pero sin
    // el polvo cósmico, las fugaces, los meteoritos ni los rayos — todo eso
    // son capas con su propia animación infinita, y en móvil se prescinde
    // de ellas en vez de generarlas y dejarlas corriendo sin parar.
    let built = false;
    function buildAll() {
      buildStars();
      buildConstellations();
      if (isCoarse) return;
      buildMotes();
      regenerate();
      buildRays();
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || built) return;
        built = true;
        buildAll();
        io.disconnect();
      });
    }, { rootMargin: '600px 0px' });
    io.observe(section);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (!built) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildAll, 400);
    });
  })();

});
