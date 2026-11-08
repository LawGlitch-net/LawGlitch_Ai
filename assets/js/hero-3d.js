/**
 * LawGlitch — Cinematic 3D Hero Scene
 * Procedural Three.js scene with orbital particle field, floating browser shell,
 * energy beams, holographic grid, and parallax camera for immersive depth.
 * Zero external 3D assets. Designed for visual impact and low GPU overhead.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  const container = document.getElementById('three-hero-mount');
  if (!container) return;

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    return;
  }

  let scene, camera, renderer;
  let animationFrameId = null;
  let isVisible = true;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Scene objects
  let particleSystem, orbitalRing, energyBeams = [];
  let floatingNodes = [], connectionLines = [];
  let browserShell, browserGlow;
  let gridPlane;
  let clock;

  function init() {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060910, 0.08);

    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0, 1.5, 12);
    camera.lookAt(0, 0, 0);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 2,
        alpha: true,
        powerPreference: 'low-power'
      });
    } catch (err) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.classList.add('hero-3d-canvas');
    container.appendChild(canvas);

    // === Lighting: Cinematic 3-point + volumetric accents ===
    const ambientLight = new THREE.AmbientLight(0x0a0f1e, 0.8);
    scene.add(ambientLight);

    // Key light — warm white from top-right
    const keyLight = new THREE.DirectionalLight(0xe8ecf5, 0.6);
    keyLight.position.set(8, 10, 6);
    scene.add(keyLight);

    // Indigo accent — strong, creates the brand glow
    const indigoSpot = new THREE.PointLight(0x6366f1, 4, 25);
    indigoSpot.position.set(3, 3, 5);
    scene.add(indigoSpot);

    // Cyan rim — opposite side for depth
    const cyanRim = new THREE.PointLight(0x06b6d4, 3, 20);
    cyanRim.position.set(-5, -1, 4);
    scene.add(cyanRim);

    // Warm amber accent from below
    const amberAccent = new THREE.PointLight(0xf59e0b, 1.5, 12);
    amberAccent.position.set(0, -4, 2);
    scene.add(amberAccent);

    // === 1. Orbital Particle Field ===
    createParticleField();

    // === 2. Holographic Grid Floor ===
    createHolographicGrid();

    // === 3. Floating Browser Shell ===
    createBrowserShell();

    // === 4. Floating Interconnected Nodes ===
    createFloatingNodes();

    // === 5. Orbital Ring ===
    createOrbitalRing();

    // === 6. Energy Beams ===
    createEnergyBeams();

    // Mouse parallax
    window.addEventListener('mousemove', function (e) {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.4;
      targetMouseY = y * 0.25;
    }, { passive: true });

    window.addEventListener('resize', onResize, { passive: true });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId && !prefersReducedMotion.matches) {
            clock.getDelta(); // reset delta
            animate();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    renderer.render(scene, camera);

    if (!prefersReducedMotion.matches) {
      animate();
    }
  }

  // ─────────────────────────────────────────────────
  // Particle Field: Dense starfield-like background
  // ─────────────────────────────────────────────────
  function createParticleField() {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const indigoColor = new THREE.Color(0x6366f1);
    const cyanColor = new THREE.Color(0x06b6d4);
    const whiteColor = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a large sphere
      const radius = 5 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Color distribution
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.35) color = indigoColor;
      else if (colorChoice < 0.55) color = cyanColor;
      else color = whiteColor;

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.8 + Math.random() * 2.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  // ─────────────────────────────────────────────────
  // Holographic grid floor with fade
  // ─────────────────────────────────────────────────
  function createHolographicGrid() {
    const gridGeo = new THREE.PlaneGeometry(40, 40, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    gridPlane = new THREE.Mesh(gridGeo, gridMat);
    gridPlane.rotation.x = -Math.PI / 2;
    gridPlane.position.y = -3.5;
    scene.add(gridPlane);
  }

  // ─────────────────────────────────────────────────
  // Floating Browser Shell — translucent hologram
  // ─────────────────────────────────────────────────
  function createBrowserShell() {
    const group = new THREE.Group();

    // Main browser body
    const bodyGeo = new THREE.BoxGeometry(5, 3, 0.08);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.45
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Glowing edge frame
    const edges = new THREE.EdgesGeometry(bodyGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMat);
    group.add(edgeLines);

    // Title bar
    const barGeo = new THREE.BoxGeometry(5, 0.35, 0.09);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.65
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.y = 1.325;
    bar.position.z = 0.01;
    group.add(bar);

    // Window dots (red, yellow, green)
    const dotGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const dotColors = [0xef4444, 0xf59e0b, 0x10b981];
    dotColors.forEach(function (color, i) {
      const dotMat = new THREE.MeshBasicMaterial({ color: color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(-2.15 + i * 0.2, 1.325, 0.06);
      group.add(dot);
    });

    // Content blocks inside browser
    const blockGeo = new THREE.BoxGeometry(1.8, 0.5, 0.01);
    const blockMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.4
    });
    for (let row = 0; row < 3; row++) {
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(-1.2, 0.6 - row * 0.65, 0.05);
      group.add(block);
    }

    // Target highlight (cyan glow)
    const highlightGeo = new THREE.BoxGeometry(1.6, 0.4, 0.02);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.3
    });
    const highlight = new THREE.Mesh(highlightGeo, highlightMat);
    highlight.position.set(-1.2, -0.05, 0.06);
    group.add(highlight);

    // Alfie side panel
    const panelGeo = new THREE.BoxGeometry(1.8, 2.6, 0.06);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.35,
      transparent: true,
      opacity: 0.6
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(1.4, -0.05, 0.2);
    group.add(panel);

    // Panel glow border
    const panelEdges = new THREE.EdgesGeometry(panelGeo);
    const panelEdgeMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.9
    });
    const panelEdgeLines = new THREE.LineSegments(panelEdges, panelEdgeMat);
    panelEdgeLines.position.copy(panel.position);
    group.add(panelEdgeLines);

    // Chat bubbles in panel
    const bubbleGeo = new THREE.BoxGeometry(1.2, 0.25, 0.01);
    const userBubbleMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.5
    });
    const aiBubbleMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.4
    });
    const userBubble = new THREE.Mesh(bubbleGeo, userBubbleMat);
    userBubble.position.set(1.55, 0.65, 0.25);
    group.add(userBubble);

    const aiBubble1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.01), aiBubbleMat);
    aiBubble1.position.set(1.3, 0.25, 0.25);
    group.add(aiBubble1);

    const aiBubble2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.2, 0.01), aiBubbleMat);
    aiBubble2.position.set(1.3, -0.05, 0.25);
    group.add(aiBubble2);

    group.position.set(0, 0.3, 0);
    group.rotation.y = -0.12;
    group.rotation.x = 0.05;

    browserShell = group;
    scene.add(browserShell);

    // Outer glow sphere
    const glowGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    browserGlow = new THREE.Mesh(glowGeo, glowMat);
    browserGlow.position.copy(group.position);
    scene.add(browserGlow);
  }

  // ─────────────────────────────────────────────────
  // Floating Nodes — interconnected data points
  // ─────────────────────────────────────────────────
  function createFloatingNodes() {
    var nodePositions = [
      [-3.5, 2.5, -2],
      [4, 2, -3],
      [-4.5, -1, -1.5],
      [4.5, -2, -2],
      [-2, 3, -4],
      [3, -3, -3],
      [0, 3.5, -5],
      [-5, 0, -4],
      [5, 1, -5],
      [-1, -3, -2]
    ];

    var nodeMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x6366f1 }),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 }),
      new THREE.MeshBasicMaterial({ color: 0x818cf8 }),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 }),
      new THREE.MeshBasicMaterial({ color: 0x6366f1 }),
      new THREE.MeshBasicMaterial({ color: 0x818cf8 }),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 }),
      new THREE.MeshBasicMaterial({ color: 0x6366f1 }),
      new THREE.MeshBasicMaterial({ color: 0x818cf8 }),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    ];

    var nodeGeoOuter = new THREE.SphereGeometry(0.12, 16, 16);
    var nodeGeoInner = new THREE.SphereGeometry(0.06, 12, 12);

    for (var i = 0; i < nodePositions.length; i++) {
      var pos = nodePositions[i];
      // Outer glow sphere
      var outerMat = nodeMaterials[i].clone();
      outerMat.transparent = true;
      outerMat.opacity = 0.25;
      outerMat.blending = THREE.AdditiveBlending;
      var outer = new THREE.Mesh(nodeGeoOuter, outerMat);
      outer.position.set(pos[0], pos[1], pos[2]);
      scene.add(outer);

      // Inner solid core
      var inner = new THREE.Mesh(nodeGeoInner, nodeMaterials[i]);
      inner.position.set(pos[0], pos[1], pos[2]);
      scene.add(inner);

      floatingNodes.push({
        outer: outer,
        inner: inner,
        basePos: new THREE.Vector3(pos[0], pos[1], pos[2]),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        amplitude: 0.15 + Math.random() * 0.25
      });
    }

    // Connect some nodes with thin lines
    var connections = [[0, 1], [1, 3], [2, 5], [0, 4], [4, 6], [6, 8], [7, 2], [3, 8], [5, 9], [9, 7]];
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (var j = 0; j < connections.length; j++) {
      var pair = connections[j];
      var p1 = nodePositions[pair[0]];
      var p2 = nodePositions[pair[1]];
      var lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3(p2[0], p2[1], p2[2])
      ]);
      var line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      connectionLines.push({
        line: line,
        from: pair[0],
        to: pair[1]
      });
    }
  }

  // ─────────────────────────────────────────────────
  // Orbital Ring — slow spinning torus
  // ─────────────────────────────────────────────────
  function createOrbitalRing() {
    var ringGeo = new THREE.TorusGeometry(4.5, 0.015, 8, 120);
    var ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI * 0.4;
    orbitalRing.rotation.z = 0.3;
    orbitalRing.position.set(0, 0.3, -1);
    scene.add(orbitalRing);

    // Second ring — smaller, offset
    var ring2Geo = new THREE.TorusGeometry(3.2, 0.01, 8, 100);
    var ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.55;
    ring2.rotation.z = -0.5;
    ring2.position.set(0, 0.3, -1);
    scene.add(ring2);

    // Store for animation
    orbitalRing._ring2 = ring2;
  }

  // ─────────────────────────────────────────────────
  // Energy Beams — shooting light lines
  // ─────────────────────────────────────────────────
  function createEnergyBeams() {
    for (var i = 0; i < 4; i++) {
      var angle = (i / 4) * Math.PI * 2;
      var startR = 4.5;
      var endR = 0.5;
      var startPos = new THREE.Vector3(
        Math.cos(angle) * startR,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * startR - 1
      );
      var endPos = new THREE.Vector3(
        Math.cos(angle) * endR,
        0.3 + (Math.random() - 0.5),
        Math.sin(angle) * endR
      );

      var beamGeo = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
      var beamMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0x6366f1,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      var beam = new THREE.Line(beamGeo, beamMat);
      scene.add(beam);

      energyBeams.push({
        line: beam,
        phase: i * 1.5,
        duration: 2.5 + Math.random() * 2
      });
    }
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    var width = container.clientWidth || 800;
    var height = container.clientHeight || 500;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  }

  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    var delta = clock.getDelta();
    var time = clock.getElapsedTime();

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // Camera parallax — cinematic slow drift + mouse follow
    camera.position.x = mouseX * 1.5 + Math.sin(time * 0.15) * 0.3;
    camera.position.y = 1.5 + mouseY * 0.8 + Math.cos(time * 0.12) * 0.15;
    camera.lookAt(0, 0.3, 0);

    // Particle rotation — slow cosmic drift
    if (particleSystem) {
      particleSystem.rotation.y = time * 0.02;
      particleSystem.rotation.x = Math.sin(time * 0.05) * 0.05;
    }

    // Browser shell — gentle floating
    if (browserShell) {
      browserShell.position.y = 0.3 + Math.sin(time * 0.5) * 0.08;
      browserShell.rotation.y = -0.12 + Math.sin(time * 0.25) * 0.04 + mouseX * 0.08;
      browserShell.rotation.x = 0.05 + Math.cos(time * 0.3) * 0.02 - mouseY * 0.05;
    }

    // Browser glow pulse
    if (browserGlow) {
      browserGlow.material.opacity = 0.025 + Math.sin(time * 0.8) * 0.015;
      browserGlow.scale.setScalar(1 + Math.sin(time * 0.6) * 0.03);
    }

    // Floating nodes — individual orbits
    for (var i = 0; i < floatingNodes.length; i++) {
      var node = floatingNodes[i];
      var yOffset = Math.sin(time * node.speed + node.phase) * node.amplitude;
      var xOffset = Math.cos(time * node.speed * 0.7 + node.phase) * node.amplitude * 0.5;

      node.outer.position.x = node.basePos.x + xOffset;
      node.outer.position.y = node.basePos.y + yOffset;
      node.inner.position.copy(node.outer.position);

      // Pulse opacity
      node.outer.material.opacity = 0.15 + Math.sin(time * 1.5 + node.phase) * 0.1;
    }

    // Update connection lines to follow nodes
    for (var j = 0; j < connectionLines.length; j++) {
      var conn = connectionLines[j];
      var fromNode = floatingNodes[conn.from];
      var toNode = floatingNodes[conn.to];
      var positions = conn.line.geometry.attributes.position.array;
      positions[0] = fromNode.outer.position.x;
      positions[1] = fromNode.outer.position.y;
      positions[2] = fromNode.outer.position.z;
      positions[3] = toNode.outer.position.x;
      positions[4] = toNode.outer.position.y;
      positions[5] = toNode.outer.position.z;
      conn.line.geometry.attributes.position.needsUpdate = true;
    }

    // Orbital rings rotation
    if (orbitalRing) {
      orbitalRing.rotation.z = 0.3 + time * 0.08;
      if (orbitalRing._ring2) {
        orbitalRing._ring2.rotation.z = -0.5 - time * 0.06;
      }
    }

    // Energy beam pulsing
    for (var k = 0; k < energyBeams.length; k++) {
      var beam = energyBeams[k];
      var cycle = ((time + beam.phase) % beam.duration) / beam.duration;
      // Fade in and out
      if (cycle < 0.15) {
        beam.line.material.opacity = (cycle / 0.15) * 0.35;
      } else if (cycle < 0.4) {
        beam.line.material.opacity = 0.35;
      } else if (cycle < 0.55) {
        beam.line.material.opacity = 0.35 * (1 - (cycle - 0.4) / 0.15);
      } else {
        beam.line.material.opacity = 0;
      }
    }

    // Grid gentle wave
    if (gridPlane) {
      gridPlane.material.opacity = 0.04 + Math.sin(time * 0.4) * 0.02;
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else if (isVisible && !animationFrameId) {
      clock.getDelta();
      animate();
    }
  });

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', function () {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(init);
      } else {
        setTimeout(init, 50);
      }
    });
  }
})();
