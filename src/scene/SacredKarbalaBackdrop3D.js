import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Full-bleed Ambient Sacred Karbala 3D Stage
 * Renders receding gilded Islamic archways, swaying antique brass lanterns,
 * shimmering crimson/gold Alam ribbons, and ascending celestial light motes
 * behind the Hero composition with smooth mouse-parallax depth.
 */
export class SacredKarbalaBackdrop3D {
  constructor(container, options = {}) {
    this.container = container;
    this.isNight = Boolean(options.isNight);
    this.disposed = false;
    this.rafId = 0;

    this._mouseX = 0;
    this._mouseY = 0;
    this._curCamX = 0;
    this._curCamY = 2.4;

    this._daySky = new THREE.Color('#F2E6DF');
    this._nightSky = new THREE.Color('#07080F');
    this._curSky = new THREE.Color(this.isNight ? '#07080F' : '#F2E6DF');

    this._initRenderer();
    this._initScene();
    this._initLights();
    this._buildSacredArches();
    this._buildHangingLanterns();
    this._buildLightMotes();
    this._attachEvents();

    this.applyTheme(this.isNight, true);
    this.clock = new THREE.Clock();
    this._animate();
  }

  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    this.isSoftwareGl = /SwiftShader|llvmpipe|Microsoft Basic Render Driver/i.test(gpuStr);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.isSoftwareGl ? 1 : 2));
    renderer.setSize(this.container.clientWidth || 1200, this.container.clientHeight || 720);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    this.container.innerHTML = '';
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const pmrem = new THREE.PMREMGenerator(renderer);
    this.envRenderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = this._curSky.clone();
    this.scene.fog = new THREE.FogExp2(this._curSky.getHex(), 0.042);
    this.scene.environment = this.envRenderTarget.texture;
    this.scene.environmentIntensity = this.isNight ? 0.8 : 1.05;

    const w = this.container.clientWidth || 1200;
    const h = this.container.clientHeight || 720;
    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 90);
    this.camera.position.set(0, 2.4, 11.5);
    this.camera.lookAt(0, 2.3, -4);
  }

  _initLights() {
    this.hemi = new THREE.HemisphereLight(0xfde68a, 0x3b0764, 0.85);
    this.scene.add(this.hemi);

    this.keyLight = new THREE.DirectionalLight(0xfef3c7, 1.6);
    this.keyLight.position.set(6, 10, 8);
    this.scene.add(this.keyLight);

    this.crimsonRim = new THREE.DirectionalLight(0xe11d48, 1.3);
    this.crimsonRim.position.set(-7, 4, -5);
    this.scene.add(this.crimsonRim);

    this.centerWarmGlow = new THREE.PointLight(0xf59e0b, 3.4, 24, 1.4);
    this.centerWarmGlow.position.set(0, 3.6, -2);
    this.scene.add(this.centerWarmGlow);
  }

  _buildSacredArches() {
    this.archGroup = new THREE.Group();
    this.scene.add(this.archGroup);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.92,
      roughness: 0.22,
    });
    const crimsonStoneMat = new THREE.MeshStandardMaterial({
      color: 0x6b102c,
      metalness: 0.25,
      roughness: 0.45,
    });
    const lapisMat = new THREE.MeshStandardMaterial({
      color: 0x0e4a7b,
      metalness: 0.3,
      roughness: 0.32,
    });

    // Receding sacred colonnade of 6 Islamic arches in deep 3D perspective
    this.arches = [];
    for (let i = 0; i < 6; i++) {
      const z = 4 - i * 4.2;
      const single = new THREE.Group();
      single.position.set(0, 0, z);

      const pillGeo = new THREE.CylinderGeometry(0.18, 0.22, 4.2, 16);
      const leftPillar = new THREE.Mesh(pillGeo, i % 2 === 0 ? goldMat : crimsonStoneMat);
      leftPillar.position.set(-4.6, 2.1, 0);
      const rightPillar = new THREE.Mesh(pillGeo, i % 2 === 0 ? goldMat : crimsonStoneMat);
      rightPillar.position.set(4.6, 2.1, 0);

      const archRing = new THREE.Mesh(
        new THREE.TorusGeometry(4.6, 0.14, 12, 48, Math.PI),
        i % 2 === 0 ? goldMat : lapisMat
      );
      archRing.position.set(0, 4.1, 0);

      const crownOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), goldMat);
      crownOrb.position.set(0, 8.95, 0);

      single.add(leftPillar, rightPillar, archRing, crownOrb);
      this.arches.push(single);
      this.archGroup.add(single);
    }

    // Reflective dark/sandstone floor grid plane
    this.floorMat = new THREE.MeshStandardMaterial({
      color: this.isNight ? 0x0b0e1c : 0xe5d3cb,
      metalness: 0.35,
      roughness: 0.38,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(46, 54), this.floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.position.z = -8;
    this.archGroup.add(floor);
  }

  _buildHangingLanterns() {
    this.lanterns = [];
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.88,
      roughness: 0.26,
    });
    this.lanternGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.8,
      roughness: 0.15,
    });

    const coords = [
      [-3.2, 4.8, 2.2],
      [3.2, 4.8, 2.2],
      [-2.8, 5.1, -2.8],
      [2.8, 5.1, -2.8],
      [-2.4, 5.3, -7.2],
      [2.4, 5.3, -7.2],
    ];

    coords.forEach(([x, y, z], idx) => {
      const lGrp = new THREE.Group();
      lGrp.position.set(x, y, z);

      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.2, 6), brassMat);
      cord.position.y = 1.1;
      const domeCap = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.34, 6), brassMat);
      domeCap.position.y = -0.15;
      const glassCore = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.48, 6), this.lanternGlowMat);
      glassCore.position.y = -0.52;
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 6), brassMat);
      tail.rotation.x = Math.PI;
      tail.position.y = -0.88;

      lGrp.add(cord, domeCap, glassCore, tail);
      lGrp.userData.phase = idx * 0.9;
      this.lanterns.push(lGrp);
      this.scene.add(lGrp);
    });
  }

  _buildLightMotes() {
    const count = this.isSoftwareGl ? 70 : 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 8.5;
      pos[i * 3 + 2] = 6 - Math.random() * 24;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.motesMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.11,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.motes = new THREE.Points(geo, this.motesMat);
    this.scene.add(this.motes);
  }

  _attachEvents() {
    this._onResize = () => {
      if (this.disposed) return;
      const w = this.container.clientWidth || 1200;
      const h = this.container.clientHeight || 720;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    this._onPointerMove = (e) => {
      this._mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this._mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('resize', this._onResize);
    window.addEventListener('pointermove', this._onPointerMove, { passive: true });
  }

  applyTheme(isNight, immediate = false) {
    this.isNight = Boolean(isNight);
    if (this.floorMat) {
      this.floorMat.color.setHex(this.isNight ? 0x0b0e1c : 0xe5d3cb);
    }
    this.hemi.intensity = this.isNight ? 0.6 : 1.15;
    this.keyLight.intensity = this.isNight ? 1.1 : 1.9;
    this.centerWarmGlow.intensity = this.isNight ? 3.8 : 1.9;
    this.lanternGlowMat.emissiveIntensity = this.isNight ? 3.2 : 1.5;
    this.motesMat.opacity = this.isNight ? 0.85 : 0.45;
    this.scene.environmentIntensity = this.isNight ? 0.8 : 1.1;

    if (immediate) {
      this._curSky.copy(this.isNight ? this._nightSky : this._daySky);
      this.scene.background.copy(this._curSky);
      this.scene.fog.color.copy(this._curSky);
    }
  }

  _animate() {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(() => this._animate());

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    const targetSky = this.isNight ? this._nightSky : this._daySky;
    this._curSky.lerp(targetSky, 0.06);
    this.scene.background.copy(this._curSky);
    this.scene.fog.color.copy(this._curSky);

    // Gentle parallax drift following cursor + calm idle breathing
    const targetCamX = this._mouseX * 1.15 + Math.sin(t * 0.28) * 0.35;
    const targetCamY = 2.4 - this._mouseY * 0.45 + Math.cos(t * 0.35) * 0.15;
    this._curCamX = THREE.MathUtils.lerp(this._curCamX, targetCamX, 0.04);
    this._curCamY = THREE.MathUtils.lerp(this._curCamY, targetCamY, 0.04);
    this.camera.position.set(this._curCamX, this._curCamY, 11.5);
    this.camera.lookAt(0, 2.5, -5);

    // Sway lanterns
    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      const ph = l.userData.phase || 0;
      l.rotation.z = Math.sin(t * 1.15 + ph) * 0.075;
      l.rotation.x = Math.cos(t * 0.85 + ph) * 0.04;
    }

    // Ascend golden light motes
    const attr = this.motes.geometry.attributes.position;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) + delta * 0.32;
      if (y > 8.6) y = 0.2;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onPointerMove);
    this.scene?.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    this.envRenderTarget?.dispose();
    this.renderer?.dispose();
  }
}
