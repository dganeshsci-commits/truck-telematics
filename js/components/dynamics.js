/**
 * Slide 2: Truck Dynamics Component
 * Features:
 * 1. Compact Resized AI Driver Score Card
 * 2. Real 3D WebGL MPU6050 IMU Visualizer Canvas (Three.js 3D Truck Model smooth real-time rotation matching Pitch, Roll & Yaw angles)
 * 3. Acceleration (m/s²) vs Time Graph (1-Minute Intervals)
 */

class DynamicsComponent {
  constructor() {
    this.accelChart = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.truckMeshGroup = null;
    this.animFrameId = null;
    this.targetPitch = 0;
    this.targetRoll = 0;
    this.targetYaw = 0;
  }

  render(container, data) {
    const scoreColor = data.drivingScore >= 80 ? 'var(--success)' : (data.drivingScore >= 60 ? 'var(--warning)' : 'var(--danger)');

    // 1. If structure already built, perform IN-PLACE DOM update to eliminate blinking completely!
    if (container.querySelector('#imu-3d-canvas')) {
      this.updateInPlace(data, scoreColor);
      return;
    }

    // 2. Initial Full Render
    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-gauge-high"></i> 2. Truck Dynamics & 3D WebGL IMU Visualizer</h2>
          <div class="page-subtitle" style="font-size: 14px;">MPU6050 6-DOF IMU Telematics + Real-Time 3D Volvo Truck Rotation</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <span class="event-pill ${data.speed > 85 ? 'alert' : 'ok'}" id="dyn-speed-pill">
            <i class="fa-solid fa-tachograph-digital"></i> ${data.speed > 85 ? 'Overspeed Warning' : 'Speed Nominal'}
          </span>
          <span class="event-pill ${data.driverDrowsiness ? 'alert' : 'ok'}" id="dyn-fatigue-pill">
            <i class="fa-solid fa-user-shield"></i> ${data.driverDrowsiness ? 'Fatigue Alert' : 'Driver Alert'}
          </span>
        </div>
      </div>

      <!-- Resized Compact Top KPI Cards Row -->
      <div class="grid-container grid-cols-12" style="margin-bottom: 20px;">
        <!-- Compact Resized AI Driving Score Card -->
        <div class="card span-3" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 14px;">
          <div class="card-header" style="width: 100%; margin-bottom: 8px; padding-bottom: 6px;">
            <span class="card-title" style="font-size: 13px;"><i class="fa-solid fa-brain"></i> AI Driver Score</span>
            <span class="card-tag ai" style="font-size: 9px; padding: 1px 6px;">RPI-5</span>
          </div>

          <div class="gauge-container" style="width: 110px; height: 110px; margin: 4px 0;">
            <canvas id="driving-score-gauge" width="110" height="110"></canvas>
            <div class="gauge-score">
              <div class="num" id="dyn-score-num" style="color: ${scoreColor}; font-size: 26px;">${data.drivingScore}</div>
              <div class="label" style="font-size: 9px;">/ 100</div>
            </div>
          </div>

          <div style="font-size: 12px; font-weight: 700; color: #fff;">Status: <span id="dyn-score-status" style="color: ${scoreColor};">${data.drivingStatus}</span></div>
        </div>

        <!-- Dynamic Physical Parameters Grid -->
        <div class="span-9 grid-container grid-cols-3">
          <div class="card metric-box" style="padding: 16px;">
            <div class="card-header">
              <span class="card-title" style="font-size: 13px;">Current Speed</span>
              <span class="card-tag sensor">CAN / GPS</span>
            </div>
            <div class="metric-val" id="dyn-val-speed" style="font-size: 28px;">${data.speed.toFixed(1)} <span class="metric-unit">km/h</span></div>
            <div class="metric-label" style="font-size: 11px;">Limit: ${data.maxSpeed} km/h</div>
            <div class="metric-trend up" style="font-size: 10px;"><i class="fa-solid fa-chart-line"></i> Avg: ${data.avgSpeed} km/h</div>
          </div>

          <div class="card metric-box" style="padding: 16px;">
            <div class="card-header">
              <span class="card-title" style="font-size: 13px;">Longitudinal Accel</span>
              <span class="card-tag sensor">MPU6050 IMU</span>
            </div>
            <div class="metric-val" id="dyn-val-accel" style="font-size: 28px;">${data.acceleration.toFixed(2)} <span class="metric-unit">m/s²</span></div>
            <div class="metric-label" style="font-size: 11px;">Decel: ${data.deceleration} m/s²</div>
            <div class="metric-trend" style="font-size: 10px;"><i class="fa-solid fa-bolt"></i> Braking: ${(data.brakingIntensity * 100).toFixed(0)}%</div>
          </div>

          <div class="card metric-box" style="padding: 16px;">
            <div class="card-header">
              <span class="card-title" style="font-size: 13px;">IMU Attitude Angles</span>
              <span class="card-tag ai">6-DOF MATRIX</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; margin-top: 2px;">
              <div style="display:flex; justify-space-between;"><span>Pitch Incline:</span> <strong style="color:var(--primary);" id="dyn-val-pitch">${data.pitch > 0 ? '+' : ''}${data.pitch.toFixed(1)}°</strong></div>
              <div style="display:flex; justify-space-between;"><span>Roll Incline:</span> <strong style="color:var(--success);" id="dyn-val-roll">${data.roll > 0 ? '+' : ''}${data.roll.toFixed(1)}°</strong></div>
              <div style="display:flex; justify-space-between;"><span>Yaw Heading:</span> <strong style="color:var(--warning);" id="dyn-val-yaw">${data.yaw.toFixed(1)}°</strong></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time 3D WebGL IMU Visualizer Canvas Card -->
      <div class="card span-12" style="margin-bottom: 20px; padding: 18px;">
        <div class="card-header" style="margin-bottom: 12px;">
          <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-cube"></i> Real-Time WebGL 3D Truck IMU Sensor Orientation Visualizer</span>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span class="card-tag sensor" id="dyn-imu-matrix-tag">MPU6050 PITCH: ${data.pitch.toFixed(1)}° | ROLL: ${data.roll.toFixed(1)}° | YAW: ${data.yaw.toFixed(1)}°</span>
            <button class="sim-btn ${data.pitch > 4.0 ? 'active' : ''}" style="padding: 4px 10px; font-size: 11px;" onclick="window.telemetryEngine.toggleSteepIncline()">
              <i class="fa-solid fa-mountain"></i> ${data.pitch > 4.0 ? 'Reset Flat Ground' : 'Simulate Steep Slope Incline (+6.8° Pitch)'}
            </button>
          </div>
        </div>

        <!-- 3D WebGL Canvas Holder -->
        <div id="imu-3d-canvas-container" style="
          height: 380px; 
          width: 100%; 
          border-radius: var(--radius-md); 
          overflow: hidden; 
          background: radial-gradient(circle at 50% 50%, #0d1627, #05070d); 
          position: relative;
          border: 1px solid var(--border-color);
        ">
          <canvas id="imu-3d-canvas" style="width: 100%; height: 100%; display: block;"></canvas>

          <div style="position: absolute; bottom: 12px; left: 16px; font-size: 11px; color: var(--text-muted); background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px; backdrop-filter: blur(4px);">
            <i class="fa-solid fa-arrows-spin" style="color: var(--primary);"></i> WebGL 3D Vehicle rotation driven live by MPU6050 Euler attitude matrix.
          </div>
        </div>
      </div>

      <!-- Acceleration vs Time (1-Minute Intervals) Chart Card -->
      <div class="card span-12" style="padding: 20px;">
        <div class="card-header" style="margin-bottom: 16px;">
          <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-wave-square"></i> Longitudinal Acceleration (m/s²) vs Time (1-Minute Intervals)</span>
          <span class="card-tag sensor">MPU6050 1-MIN SAMPLES</span>
        </div>
        <div style="height: 260px; position: relative;">
          <canvas id="chart-accel-1min"></canvas>
        </div>
      </div>
    `;

    window.dynamicsComp = this;

    setTimeout(() => {
      this.drawScoreGauge(data.drivingScore, scoreColor);
      this.init3DVisualizer(data);
      this.render1MinAccelChart(data);
    }, 100);
  }

  // Smooth In-Place DOM & 3D Telemetry Update (Zero Blinking!)
  updateInPlace(data, scoreColor) {
    const valSpeed = document.getElementById('dyn-val-speed');
    if (valSpeed) valSpeed.innerHTML = `${data.speed.toFixed(1)} <span class="metric-unit">km/h</span>`;

    const valAccel = document.getElementById('dyn-val-accel');
    if (valAccel) valAccel.innerHTML = `${data.acceleration.toFixed(2)} <span class="metric-unit">m/s²</span>`;

    const valPitch = document.getElementById('dyn-val-pitch');
    if (valPitch) valPitch.textContent = `${data.pitch > 0 ? '+' : ''}${data.pitch.toFixed(1)}°`;

    const valRoll = document.getElementById('dyn-val-roll');
    if (valRoll) valRoll.textContent = `${data.roll > 0 ? '+' : ''}${data.roll.toFixed(1)}°`;

    const valYaw = document.getElementById('dyn-val-yaw');
    if (valYaw) valYaw.textContent = `${data.yaw.toFixed(1)}°`;

    const scoreNum = document.getElementById('dyn-score-num');
    if (scoreNum) {
      scoreNum.textContent = data.drivingScore;
      scoreNum.style.color = scoreColor;
    }

    const scoreStatus = document.getElementById('dyn-score-status');
    if (scoreStatus) {
      scoreStatus.textContent = data.drivingStatus;
      scoreStatus.style.color = scoreColor;
    }

    const imuTag = document.getElementById('dyn-imu-matrix-tag');
    if (imuTag) imuTag.textContent = `MPU6050 PITCH: ${data.pitch.toFixed(1)}° | ROLL: ${data.roll.toFixed(1)}° | YAW: ${data.yaw.toFixed(1)}°`;

    this.drawScoreGauge(data.drivingScore, scoreColor);
    this.update3DOrientation(data.pitch, data.roll, data.yaw);
    this.update1MinAccelChart(data);
  }

  // Initialize Three.js 3D WebGL Truck Model Visualizer
  init3DVisualizer(data) {
    const canvas = document.getElementById('imu-3d-canvas');
    const container = document.getElementById('imu-3d-canvas-container');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 380;

    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(6, 4, 8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00d2ff, 1.0);
    dirLight1.position.set(10, 20, 10);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3a86ff, 0.8);
    dirLight2.position.set(-10, 10, -10);
    this.scene.add(dirLight2);

    // 3. Grid Floor & Coordinates Guide
    const gridHelper = new THREE.GridHelper(16, 16, 0x00d2ff, 0x1f2d42);
    gridHelper.position.y = -1.2;
    this.scene.add(gridHelper);

    // 4. Construct 3D Volvo Heavy-Duty Truck Mesh Group
    this.truckMeshGroup = new THREE.Group();

    // Chassis Frame (Dark metallic rails)
    const frameGeo = new THREE.BoxGeometry(1.6, 0.3, 4.2);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a2332, roughness: 0.4, metalness: 0.8 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, -0.2, 0);
    this.truckMeshGroup.add(frameMesh);

    // Driver Cab (Volvo Metallic Cyan/Teal)
    const cabGeo = new THREE.BoxGeometry(1.5, 1.6, 1.4);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x0099cc, roughness: 0.2, metalness: 0.6 });
    const cabMesh = new THREE.Mesh(cabGeo, cabMat);
    cabMesh.position.set(0, 0.75, 1.2);
    this.truckMeshGroup.add(cabMesh);

    // Windshield (Dark Tint Glass)
    const glassGeo = new THREE.BoxGeometry(1.35, 0.7, 0.1);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x07111e, roughness: 0.1, metalness: 0.9 });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 0.9, 1.91);
    this.truckMeshGroup.add(glassMesh);

    // Roof Spoiler Deflector
    const roofGeo = new THREE.BoxGeometry(1.4, 0.4, 1.0);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0077aa, roughness: 0.3 });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, 1.7, 1.1);
    this.truckMeshGroup.add(roofMesh);

    // Cargo Container / Heavy Body
    const cargoGeo = new THREE.BoxGeometry(1.55, 1.5, 2.5);
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0x0e1726, roughness: 0.5, metalness: 0.5 });
    const cargoMesh = new THREE.Mesh(cargoGeo, cargoMat);
    cargoMesh.position.set(0, 0.7, -0.8);
    this.truckMeshGroup.add(cargoMesh);

    // Dual Wheel Assemblies (6 Wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.35, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelPositions = [
      [-0.85, -0.4, 1.2], [0.85, -0.4, 1.2],  // Front Steer Axle
      [-0.85, -0.4, -0.5], [0.85, -0.4, -0.5], // Drive Axle
      [-0.85, -0.4, -1.4], [0.85, -0.4, -1.4]  // Tag Axle
    ];

    wheelPositions.forEach(pos => {
      const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
      wMesh.position.set(pos[0], pos[1], pos[2]);
      this.truckMeshGroup.add(wMesh);
    });

    // Glowing LED Headlights
    const lightGeo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
    const lightL = new THREE.Mesh(lightGeo, lightMat);
    lightL.position.set(-0.55, 0.2, 1.91);
    const lightR = new THREE.Mesh(lightGeo, lightMat);
    lightR.position.set(0.55, 0.2, 1.91);
    this.truckMeshGroup.add(lightL);
    this.truckMeshGroup.add(lightR);

    this.scene.add(this.truckMeshGroup);

    this.targetPitch = data.pitch || 0;
    this.targetRoll = data.roll || 0;
    this.targetYaw = data.yaw || 0;

    // 5. Render Loop
    const animate = () => {
      this.animFrameId = requestAnimationFrame(animate);

      if (this.truckMeshGroup) {
        // Smoothly interpolate rotation to match MPU6050 IMU Pitch, Roll, Yaw
        const targetX = THREE.MathUtils.degToRad(this.targetPitch);
        const targetZ = THREE.MathUtils.degToRad(-this.targetRoll);
        const targetY = THREE.MathUtils.degToRad(this.targetYaw);

        this.truckMeshGroup.rotation.x += (targetX - this.truckMeshGroup.rotation.x) * 0.1;
        this.truckMeshGroup.rotation.z += (targetZ - this.truckMeshGroup.rotation.z) * 0.1;
        this.truckMeshGroup.rotation.y += (targetY - this.truckMeshGroup.rotation.y) * 0.1;
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  update3DOrientation(pitch, roll, yaw) {
    this.targetPitch = pitch || 0;
    this.targetRoll = roll || 0;
    this.targetYaw = yaw || 0;
  }

  drawScoreGauge(score, color) {
    const canvas = document.getElementById('driving-score-gauge');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth || 110;
    canvas.height = canvas.clientHeight || 110;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineCap = 'round';
    ctx.stroke();

    const currentAngle = startAngle + (score / 100) * (endAngle - startAngle);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  render1MinAccelChart(data) {
    if (typeof Chart === 'undefined') return;

    const ctxAccel = document.getElementById('chart-accel-1min');
    if (!ctxAccel) return;
    if (this.accelChart) this.accelChart.destroy();

    // 1-Minute Interval Timestamps
    const oneMinLabels = ['10:00', '10:01', '10:02', '10:03', '10:04', '10:05'];
    const accelData = [0.12, 0.25, 0.18, -0.35, 0.05, data.acceleration || 0.15];

    this.accelChart = new Chart(ctxAccel, {
      type: 'line',
      data: {
        labels: oneMinLabels,
        datasets: [{
          label: 'Longitudinal Acceleration (m/s²)',
          data: accelData,
          borderColor: '#3a86ff',
          backgroundColor: 'rgba(58, 134, 255, 0.12)',
          fill: true,
          tension: 0.3,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#00d2ff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { 
            grid: { color: 'rgba(255,255,255,0.05)' }, 
            ticks: { color: '#8a99ad', font: { size: 12 } },
            title: { display: true, text: 'Time (1-Minute Intervals)', color: '#5c6b80', font: { size: 11 } }
          },
          y: { 
            grid: { color: 'rgba(255,255,255,0.05)' }, 
            ticks: { color: '#8a99ad', font: { size: 11 } }, 
            min: -2.5, 
            max: 2.5,
            title: { display: true, text: 'Acceleration (m/s²)', color: '#5c6b80', font: { size: 11 } }
          }
        }
      }
    });
  }

  update1MinAccelChart(data) {
    if (this.accelChart) {
      const currentData = this.accelChart.data.datasets[0].data;
      currentData[currentData.length - 1] = data.acceleration;
      this.accelChart.update('none');
    }
  }
}

window.DynamicsComponent = DynamicsComponent;
