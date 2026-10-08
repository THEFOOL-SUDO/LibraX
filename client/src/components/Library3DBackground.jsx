import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const Library3DBackground = () => {
  const containerRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(darkMode ? 0x1e293b : 0xf1f5f9, darkMode ? 1.5 : 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, darkMode ? 2.0 : 2.5);
    dirLight.position.set(10, 15, 12);
    scene.add(dirLight);

    // Glowing accent point lights
    const blueLight = new THREE.PointLight(0x38bdf8, darkMode ? 3.5 : 2.0, 30);
    blueLight.position.set(-8, 6, 4);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf59e0b, darkMode ? 3.0 : 2.2, 30);
    goldLight.position.set(8, -5, 5);
    scene.add(goldLight);

    const purpleLight = new THREE.PointLight(0xa855f7, darkMode ? 2.5 : 1.5, 25);
    purpleLight.position.set(0, 8, -4);
    scene.add(purpleLight);

    // Helper: Create 3D Hardcover Book Mesh
    const bookColors = [
      0x1e3a8a, // Midnight Blue
      0x831843, // Burgundy
      0x065f46, // Deep Emerald
      0x78350f, // Rich Leather Amber
      0x4c1d95, // Royal Violet
      0x0f172a, // Obsidian Gold
      0xd97706  // Antique Ochre
    ];

    const createBookMesh = (color, scale = 1, isOpen = false) => {
      const bookGroup = new THREE.Group();

      if (!isOpen) {
        // Closed Hardcover Book
        const width = 2.0 * scale;
        const height = 2.8 * scale;
        const thickness = 0.45 * scale;

        // Front Cover
        const coverMaterial = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.25,
        });

        const coverGeo = new THREE.BoxGeometry(width, height, 0.04 * scale);
        const frontCover = new THREE.Mesh(coverGeo, coverMaterial);
        frontCover.position.z = thickness / 2;
        bookGroup.add(frontCover);

        // Back Cover
        const backCover = new THREE.Mesh(coverGeo, coverMaterial);
        backCover.position.z = -thickness / 2;
        bookGroup.add(backCover);

        // Spine
        const spineGeo = new THREE.BoxGeometry(0.04 * scale, height, thickness);
        const spine = new THREE.Mesh(spineGeo, coverMaterial);
        spine.position.x = -width / 2;
        bookGroup.add(spine);

        // Pages Block (Ivory/Ribbed tone)
        const pagesGeo = new THREE.BoxGeometry(width - 0.08 * scale, height - 0.12 * scale, thickness - 0.06 * scale);
        const pagesMaterial = new THREE.MeshStandardMaterial({
          color: 0xfef3c7,
          roughness: 0.85,
          metalness: 0.05
        });
        const pagesBlock = new THREE.Mesh(pagesGeo, pagesMaterial);
        pagesBlock.position.x = 0.03 * scale;
        bookGroup.add(pagesBlock);

        // Golden Spine Embossing Lines
        const goldBandMaterial = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          roughness: 0.2,
          metalness: 0.8
        });
        for (let i = -1; i <= 1; i++) {
          const bandGeo = new THREE.BoxGeometry(0.045 * scale, 0.05 * scale, thickness + 0.01 * scale);
          const band = new THREE.Mesh(bandGeo, goldBandMaterial);
          band.position.set(-width / 2, i * 0.7 * scale, 0);
          bookGroup.add(band);
        }
      } else {
        // Open Spread Book (Wings / Fluttering Pages)
        const wingWidth = 1.3 * scale;
        const wingHeight = 2.5 * scale;

        const openPageMaterial = new THREE.MeshStandardMaterial({
          color: 0xfffbeb,
          roughness: 0.75,
          side: THREE.DoubleSide
        });

        const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(wingWidth, wingHeight), openPageMaterial);
        leftWing.position.x = -wingWidth / 2;
        leftWing.rotation.y = Math.PI / 7;
        bookGroup.add(leftWing);

        const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(wingWidth, wingHeight), openPageMaterial);
        rightWing.position.x = wingWidth / 2;
        rightWing.rotation.y = -Math.PI / 7;
        bookGroup.add(rightWing);

        // Spine Center
        const centerCover = new THREE.Mesh(
          new THREE.BoxGeometry(0.12 * scale, wingHeight, 0.1 * scale),
          new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.3 })
        );
        bookGroup.add(centerCover);
      }

      return bookGroup;
    };

    // Instantiate 14 floating 3D Books at varying depth layers
    const books = [];
    const bookCount = 14;

    for (let i = 0; i < bookCount; i++) {
      const color = bookColors[i % bookColors.length];
      const isOpen = i === 3 || i === 8;
      const scale = 0.65 + Math.random() * 0.45;
      const bookMesh = createBookMesh(color, scale, isOpen);

      // Distribute in a 3D field around screen
      const angle = (i / bookCount) * Math.PI * 2;
      const radius = 7.5 + (Math.random() - 0.5) * 5;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 4;
      const y = Math.sin(angle) * (radius * 0.65) + (Math.random() - 0.5) * 3;
      const z = -6 + Math.random() * 10;

      bookMesh.position.set(x, y, z);
      bookMesh.rotation.set(
        (Math.random() - 0.5) * Math.PI,
        (Math.random() - 0.5) * Math.PI,
        (Math.random() - 0.5) * Math.PI
      );

      scene.add(bookMesh);

      books.push({
        mesh: bookMesh,
        baseY: y,
        baseX: x,
        baseZ: z,
        rotSpeedX: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        rotSpeedY: (Math.random() * 0.010 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        rotSpeedZ: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        floatSpeed: Math.random() * 0.0015 + 0.001,
        floatOffset: Math.random() * Math.PI * 2,
        floatAmp: 0.6 + Math.random() * 0.6
      });
    }

    // Floating Stardust / Knowledge Nebula Particles
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(darkMode ? 0x38bdf8 : 0x0284c7); // Cyan
    const c2 = new THREE.Color(darkMode ? 0xfbbf24 : 0xd97706); // Gold
    const c3 = new THREE.Color(darkMode ? 0xc084fc : 0x7c3aed); // Purple

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const randColor = Math.random();
      const choiceColor = randColor < 0.45 ? c1 : randColor < 0.8 ? c2 : c3;
      particleColors[i * 3] = choiceColor.r;
      particleColors[i * 3 + 1] = choiceColor.g;
      particleColors[i * 3 + 2] = choiceColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: darkMode ? 0.75 : 0.55,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking for Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.5;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX * 1.5;
      camera.position.y = -currentMouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Orbit point lights for dynamic illumination highlights
      blueLight.position.x = Math.sin(elapsedTime * 0.4) * 10;
      blueLight.position.y = Math.cos(elapsedTime * 0.3) * 8;
      goldLight.position.x = -Math.cos(elapsedTime * 0.35) * 10;
      goldLight.position.y = -Math.sin(elapsedTime * 0.25) * 8;

      // Animate Books
      books.forEach((b) => {
        b.mesh.rotation.x += b.rotSpeedX;
        b.mesh.rotation.y += b.rotSpeedY;
        b.mesh.rotation.z += b.rotSpeedZ;

        b.mesh.position.y = b.baseY + Math.sin(elapsedTime * 1.2 + b.floatOffset) * b.floatAmp;
        b.mesh.position.x = b.baseX + Math.cos(elapsedTime * 0.8 + b.floatOffset) * (b.floatAmp * 0.5);
      });

      // Animate particles swirl
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [darkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-1000"
      style={{
        background: darkMode
          ? 'radial-gradient(ellipse at 50% 20%, rgba(15, 23, 42, 0.75) 0%, rgba(3, 7, 18, 0.95) 100%)'
          : 'radial-gradient(ellipse at 50% 20%, rgba(248, 250, 252, 0.75) 0%, rgba(241, 245, 249, 0.95) 100%)'
      }}
    />
  );
};

export default Library3DBackground;
