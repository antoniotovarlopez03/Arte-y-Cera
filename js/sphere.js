(function () {
  // Todas las fotos que aparecen en las secciones de Colecciones (las 7
  // categorías: Cirios Pascuales, Bautizo, Velas para Mesa y Bodas,
  // Navidad, Toallas de Bautizo, Toallas de Bautizo con Vela), sin
  // repetir ninguna y sin vídeos, para que la esfera se vea muy poblada.
  const IMAGES = [
    'images/colecciones/cirios-basicos/cirios-basicos-01.webp', 'images/colecciones/cirios-basicos/cirios-basicos-02.webp', 'images/colecciones/cirios-basicos/cirios-basicos-03.webp', 'images/colecciones/cirios-basicos/cirios-basicos-04.webp',
    'images/colecciones/cirios-basicos/cirios-basicos-05.webp', 'images/colecciones/cirios-basicos/cirios-basicos-06.webp', 'images/colecciones/cirios-basicos/cirios-basicos-07.webp', 'images/colecciones/cirios-basicos/cirios-basicos-08.webp',
    'images/colecciones/cirios-basicos/cirios-basicos-09.webp', 'images/colecciones/cirios-basicos/cirios-basicos-10.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-01.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-02.webp',
    'images/colecciones/cirios-elaborados/cirios-elaborados-03.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-04.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-05.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-06.webp',
    'images/colecciones/cirios-elaborados/cirios-elaborados-07.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-08.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-09.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-10.webp',
    'images/colecciones/cirios-elaborados/cirios-elaborados-11.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-12.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-13.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-14.webp',
    'images/colecciones/cirios-elaborados/cirios-elaborados-15.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-16.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-17.webp', 'images/colecciones/cirios-elaborados/cirios-elaborados-18.webp',
    'images/colecciones/cirios-elaborados/cirios-elaborados-19.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-01.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-02.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-03.webp',
    'images/colecciones/lazos-al-detalle/lazos-al-detalle-04.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-05.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-06.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-07.webp',
    'images/colecciones/lazos-al-detalle/lazos-al-detalle-08.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-09.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-10.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-11.webp',
    'images/colecciones/lazos-al-detalle/lazos-al-detalle-12.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-13.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-14.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-15.webp',
    'images/colecciones/lazos-al-detalle/lazos-al-detalle-16.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-17.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-18.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-19.webp',
    'images/colecciones/lazos-al-detalle/lazos-al-detalle-20.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-21.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-22.webp', 'images/colecciones/lazos-al-detalle/lazos-al-detalle-23.webp',
    'images/colecciones/lazos-al-detalle/lazos-al-detalle-24.webp', 'images/colecciones/lazos-basicos/lazos-basicos-01.webp', 'images/colecciones/lazos-basicos/lazos-basicos-02.webp', 'images/colecciones/lazos-basicos/lazos-basicos-03.webp',
    'images/colecciones/lazos-basicos/lazos-basicos-04.webp', 'images/colecciones/lazos-basicos/lazos-basicos-05.webp', 'images/colecciones/lazos-basicos/lazos-basicos-06.webp', 'images/colecciones/lazos-basicos/lazos-basicos-07.webp',
    'images/colecciones/lazos-basicos/lazos-basicos-08.webp', 'images/colecciones/lazos-basicos/lazos-basicos-09.webp', 'images/colecciones/lazos-basicos/lazos-basicos-10.webp', 'images/colecciones/lazos-basicos/lazos-basicos-11.webp',
    'images/colecciones/lazos-basicos/lazos-basicos-12.webp', 'images/colecciones/lazos-basicos/lazos-basicos-13.webp', 'images/colecciones/lazos-basicos/lazos-basicos-14.webp', 'images/colecciones/lazos-basicos/lazos-basicos-15.webp',
    'images/colecciones/lazos-basicos/lazos-basicos-16.webp', 'images/colecciones/lazos-basicos/lazos-basicos-17.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-01.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-02.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-03.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-04.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-05.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-06.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-07.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-08.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-09.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-10.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-11.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-12.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-13.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-14.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-15.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-16.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-17.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-18.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-19.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-20.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-21.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-22.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-23.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-24.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-25.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-26.webp',
    'images/colecciones/lazos-elaborados/lazos-elaborados-27.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-28.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-29.webp', 'images/colecciones/lazos-elaborados/lazos-elaborados-30.webp',
    'images/colecciones/lazos-personalizados/lazos-personalizados-01.webp', 'images/colecciones/lazos-personalizados/lazos-personalizados-02.webp', 'images/colecciones/lazos-personalizados/lazos-personalizados-03.webp', 'images/colecciones/lazos-personalizados/lazos-personalizados-04.webp',
    'images/colecciones/lazos-personalizados/lazos-personalizados-05.webp', 'images/colecciones/lazos-personalizados/lazos-personalizados-06.webp', 'images/colecciones/mesa-basicas/mesa-basicas-01.webp', 'images/colecciones/mesa-basicas/mesa-basicas-02.webp',
    'images/colecciones/mesa-basicas/mesa-basicas-03.webp', 'images/colecciones/mesa-basicas/mesa-basicas-04.webp', 'images/colecciones/mesa-basicas/mesa-basicas-05.webp', 'images/colecciones/mesa-basicas/mesa-basicas-06.webp',
    'images/colecciones/mesa-basicas/mesa-basicas-07.webp', 'images/colecciones/mesa-basicas/mesa-basicas-08.webp', 'images/colecciones/mesa-basicas/mesa-basicas-09.webp', 'images/colecciones/mesa-basicas/mesa-basicas-10.webp',
    'images/colecciones/mesa-basicas/mesa-basicas-11.webp', 'images/colecciones/mesa-basicas/mesa-basicas-12.webp', 'images/colecciones/mesa-basicas/mesa-basicas-13.webp', 'images/colecciones/mesa-basicas/mesa-basicas-14.webp',
    'images/colecciones/mesa-basicas/mesa-basicas-15.webp', 'images/colecciones/mesa-basicas/mesa-basicas-16.webp', 'images/colecciones/mesa-basicas/mesa-basicas-17.webp', 'images/colecciones/mesa-basicas/mesa-basicas-18.webp',
    'images/colecciones/mesa-basicas/mesa-basicas-19.webp', 'images/colecciones/mesa-basicas/mesa-basicas-20.webp', 'images/colecciones/mesa-basicas/mesa-basicas-21.webp', 'images/colecciones/mesa-basicas/mesa-basicas-22.webp',
    'images/colecciones/mesa-basicas/mesa-basicas-23.webp', 'images/colecciones/mesa-basicas/mesa-basicas-24.webp', 'images/colecciones/mesa-basicas/mesa-basicas-25.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-01.webp',
    'images/colecciones/mesa-elaboradas/mesa-elaboradas-02.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-03.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-04.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-05.webp',
    'images/colecciones/mesa-elaboradas/mesa-elaboradas-06.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-07.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-08.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-09.webp',
    'images/colecciones/mesa-elaboradas/mesa-elaboradas-10.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-11.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-12.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-13.webp',
    'images/colecciones/mesa-elaboradas/mesa-elaboradas-14.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-15.webp', 'images/colecciones/mesa-elaboradas/mesa-elaboradas-16.webp', 'images/colecciones/navidad/navidad-01.jpeg',
    'images/colecciones/navidad/navidad-02.jpeg', 'images/colecciones/navidad/navidad-03.jpeg', 'images/colecciones/navidad/navidad-04.jpeg', 'images/colecciones/navidad/navidad-05.jpeg',
    'images/colecciones/navidad/navidad-06.jpeg', 'images/colecciones/navidad/navidad-07.jpeg', 'images/colecciones/navidad/navidad-08.jpeg', 'images/colecciones/navidad/navidad-09.jpeg',
    'images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-01.jpeg', 'images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-02.jpeg', 'images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-03.jpeg', 'images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-04.jpeg',
    'images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-05.jpeg', 'images/colecciones/toallas-bautizo/toallas-bautizo-01.jpeg', 'images/colecciones/toallas-bautizo/toallas-bautizo-02.jpeg', 'images/colecciones/toallas-bautizo/toallas-bautizo-03.jpeg',
    'images/colecciones/toallas-bautizo/toallas-bautizo-04.jpeg', 'images/colecciones/toallas-bautizo/toallas-bautizo-05.jpeg'
  ];

  function isVideoSrc(src) {
    return /\.mp4$/i.test(src);
  }

  function openViewer(ctx, src) {
    if (isVideoSrc(src)) {
      ctx.viewerVideo.src = src;
      ctx.viewer.classList.add('is-video');
      ctx.viewerVideo.currentTime = 0;
      ctx.viewerVideo.play().catch(() => {});
    } else {
      ctx.viewerImg.src = src;
      ctx.viewer.classList.remove('is-video');
    }
    ctx.viewer.classList.add('open');
  }
  function closeViewer(ctx) {
    ctx.viewer.classList.remove('open');
    ctx.viewerVideo.pause();
  }

  // Mismo reparto que la esfera 3D (Fibonacci sphere), en coordenadas
  // esféricas puras — sin depender de three.js.
  function fibonacciPoint(i, n) {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * radiusAtY, y, z: Math.sin(theta) * radiusAtY };
  }

  /* ===== Versión móvil/táctil: esfera "de mentira" con CSS 3D =====
     Nada de WebGL, nada de raycasting, nada de cálculo por fotograma: cada
     foto se coloca UNA VEZ con un transform 3D fijo (rotateY + rotateX +
     translateZ, el truco clásico para pegar tarjetas a la superficie de
     una esfera), y el giro es una única animación CSS sobre el grupo
     entero — la resuelve el compositor de la GPU solo, sin JS corriendo
     en cada fotograma. Se usan ~36 fotos (muestreadas de las 166,
     repartidas entre todas las categorías) en vez de 166 independientes. */
  function initCssSphere(ctx) {
    const { stage, hint, loading } = ctx;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const COUNT = 36;
    const RADIUS = 118; // px

    const wrap = document.createElement('div');
    wrap.className = 'css-sphere';

    const glow = document.createElement('div');
    glow.className = 'css-sphere-glow';
    wrap.appendChild(glow);

    const group = document.createElement('div');
    group.className = 'css-sphere-group';
    if (reduceMotion) group.style.animation = 'none';
    wrap.appendChild(group);

    for (let i = 0; i < COUNT; i++) {
      const srcIdx = Math.round((i * (IMAGES.length - 1)) / (COUNT - 1));
      const src = IMAGES[srcIdx];
      const p = fibonacciPoint(i, COUNT);
      const phiDeg = Math.asin(p.y) * 180 / Math.PI;
      const thetaDeg = Math.atan2(p.x, p.z) * 180 / Math.PI;

      const item = document.createElement('div');
      item.className = 'css-sphere-item';
      item.style.transform = `rotateY(${thetaDeg.toFixed(2)}deg) rotateX(${(-phiDeg).toFixed(2)}deg) translateZ(${RADIUS}px)`;
      item.addEventListener('click', () => openViewer(ctx, src));

      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.alt = '';
      item.appendChild(img);

      group.appendChild(item);
    }

    stage.appendChild(wrap);
    if (loading) loading.classList.add('hide');
    if (hint) hint.textContent = 'Toca una pieza para verla de cerca';
  }

  /* ===== Versión escritorio: esfera 3D real con three.js (WebGL) =====
     Sin cambios de comportamiento respecto a la versión original — solo
     que three.js/OrbitControls ahora se cargan bajo demanda (import
     dinámico) en vez de import estático: en móvil, donde nunca se llama a
     esta función, el navegador no llega ni a pedir esos archivos. */
  async function initWebglSphere(ctx) {
    const { stage, canvas, hint, loading, viewer } = ctx;
    const [THREE, controlsModule] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js')
    ]);
    const { OrbitControls } = controlsModule;

    // Un plano por imagen: todas aparecen, ninguna se repite.
    const POINT_COUNT = IMAGES.length;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    // Distancia inicial calculada, no ajustada a ojo: con RADIUS=5.4 y el
    // jitter de baseRadius (±0.175), el radio visual máximo de la esfera
    // (fotos incluidas) es ~5.7. A distancia D, la mitad de la altura visible
    // es D*tan(FOV/2); para que la esfera ocupe ~86% de esa altura (completa,
    // con aire de margen, sin recortarse) hace falta D ≈ 5.7/0.86/tan(22.5°) ≈ 16.
    // (~32% más grande que el encuadre anterior, que ocupaba ~65%.)
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 6.5;
    // maxDistance sube junto con la posición inicial (antes 15, insuficiente
    // para encuadrar la esfera completa) para que la vista de entrada no
    // quede recortada al límite de zoom nada más cargar.
    controls.maxDistance = 23;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.4;
    controls.rotateSpeed = 0.55;

    const RADIUS = 5.4;
    const WARM_TINT = new THREE.Color(0xffe3b8);
    const DIM_TINT = new THREE.Color(0x8f8f8f);
    const WHITE_TINT = new THREE.Color(0xffffff);
    const GLOW_EMISSIVE = new THREE.Color(0x4a2a05);
    const NO_EMISSIVE = new THREE.Color(0x000000);
    const group = new THREE.Group();
    scene.add(group);

    // Iluminación cálida: ambiente suave + una luz direccional principal
    // y una luz puntual cercana a la cámara para reflejos sutiles.
    // Intensidades reforzadas para que la esfera se vea más iluminada.
    const ambient = new THREE.AmbientLight(0xfff2df, 1.05);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffd9a0, 2.3);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xffb648, 1.35, 34);
    rimLight.position.set(-3, -2, 9);
    scene.add(rimLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const textureCache = new Map();
    const videoEls = [];
    let loadedUniqueCount = 0;
    function markLoaded() {
      loadedUniqueCount++;
      // Se piden como máximo POINT_COUNT texturas distintas (una por plano);
      // con POINT_COUNT === IMAGES.length se piden y cargan todas.
      if (loadedUniqueCount >= Math.min(POINT_COUNT, IMAGES.length) && loading) {
        loading.classList.add('hide');
      }
    }
    // Cada foto del catálogo puede pesar hasta ~1536x2048px; cargar las 171
    // como textura WebGL a resolución completa (con mipmaps) llega a pedir
    // varios GB de memoria de GPU y hace que el móvil cierre la pestaña. En
    // la esfera cada plano ocupa una fracción minúscula de la pantalla, así
    // que aquí se reescala la imagen a un lienzo pequeño antes de subirla
    // como textura — misma foto, una fracción de la memoria.
    const TEXTURE_MAX_DIM = 420;
    function getTexture(src) {
      if (!textureCache.has(src)) {
        if (isVideoSrc(src)) {
          const video = document.createElement('video');
          video.src = src;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.autoplay = true;
          video.preload = 'auto';
          video.addEventListener('loadeddata', markLoaded, { once: true });
          video.play().catch(() => {});
          videoEls.push(video);
          const tex = new THREE.VideoTexture(video);
          tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          textureCache.set(src, tex);
        } else {
          const tex = new THREE.Texture();
          tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
          // Nitidez en los planos vistos en ángulo (la esfera los inclina constantemente
          // respecto a la cámara); el filtrado anisotrópico evita el desenfoque típico
          // de la minificación lineal por defecto de three.js.
          tex.anisotropy = maxAnisotropy;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          textureCache.set(src, tex);

          const img = new Image();
          img.onload = () => {
            const w = img.naturalWidth, h = img.naturalHeight;
            const scale = Math.min(1, TEXTURE_MAX_DIM / Math.max(w, h));
            const cw = Math.max(1, Math.round(w * scale));
            const ch = Math.max(1, Math.round(h * scale));
            const cnv = document.createElement('canvas');
            cnv.width = cw;
            cnv.height = ch;
            cnv.getContext('2d').drawImage(img, 0, 0, cw, ch);
            tex.image = cnv;
            tex.needsUpdate = true;
            markLoaded();
          };
          img.onerror = markLoaded;
          img.src = src;
        }
      }
      return textureCache.get(src);
    }

    const planes = [];

    // Esquinas redondeadas (más "pulidas") en vez del rectángulo seco de
    // PlaneGeometry — misma foto/vídeo, mismo tamaño, solo cambia el recorte.
    // Una única geometría compartida por todos los planos (son todos del
    // mismo tamaño), nada de coste extra por repetirla.
    function roundedRectGeometry(size, radius) {
      const shape = new THREE.Shape();
      const w = size / 2, h = size / 2, r = Math.min(radius, w, h);
      shape.moveTo(-w + r, -h);
      shape.lineTo(w - r, -h);
      shape.quadraticCurveTo(w, -h, w, -h + r);
      shape.lineTo(w, h - r);
      shape.quadraticCurveTo(w, h, w - r, h);
      shape.lineTo(-w + r, h);
      shape.quadraticCurveTo(-w, h, -w, h - r);
      shape.lineTo(-w, -h + r);
      shape.quadraticCurveTo(-w, -h, -w + r, -h);
      const geo = new THREE.ShapeGeometry(shape);
      // ShapeGeometry genera UVs iguales a las coordenadas del shape (sin
      // normalizar a 0-1); como el shape está centrado en el origen hay que
      // remapearlas a mano o la textura queda pegada a un borde en vez de
      // cubrir todo el plano.
      const uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) {
        uv.setXY(i, (uv.getX(i) + w) / size, (uv.getY(i) + h) / size);
      }
      uv.needsUpdate = true;
      return geo;
    }
    const cardGeometry = roundedRectGeometry(1.3, 0.16);

    for (let i = 0; i < POINT_COUNT; i++) {
      const src = IMAGES[i % IMAGES.length];
      const v = fibonacciPoint(i, POINT_COUNT);
      const dir = new THREE.Vector3(v.x, v.y, v.z);
      const baseRadius = RADIUS + (Math.random() - 0.5) * 0.35;
      const geometry = cardGeometry;
      const material = new THREE.MeshStandardMaterial({
        map: getTexture(src), color: 0xffffff, transparent: true, opacity: 0.96,
        side: THREE.DoubleSide, roughness: 0.55, metalness: 0.06,
        emissive: NO_EMISSIVE.clone()
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(dir).multiplyScalar(baseRadius);
      mesh.lookAt(dir.clone().multiplyScalar(baseRadius * 2));
      mesh.userData = {
        dir: dir.clone(), src, baseRadius, targetScale: 1, hovered: false,
        phase: Math.random() * Math.PI * 2, bobSpeed: 0.35 + Math.random() * 0.3
      };
      group.add(mesh);
      planes.push(mesh);
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    window.addEventListener('resize', resize);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredMesh = null;
    let hasInteracted = false;

    function setPointerFromEvent(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    function markInteracted() {
      if (hasInteracted) return;
      hasInteracted = true;
      if (hint) hint.classList.add('hide');
    }

    stage.addEventListener('pointerdown', markInteracted, { passive: true });
    stage.addEventListener('touchstart', markInteracted, { passive: true });

    stage.addEventListener('pointermove', (e) => {
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planes);
      const hit = hits.length ? hits[0].object : null;

      if (hit !== hoveredMesh) {
        if (hoveredMesh) {
          hoveredMesh.userData.targetScale = 1;
          hoveredMesh.userData.hovered = false;
        }
        if (hit) {
          hit.userData.targetScale = 1.35;
          hit.userData.hovered = true;
          stage.style.cursor = 'pointer';
        } else {
          stage.style.cursor = 'grab';
        }
        hoveredMesh = hit;
      }
    });

    renderer.domElement.addEventListener('click', (e) => {
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planes);
      if (hits.length) {
        openViewer(ctx, hits[0].object.userData.src);
      }
    });

    let sectionVisible = true;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sectionVisible = entry.isIntersecting;
        videoEls.forEach((v) => {
          if (sectionVisible) v.play().catch(() => {});
          else v.pause();
        });
      });
    }, { threshold: 0.1 });
    io.observe(stage);

    let clock = 0;
    function animate() {
      requestAnimationFrame(animate);
      if (!sectionVisible) return;
      clock += 0.016;

      planes.forEach((mesh) => {
        const breathe = reduceMotion || mesh.userData.hovered
          ? 1
          : 1 + Math.sin(clock * mesh.userData.bobSpeed + mesh.userData.phase) * 0.035;
        const s = mesh.userData.targetScale * breathe;
        const current = mesh.scale.x;
        const next = current + (s - current) * 0.12;
        mesh.scale.setScalar(next);

        const bob = reduceMotion ? 0 : Math.sin(clock * mesh.userData.bobSpeed * 0.6 + mesh.userData.phase) * 0.06;
        const outward = mesh.userData.hovered ? 0.7 : 0;
        const desiredPos = mesh.userData.dir.clone().multiplyScalar(mesh.userData.baseRadius + outward + bob);
        mesh.position.lerp(desiredPos, 0.12);

        const someoneHovered = !!hoveredMesh;
        const isDimmed = someoneHovered && mesh !== hoveredMesh;
        const targetOpacity = isDimmed ? 0.35 : 0.96;
        mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;

        // Ligero "desenfoque" aproximado: los planos no seleccionados pierden saturación
        // y se oscurecen sutilmente, mientras la pieza activa recibe un cálido resplandor dorado.
        const targetColor = mesh.userData.hovered ? WARM_TINT : (isDimmed ? DIM_TINT : WHITE_TINT);
        mesh.material.color.lerp(targetColor, 0.1);

        const targetEmissive = mesh.userData.hovered ? GLOW_EMISSIVE : NO_EMISSIVE;
        mesh.material.emissive.lerp(targetEmissive, 0.1);
      });

      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  function init() {
    const stage = document.getElementById('sphereStage');
    const canvas = document.getElementById('sphereCanvas');
    if (!stage || !canvas) return;

    const ctx = {
      stage, canvas,
      hint: document.getElementById('sphereHint'),
      loading: document.getElementById('sphereLoading'),
      viewer: document.getElementById('sphereViewer'),
      viewerImg: document.getElementById('sphereViewerImg'),
      viewerVideo: document.getElementById('sphereViewerVideo'),
      viewerClose: document.getElementById('sphereViewerClose')
    };

    ctx.viewerClose.addEventListener('click', () => closeViewer(ctx));
    ctx.viewer.addEventListener('click', (e) => { if (e.target === ctx.viewer) closeViewer(ctx); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(ctx); });

    // En escritorio, la esfera 3D de siempre, sin tocar nada. En móvil,
    // una versión ligera con CSS — el motor WebGL (three.js) ni se llega
    // a descargar ahí, porque initWebglSphere nunca se llama.
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      initCssSphere(ctx);
    } else {
      initWebglSphere(ctx);
    }
  }

  // La esfera pesa mucho (WebGL + ~170 texturas): antes se montaba nada más
  // cargar la página aunque el usuario nunca llegara a esa sección, compitiendo
  // por memoria con el resto de la home justo en el arranque (causa probable
  // de cierres en móvil). Ahora se retrasa hasta que la sección está a punto
  // de entrar en pantalla.
  function boot() {
    const stage = document.getElementById('sphereStage');
    if (!stage) return;
    if (!('IntersectionObserver' in window)) { init(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        init();
      });
    }, { rootMargin: '800px 0px' });
    io.observe(stage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
