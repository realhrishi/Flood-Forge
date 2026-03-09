import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const BOOT_LINES = [
  '> Initializing FloodForge AI System...',
  '> Connecting to Climate Monitoring Network...',
  '> Analyzing Rainfall Systems across India...',
  '> Loading XGBoost Flood Prediction Model... [████████████] 100%',
  '> Satellite link established. 847 cities online.',
  '> TARGET REGION IDENTIFIED: INDIA ✓',
  '> Launching Flood Intelligence Interface...',
];

// India: 20°N, 78°E
//
// Three.js SphereGeometry UV mapping:
//   vertex.x = -R * cos(u*2π) * sin(v*π)
//   vertex.y =  R * cos(v*π)
//   vertex.z =  R * sin(u*2π) * sin(v*π)
// where u = (lng + 180) / 360,  v = (90 - lat) / 180
//
// At rotation.y = 0, the camera (+Z) faces u=0.25 → lng = -90° (Americas).
// To bring longitude L to face +Z, the required rotation.y is:
//   θ = π/2 − u*2π  = π/2 − (L+180)/180 * π
//
const INDIA_LNG = 78;
const INDIA_LAT = 20;
const INDIA_U   = (INDIA_LNG + 180) / 360;          // 0.7167
const INDIA_V   = (90 - INDIA_LAT) / 180;           // 0.3889
const INDIA_TARGET_ROTATION_Y = Math.PI / 2 - INDIA_U * 2 * Math.PI; // ≈ -2.932

// CDN textures (CORS-enabled via jsDelivr)
const EARTH_DAY_TEX   = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_NIGHT_TEX = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg';
const EARTH_CLOUD_TEX = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-clouds.png';

export default function IntroAnimation() {
  const mountRef  = useRef(null);
  const [phase, setPhase]               = useState('terminal');
  const [lines, setLines]               = useState([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [lineIndex, setLineIndex]       = useState(0);
  const [charIndex, setCharIndex]       = useState(0);

  // ── PHASE 1: Terminal typing ────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'terminal') return;
    if (lineIndex >= BOOT_LINES.length) {
      setTimeout(() => setPhase('globe'), 700);
      return;
    }
    const line = BOOT_LINES[lineIndex];
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setCurrentTyping(line.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 18);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines(prev => [...prev, line]);
        setCurrentTyping('');
        setCharIndex(0);
        setLineIndex(i => i + 1);
      }, 160);
      return () => clearTimeout(t);
    }
  }, [phase, lineIndex, charIndex]);

  // ── PHASE 2: Three.js Globe ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'globe') return;
    let rafId;
    // Wait one paint cycle so the mountRef div is in the DOM
    rafId = requestAnimationFrame(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020510);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);
    const cameraTarget = new THREE.Vector3(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    container.appendChild(renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x112244, 1.2));

    const sun = new THREE.DirectionalLight(0xffeedd, 2.4);
    sun.position.set(8, 3, 6);
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0x0055cc, 0.6);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // ── Stars ──────────────────────────────────────────────────────────
    const starPositions = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000 * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 300;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    // Two layers of stars for depth
    const starsMat1 = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.85 });
    const starsMat2 = new THREE.PointsMaterial({ color: 0x88bbff, size: 0.06, sizeAttenuation: true, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(starGeo, starsMat1));
    scene.add(new THREE.Points(starGeo, starsMat2));

    // ── Load textures ──────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // ── Earth ──────────────────────────────────────────────────────────
    const earthGeo = new THREE.SphereGeometry(2, 128, 128);
    const earthMat = new THREE.MeshPhongMaterial({
      specular: new THREE.Color(0x111133),
      shininess: 18,
    });

    // Load day texture; display a placeholder colour until loaded
    earthMat.color = new THREE.Color(0x0a2244);
    loader.load(EARTH_DAY_TEX, tex => {
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMat.map = tex;
      earthMat.color = new THREE.Color(0xffffff);
      earthMat.needsUpdate = true;
    });

    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // ── Clouds ─────────────────────────────────────────────────────────
    const cloudGeo = new THREE.SphereGeometry(2.025, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    loader.load(EARTH_CLOUD_TEX, tex => {
      cloudMat.alphaMap = tex;
      cloudMat.color    = new THREE.Color(0xffffff);
      cloudMat.opacity  = 0.35;
      cloudMat.needsUpdate = true;
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    // ── Atmosphere glow (Fresnel shader) ───────────────────────────────
    const atmGeo = new THREE.SphereGeometry(2.18, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(0.05, 0.45, 1.0, 1.0) * intensity;
        }
      `,
      side:        THREE.FrontSide,
      blending:    THREE.AdditiveBlending,
      transparent: true,
      depthWrite:  false,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atmosphere);

    // Outer atmospheric haze (larger, softer)
    const hazeGeo = new THREE.SphereGeometry(2.38, 64, 64);
    const hazeMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float i = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(0.02, 0.2, 0.8, 1.0) * i * 0.4;
        }
      `,
      side:        THREE.BackSide,
      blending:    THREE.AdditiveBlending,
      transparent: true,
      depthWrite:  false,
    });
    scene.add(new THREE.Mesh(hazeGeo, hazeMat));

    // ── India dot + pulse rings ────────────────────────────────────────
    // Use the EXACT same formula Three.js SphereGeometry uses for vertices,
    // so the dot sits precisely on the India region of the texture.
    const R    = 2.04;
    const phi  = INDIA_U * 2 * Math.PI;   // azimuthal angle
    const tht  = INDIA_V * Math.PI;       // polar angle
    const indiaX = -R * Math.cos(phi) * Math.sin(tht);  //  ≈  0.197 R
    const indiaY =  R * Math.cos(tht);                   //  ≈  0.342 R
    const indiaZ =  R * Math.sin(phi) * Math.sin(tht);  //  ≈ -0.919 R

    const dotGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const indiaDot = new THREE.Mesh(dotGeo, dotMat);
    indiaDot.position.set(indiaX, indiaY, indiaZ);
    indiaDot.visible = false;
    earth.add(indiaDot); // attach to earth so it rotates with it

    // Pulse rings (3, offset in time)
    const RING_COUNT = 3;
    const ringMeshes = [];
    const ringMats   = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const rGeo = new THREE.RingGeometry(0.06, 0.10, 64);
      const rMat = new THREE.MeshBasicMaterial({
        color:       0xff2222,
        transparent: true,
        opacity:     0,
        side:        THREE.DoubleSide,
        depthWrite:  false,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.set(indiaX, indiaY, indiaZ);
      rMesh.lookAt(new THREE.Vector3(0, 0, 0)); // face outward from globe
      earth.add(rMesh);
      ringMeshes.push(rMesh);
      ringMats.push(rMat);
    }

    // ── India label (HTML overlay) ─────────────────────────────────────
    const labelEl = document.createElement('div');
    labelEl.innerText = '▶ INDIA';
    Object.assign(labelEl.style, {
      position:   'absolute',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize:   '11px',
      color:      '#ff4444',
      letterSpacing: '2px',
      opacity:    '0',
      pointerEvents: 'none',
      textShadow: '0 0 12px rgba(255,50,50,0.8)',
      transition: 'opacity 0.5s',
      whiteSpace: 'nowrap',
    });
    container.appendChild(labelEl);

    // ── Resize handler ─────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animate loop ───────────────────────────────────────────────────
    let animId;
    let showRings    = false;
    let ringsStarted = false;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Clouds drift independently
      clouds.rotation.y = earth.rotation.y + t * 0.0006;

      // Pulsing rings (expand outward and fade)
      if (showRings) {
        if (!ringsStarted) ringsStarted = true;
        ringMeshes.forEach((mesh, i) => {
          const cycle = (t * 0.7 + i * (1 / RING_COUNT)) % 1;
          mesh.scale.setScalar(1 + cycle * 3.5);
          ringMats[i].opacity = Math.max(0, (1 - cycle) * 0.85);
        });
      }

      // Project India world position to screen for label
      if (showRings && indiaDot.visible) {
        const indiaWorld = new THREE.Vector3();
        indiaDot.getWorldPosition(indiaWorld);
        const indiaProj = indiaWorld.clone().project(camera);
        const lx = (indiaProj.x * 0.5 + 0.5) * window.innerWidth;
        const ly = (-indiaProj.y * 0.5 + 0.5) * window.innerHeight;
        labelEl.style.left    = `${lx + 28}px`;
        labelEl.style.top     = `${ly - 6}px`;
        labelEl.style.opacity = indiaProj.z < 1 ? '1' : '0';
      }

      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);
    };
    animate();

    // ── GSAP sequence ──────────────────────────────────────────────────
    // Total spin: N full rotations + land on INDIA_TARGET_ROTATION_Y
    const EXTRA_SPINS = 3;
    const spinTarget  = -(EXTRA_SPINS * 2 * Math.PI) + INDIA_TARGET_ROTATION_Y;

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Fade in
    tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out' });

    // 2. Spin globe (fast → decelerate to India)
    tl.to(earth.rotation, {
      y:        spinTarget,
      duration: 5.5,
      ease:     'power3.inOut',
    }, '+=0.2');

    // 3. Show India marker
    tl.call(() => {
      indiaDot.visible = true;
      showRings = true;
    });

    // 4. Zoom camera toward India
    //    After rotation, India is at world-space (0, indiaY, R) since lng rotated to front
    const finalY = R * Math.sin(INDIA_LAT * Math.PI / 180) * 0.5;
    tl.to(camera.position, {
      x: 0,
      y: finalY,
      z: 3.6,
      duration: 1.6,
      ease: 'power2.inOut',
    }, '+=0.6');
    tl.to(cameraTarget, {
      y: finalY * 0.4,
      duration: 1.6,
      ease: 'power2.inOut',
    }, '<');

    // 5. Final push zoom
    tl.to(camera.position, {
      z: 1.6,
      duration: 1.1,
      ease: 'power3.in',
    }, '+=0.2');

    // 6. Bright white flash then fade out
    tl.to(container, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.in',
      onComplete: () => {
        localStorage.setItem('ff_intro_seen', 'true');
        cancelAnimationFrame(animId);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        if (container.contains(labelEl)) container.removeChild(labelEl);
        setPhase('done');
      },
    }, '+=0.25');

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(labelEl)) container.removeChild(labelEl);
    };
    }); // end RAF
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      zIndex:         9999,
      background:     '#020510',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
    }}>

      {/* ── Terminal ── */}
      {phase === 'terminal' && (
        <div style={{ width: '100%', maxWidth: 740, padding: '0 40px' }}>
          {/* Scanline overlay */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,245,212,0.012) 3px, rgba(0,245,212,0.012) 4px)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position:      'relative',
            fontFamily:    "'JetBrains Mono', 'Courier New', monospace",
            fontSize:      13.5,
            lineHeight:    '28px',
            color:         '#2dd4bf',
            padding:       '24px 28px',
            border:        '1px solid rgba(45,212,191,0.18)',
            borderRadius:  4,
            background:    'rgba(0,10,30,0.7)',
            backdropFilter: 'blur(4px)',
            boxShadow:     '0 0 40px rgba(0,198,255,0.08), inset 0 0 40px rgba(0,0,0,0.4)',
          }}>
            {/* Header bar */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           6,
              marginBottom:  18,
              paddingBottom: 12,
              borderBottom:  '1px solid rgba(45,212,191,0.15)',
            }}>
              {[0xff5f57, 0xffbd2e, 0x28c840].map((c, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: `#${c.toString(16).padStart(6, '0')}`,
                  opacity: 0.7,
                }} />
              ))}
              <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.4, letterSpacing: 2 }}>
                FLOODFORGE — TERMINAL v1.0
              </span>
            </div>

            {lines.map((line, i) => (
              <div key={i} style={{
                opacity:     0.5,
                marginBottom: 2,
                color:       i === lines.length - 1 ? '#00F5D4' : '#2dd4bf',
              }}>
                {line}
              </div>
            ))}

            {lineIndex < BOOT_LINES.length && (
              <div style={{ color: '#00F5D4', display: 'flex', alignItems: 'center' }}>
                <span>{currentTyping}</span>
                <span style={{ animation: 'blink 0.8s step-end infinite', marginLeft: 1 }}>█</span>
              </div>
            )}
          </div>

          <style>{`
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          `}</style>
        </div>
      )}

      {/* ── Globe ── */}
      {phase === 'globe' && (
        <>
          <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

          {/* Scanlines */}
          <div style={{
            position:      'absolute',
            inset:         0,
            background:    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,100,255,0.012) 3px, rgba(0,100,255,0.012) 4px)',
            pointerEvents: 'none',
            zIndex:        1,
          }} />

          {/* Vignette */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,5,16,0.75) 100%)',
            pointerEvents: 'none',
            zIndex:     1,
          }} />

          {/* Logo */}
          <div style={{
            position:   'absolute',
            bottom:     88,
            left:       '50%',
            transform:  'translateX(-50%)',
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            fontSize:   30,
            fontWeight: 800,
            letterSpacing: 6,
            color:      '#2dd4bf',
            textShadow: '0 0 25px rgba(0,210,255,0.7), 0 0 60px rgba(0,100,255,0.3)',
            zIndex:     2,
            whiteSpace: 'nowrap',
          }}>
            FLOODFORGE
          </div>

          <div style={{
            position:      'absolute',
            bottom:        58,
            left:          '50%',
            transform:     'translateX(-50%)',
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      11,
            color:         '#00F5D4',
            letterSpacing: 3,
            opacity:       0.65,
            zIndex:        2,
            whiteSpace:    'nowrap',
          }}>
            TARGETING: INDIA
          </div>
        </>
      )}
    </div>
  );
}