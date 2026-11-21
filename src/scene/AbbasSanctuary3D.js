import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function createCalligraphyBandTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.fillStyle = '#073B2D';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ornamental gold top and bottom borders
  ctx.fillStyle = '#D97706';
  ctx.fillRect(0, 0, canvas.width, 16);
  ctx.fillRect(0, canvas.height - 16, canvas.width, 16);

  ctx.fillStyle = '#FCD34D';
  ctx.fillRect(0, 22, canvas.width, 4);
  ctx.fillRect(0, canvas.height - 26, canvas.width, 4);

  // Geometric diamonds across band
  for (let x = 24; x < canvas.width; x += 64) {
    ctx.save();
    ctx.translate(x, canvas.height / 2);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-26, -26, 52, 52);
    ctx.restore();
  }

  // Repeated sacred calligraphy motif text along band
  ctx.fillStyle = '#FDE68A';
  ctx.font = 'bold 42px Amiri, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const motifs = [
    'يا قمر بني هاشم',
    'يا أبا الفضل العباس',
    'يا ساقي عطاشى كربلاء',
    'يا كاشف الكرب',
  ];
  motifs.forEach((txt, i) => {
    ctx.fillText(txt, 128 + i * 256, canvas.height / 2 + 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createMarbleFloorTexture(isNight) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const base = isNight ? '#111A1E' : '#F4EFE4';
  const vein = isNight ? '#1F3138' : '#E5DCC9';
  const gold = '#D97706';
  const turquoise = isNight ? '#0E7490' : '#0F766E';

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 1024);

  // Radial courtyard mosaic tiles
  const cx = 512;
  const cy = 512;
  for (let r = 460; r >= 80; r -= 55) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 110 === 0 ? gold : vein;
    ctx.lineWidth = r % 110 === 0 ? 5 : 2;
    ctx.stroke();
  }

  // 8-pointed star geometry in center
  ctx.strokeStyle = turquoise;
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 110, cy + Math.sin(a) * 110);
    ctx.lineTo(cx + Math.cos(a) * 440, cy + Math.sin(a) * 440);
    ctx.stroke();
  }

  // Subtle tile grid lines
  ctx.strokeStyle = vein;
  ctx.lineWidth = 1.5;
  for (let i = 0; i <= 1024; i += 128) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class AbbasSanctuary3D {
  constructor(container, options = {}) {
    this.container = container;
    this.isNight = Boolean(options.isNight);
    this.isExploded = false;
    this.autoRotate = true;
    this.disposed = false;
    this.rafId = 0;

    // Reusable scratch vectors to ensure zero per-frame allocations
    this._targetCamPos = new THREE.Vector3(8.6, 5.4, 9.6);
    this._targetLookAt = new THREE.Vector3(0, 2.3, 0);
    this._currentLookAt = new THREE.Vector3(0, 2.3, 0);
    this._skyDay = new THREE.Color('#EFE7D6');
    this._skyNight = new THREE.Color('#091014');
    this._curSky = new THREE.Color(this.isNight ? '#091014' : '#EFE7D6');
    this._isTransitioningCam = false;

    this._initRenderer();
    this._initScene();
    this._initLights();
    this._buildSanctuary();
    this._buildParticles();
    this._initControls();
    this._attachEvents();

    this.applyTheme(this.isNight, true);
    this.setCameraPreset('overview', true);
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

    const maxDpr = this.isSoftwareGl ? 1.0 : 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(this.container.clientWidth || 800, this.container.clientHeight || 520);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !this.isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';

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
    this.scene.fog = new THREE.FogExp2(this._curSky.getHex(), 0.022);
    this.scene.environment = this.envRenderTarget.texture;
    this.scene.environmentIntensity = this.isNight ? 0.85 : 1.05;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 520;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    this.camera.position.copy(this._targetCamPos);
  }

  _initLights() {
    this.hemiLight = new THREE.HemisphereLight(0xfff4d6, 0x263238, 0.9);
    this.scene.add(this.hemiLight);

    this.keyLight = new THREE.DirectionalLight(0xffe6b3, 1.8);
    this.keyLight.position.set(8, 14, 9);
    if (!this.isSoftwareGl) {
      this.keyLight.castShadow = true;
      this.keyLight.shadow.mapSize.set(1024, 1024);
      this.keyLight.shadow.camera.near = 1;
      this.keyLight.shadow.camera.far = 36;
      const d = 8.5;
      this.keyLight.shadow.camera.left = -d;
      this.keyLight.shadow.camera.right = d;
      this.keyLight.shadow.camera.top = d;
      this.keyLight.shadow.camera.bottom = -d;
      this.keyLight.shadow.bias = -0.0005;
    }
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.75);
    this.rimLight.position.set(-8, 7, -9);
    this.scene.add(this.rimLight);

    this.lanternGlow = new THREE.PointLight(0xfbbf24, 2.2, 16, 1.5);
    this.lanternGlow.position.set(0, 3.2, 0);
    this.scene.add(this.lanternGlow);
  }

  _buildSanctuary() {
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // Shared PBR Materials
    this.goldMat = new THREE.MeshStandardMaterial({
      color: 0xe6a825,
      metalness: 0.9,
      roughness: 0.22,
    });
    this.brassMat = new THREE.MeshStandardMaterial({
      color: 0xb97c1e,
      metalness: 0.85,
      roughness: 0.3,
    });
    this.emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x065f46,
      metalness: 0.15,
      roughness: 0.42,
    });
    this.turquoiseMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      metalness: 0.25,
      roughness: 0.28,
    });
    this.marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf4efe4,
      metalness: 0.05,
      roughness: 0.35,
    });
    this.crimsonSilkMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      metalness: 0.08,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    this.emeraldSilkMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      metalness: 0.08,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    this.lanternEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    // 1. Courtyard Marble & Tile Floor
    this.dayFloorTex = createMarbleFloorTexture(false);
    this.nightFloorTex = createMarbleFloorTexture(true);
    this.floorMat = new THREE.MeshStandardMaterial({
      map: this.isNight ? this.nightFloorTex : this.dayFloorTex,
      roughness: 0.4,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(11, 11.4, 0.3, 64), this.floorMat);
    floor.position.y = -0.15;
    floor.receiveShadow = true;
    this.rootGroup.add(floor);

    // 2. Stepped Sanctuary Plinth Group
    this.plinthGroup = new THREE.Group();
    this.plinthGroup.userData.baseY = 0;
    this.plinthGroup.userData.explodeOffset = 0;
    const step1 = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.7, 0.28, 8), this.marbleMat);
    step1.position.y = 0.14;
    step1.receiveShadow = true;
    step1.castShadow = true;
    const step2 = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.0, 0.26, 8), this.turquoiseMat);
    step2.position.y = 0.4;
    step2.receiveShadow = true;
    const innerPad = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.55, 0.16, 8), this.marbleMat);
    innerPad.position.y = 0.58;
    innerPad.receiveShadow = true;
    const goldBorder = new THREE.Mesh(new THREE.TorusGeometry(3.52, 0.055, 12, 8), this.goldMat);
    goldBorder.rotation.x = Math.PI / 2;
    goldBorder.rotation.z = Math.PI / 8;
    goldBorder.position.y = 0.66;
    this.plinthGroup.add(step1, step2, innerPad, goldBorder);
    this.rootGroup.add(this.plinthGroup);

    // 3. Octagonal Pavilion Columns, Arches & Suspended Lanterns
    this.pavilionGroup = new THREE.Group();
    this.pavilionGroup.userData.baseY = 0;
    this.pavilionGroup.userData.explodeOffset = 0.9;
    const pillarRadius = 3.05;
    this.lanternMeshes = [];

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const px = Math.cos(angle) * pillarRadius;
      const pz = Math.sin(angle) * pillarRadius;

      // Column base, shaft, and capital
      const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.3, 12), this.brassMat);
      pBase.position.set(px, 0.8, pz);
      const pShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 2.55, 16), this.marbleMat);
      pShaft.position.set(px, 2.22, pz);
      pShaft.castShadow = true;
      const pCap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.14, 0.25, 12), this.goldMat);
      pCap.position.set(px, 3.62, pz);

      this.pavilionGroup.add(pBase, pShaft, pCap);

      // Arches connecting adjacent pillars
      const nextAngle = ((i + 1) * Math.PI) / 4 + Math.PI / 8;
      const nx = Math.cos(nextAngle) * pillarRadius;
      const nz = Math.sin(nextAngle) * pillarRadius;
      const mx = (px + nx) / 2;
      const mz = (pz + nz) / 2;
      const archAngle = Math.atan2(px - nx, pz - nz);

      const archBeam = new THREE.Mesh(
        new THREE.TorusGeometry(1.16, 0.085, 10, 24, Math.PI),
        i % 2 === 0 ? this.turquoiseMat : this.goldMat
      );
      archBeam.position.set(mx, 3.45, mz);
      archBeam.rotation.y = archAngle + Math.PI / 2;
      this.pavilionGroup.add(archBeam);

      // Suspended Brass Mosque Lantern on every alternate bay
      if (i % 2 === 0) {
        const lGroup = new THREE.Group();
        lGroup.position.set(mx * 0.86, 3.35, mz * 0.86);

        const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.45, 6), this.brassMat);
        chain.position.y = -0.22;
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.18, 6), this.brassMat);
        cap.position.y = -0.46;
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.26, 6), this.lanternEmissiveMat);
        core.position.y = -0.64;
        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 6), this.brassMat);
        finial.rotation.x = Math.PI;
        finial.position.y = -0.82;

        lGroup.add(chain, cap, core, finial);
        this.lanternMeshes.push(lGroup);
        this.pavilionGroup.add(lGroup);
      }
    }

    // Calligraphy frieze drum above arches
    this.calligraphyTex = createCalligraphyBandTexture();
    const drumBandMat = new THREE.MeshStandardMaterial({
      map: this.calligraphyTex,
      roughness: 0.35,
      metalness: 0.35,
    });
    const friezeDrum = new THREE.Mesh(new THREE.CylinderGeometry(3.15, 3.18, 0.62, 32, 1, true), drumBandMat);
    friezeDrum.position.y = 4.1;
    const upperRing = new THREE.Mesh(new THREE.TorusGeometry(3.16, 0.07, 12, 48), this.goldMat);
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = 4.42;
    const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(3.18, 0.07, 12, 48), this.goldMat);
    lowerRing.rotation.x = Math.PI / 2;
    lowerRing.position.y = 3.78;

    this.pavilionGroup.add(friezeDrum, upperRing, lowerRing);
    this.rootGroup.add(this.pavilionGroup);

    // 4. Golden Dome of Hazrat Abbas (ع)
    this.domeGroup = new THREE.Group();
    this.domeGroup.userData.baseY = 0;
    this.domeGroup.userData.explodeOffset = 2.45;

    const domeCollar = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.75, 0.55, 36), this.emeraldMat);
    domeCollar.position.y = 4.65;
    const domeMain = new THREE.Mesh(
      new THREE.SphereGeometry(2.28, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.58),
      this.goldMat
    );
    domeMain.position.y = 4.82;
    domeMain.scale.set(1, 1.18, 1);
    domeMain.castShadow = true;

    const domeSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.14, 0.95, 16), this.goldMat);
    domeSpire.position.y = 7.75;
    const finialOrb1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), this.goldMat);
    finialOrb1.position.y = 7.62;
    const finialOrb2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), this.goldMat);
    finialOrb2.position.y = 7.95;

    this.domeGroup.add(domeCollar, domeMain, domeSpire, finialOrb1, finialOrb2);
    this.rootGroup.add(this.domeGroup);

    // 5. Twin Gilded Minarets flanking the shrine courtyard
    this.minaretsGroup = new THREE.Group();
    this.minaretsGroup.userData.baseY = 0;
    this.minaretsGroup.userData.explodeOffset = 1.6;

    [-4.1, 4.1].forEach((xOffset) => {
      const mGroup = new THREE.Group();
      mGroup.position.set(xOffset, 0, -2.5);

      const mPlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 1.1, 8), this.turquoiseMat);
      mPlinth.position.y = 0.55;
      const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 4.9, 24), this.goldMat);
      mShaft.position.y = 3.5;
      mShaft.castShadow = true;
      const mBalcony = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.44, 0.35, 16), this.emeraldMat);
      mBalcony.position.y = 5.95;
      const mTopShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 1.1, 20), this.goldMat);
      mTopShaft.position.y = 6.65;
      const mCupola = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), this.goldMat);
      mCupola.position.y = 7.22;
      mCupola.scale.set(1, 1.35, 1);
      const mNeedle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.06, 0.55, 8), this.goldMat);
      mNeedle.position.y = 7.82;

      mGroup.add(mPlinth, mShaft, mBalcony, mTopShaft, mCupola, mNeedle);
      this.minaretsGroup.add(mGroup);
    });
    this.rootGroup.add(this.minaretsGroup);

    // 6. Central Sculpted Alam Standard ("علمدار کربلا") + Silk Banners
    this.alamGroup = new THREE.Group();
    this.alamGroup.userData.baseY = 0;
    this.alamGroup.userData.explodeOffset = 0.4;

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.42, 16), this.emeraldMat);
    pedestal.position.y = 0.85;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 2.75, 16), this.brassMat);
    pole.position.y = 2.15;
    pole.castShadow = true;

    // Ornate central Alam medallion drum
    const alamDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.62, 16), this.goldMat);
    alamDrum.position.y = 2.85;
    const crestRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.045, 12, 32), this.emeraldMat);
    crestRing.rotation.x = Math.PI / 2;
    crestRing.position.y = 3.16;

    // Palm Hand ("پنجه مبارک") & Flame Finial silhouette
    const palmDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.08, 16), this.goldMat);
    palmDisc.rotation.x = Math.PI / 2;
    palmDisc.position.y = 3.55;
    const fingers = [-0.14, -0.07, 0, 0.07, 0.14];
    fingers.forEach((fx, idx) => {
      const h = idx === 2 ? 0.42 : idx === 1 || idx === 3 ? 0.36 : 0.28;
      const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.024, h, 4, 8), this.goldMat);
      finger.position.set(fx, 3.66 + h * 0.4, 0);
      this.alamGroup.add(finger);
    });

    // Billowing Silk Banner Planes (animated vertex wave)
    this.emeraldBannerGeo = new THREE.PlaneGeometry(1.85, 0.62, 18, 6);
    this.emeraldBannerGeo.translate(0.92, 0, 0);
    this.emeraldBannerBasePos = Float32Array.from(this.emeraldBannerGeo.attributes.position.array);
    const emeraldBanner = new THREE.Mesh(this.emeraldBannerGeo, this.emeraldSilkMat);
    emeraldBanner.position.set(0.06, 2.95, 0.02);
    emeraldBanner.rotation.y = 0.25;

    this.crimsonBannerGeo = new THREE.PlaneGeometry(1.55, 0.48, 16, 6);
    this.crimsonBannerGeo.translate(0.77, 0, 0);
    this.crimsonBannerBasePos = Float32Array.from(this.crimsonBannerGeo.attributes.position.array);
    const crimsonBanner = new THREE.Mesh(this.crimsonBannerGeo, this.crimsonSilkMat);
    crimsonBanner.position.set(0.06, 2.55, -0.04);
    crimsonBanner.rotation.y = -0.35;

    this.alamGroup.add(pedestal, pole, alamDrum, crestRing, palmDisc, emeraldBanner, crimsonBanner);
    this.rootGroup.add(this.alamGroup);
  }

  _buildParticles() {
    const count = this.isSoftwareGl ? 60 : 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.4 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = 0.6 + Math.random() * 7.2;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.085,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.motes = new THREE.Points(geo, mat);
    this.scene.add(this.motes);
  }

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 4.2;
    this.controls.maxDistance = 18.5;
    this.controls.maxPolarAngle = Math.PI * 0.485;
    this.controls.minPolarAngle = 0.25;
    this.controls.target.copy(this._currentLookAt);
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.55;

    this.controls.addEventListener('start', () => {
      this._isTransitioningCam = false;
    });
  }

  _attachEvents() {
    this._onResize = () => {
      if (this.disposed) return;
      const w = this.container.clientWidth || 800;
      const h = this.container.clientHeight || 520;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    this._onContextLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(this.rafId);
    };

    window.addEventListener('resize', this._onResize);
    this.renderer.domElement.addEventListener('webglcontextlost', this._onContextLost, false);
  }

  applyTheme(isNight, immediate = false) {
    this.isNight = Boolean(isNight);
    if (this.floorMat) {
      this.floorMat.map = this.isNight ? this.nightFloorTex : this.dayFloorTex;
      this.floorMat.needsUpdate = true;
    }

    this.hemiLight.intensity = this.isNight ? 0.55 : 1.05;
    this.keyLight.intensity = this.isNight ? 1.05 : 2.1;
    this.rimLight.intensity = this.isNight ? 1.15 : 0.65;
    this.lanternGlow.intensity = this.isNight ? 3.2 : 1.4;
    this.lanternEmissiveMat.emissiveIntensity = this.isNight ? 3.1 : 1.4;
    this.scene.environmentIntensity = this.isNight ? 0.85 : 1.1;

    if (immediate) {
      this._curSky.copy(this.isNight ? this._skyNight : this._skyDay);
      this.scene.background = this._curSky.clone();
      this.scene.fog.color.copy(this._curSky);
    }
  }

  setCameraPreset(presetId, immediate = false) {
    const presets = {
      overview: { pos: [8.8, 5.4, 9.8], look: [0, 2.5, 0] },
      alam: { pos: [2.8, 2.8, 4.1], look: [0.3, 2.6, 0] },
      dome: { pos: [5.4, 7.2, 6.2], look: [0, 5.6, 0] },
      lanterns: { pos: [4.2, 2.4, 4.5], look: [0, 2.8, 0] },
    };
    const chosen = presets[presetId] || presets.overview;
    this._targetCamPos.set(chosen.pos[0], chosen.pos[1], chosen.pos[2]);
    this._targetLookAt.set(chosen.look[0], chosen.look[1], chosen.look[2]);
    this._isTransitioningCam = !immediate;

    if (immediate) {
      this.camera.position.copy(this._targetCamPos);
      this._currentLookAt.copy(this._targetLookAt);
      this.controls.target.copy(this._currentLookAt);
      this.controls.update();
    }
  }

  setExploded(exploded) {
    this.isExploded = Boolean(exploded);
  }

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled);
    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
  }

  _waveBanner(geo, baseArray, time, speed, amp) {
    const attr = geo.attributes.position;
    for (let i = 0; i < attr.count; i++) {
      const bx = baseArray[i * 3];
      const by = baseArray[i * 3 + 1];
      const waveFactor = Math.max(0, bx / 1.8);
      const zWave = Math.sin(bx * 3.1 - time * speed) * amp * waveFactor;
      const yDroop = -waveFactor * waveFactor * 0.14 + Math.cos(bx * 2.2 - time * speed * 0.8) * 0.04 * waveFactor;
      attr.setXYZ(i, bx, by + yDroop, zWave);
    }
    attr.needsUpdate = true;
    geo.computeVertexNormals();
  }

  _animate() {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(() => this._animate());

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // Smooth Day/Night sky & fog lerp
    const targetSky = this.isNight ? this._skyNight : this._skyDay;
    this._curSky.lerp(targetSky, 0.06);
    this.scene.background.copy(this._curSky);
    this.scene.fog.color.copy(this._curSky);

    // Smooth camera preset interpolation
    if (this._isTransitioningCam) {
      this.camera.position.lerp(this._targetCamPos, 0.075);
      this._currentLookAt.lerp(this._targetLookAt, 0.075);
      this.controls.target.copy(this._currentLookAt);
      if (this.camera.position.distanceTo(this._targetCamPos) < 0.06) {
        this._isTransitioningCam = false;
      }
    }

    // Exploded architectural assembly lerp
    const layers = [this.plinthGroup, this.alamGroup, this.pavilionGroup, this.minaretsGroup, this.domeGroup];
    for (let i = 0; i < layers.length; i++) {
      const grp = layers[i];
      const targetY = grp.userData.baseY + (this.isExploded ? grp.userData.explodeOffset : 0);
      grp.position.y = THREE.MathUtils.lerp(grp.position.y, targetY, 0.08);
    }

    // Gentle wind wave on Alam silk sashes
    this._waveBanner(this.emeraldBannerGeo, this.emeraldBannerBasePos, t, 2.4, 0.14);
    this._waveBanner(this.crimsonBannerGeo, this.crimsonBannerBasePos, t + 1.1, 2.1, 0.11);

    // Subtle lantern sway
    for (let i = 0; i < this.lanternMeshes.length; i++) {
      const l = this.lanternMeshes[i];
      l.rotation.z = Math.sin(t * 1.4 + i) * 0.045;
      l.rotation.x = Math.cos(t * 1.1 + i) * 0.035;
    }

    // Rising golden motes
    if (this.motes) {
      const posAttr = this.motes.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i) + delta * 0.24;
        if (y > 8.2) y = 0.6;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      this.motes.rotation.y += delta * 0.045;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this._onResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('webglcontextlost', this._onContextLost);
    }
    this.controls?.dispose();
    this.scene?.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    this.envRenderTarget?.dispose();
    this.dayFloorTex?.dispose();
    this.nightFloorTex?.dispose();
    this.calligraphyTex?.dispose();
    this.renderer?.dispose();
  }
}
