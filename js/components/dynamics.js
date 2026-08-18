/**
 * Slide 2: Dedicated Vehicle Dynamics Component
 * MPU6050 6-DOF IMU Telematics, Interactive 3D Volvo Truck Model (Smooth Non-Blinking & Flat Container)
 */

class DynamicsComponent {
  constructor() {
    this.speedChart = null;
    this.accelChart = null;
    this.currentAngleIndex = 0;

    // Sketchfab camera angle embeds / presets
    this.angleParams = [
      'autostart=1&ui_controls=1&ui_infos=0', // Default 3/4 Perspective
      'autostart=1&ui_controls=1&camera=0,3,1.5,0,0,0', // Front View
      'autostart=1&ui_controls=1&camera=4,0,1,0,0,0', // Side Profile
      'autostart=1&ui_controls=1&camera=-3,-3,2,0,0,0', // Rear Quarter
      'autostart=1&ui_controls=1&camera=0,0,5,0,0,0' // Top Down View
    ];
  }

  render(container, data) {
    const scoreColor = data.drivingScore >= 80 ? 'var(--success)' : (data.drivingScore >= 60 ? 'var(--warning)' : 'var(--danger)');

    // 1. If structure already built, perform IN-PLACE DOM update to eliminate blinking completely!
    if (container.querySelector('#sketchfab-truck-iframe')) {
      this.updateInPlace(data, scoreColor);
      return;
    }

    // 2. Initial Full Render (Only built once when tab is opened!)
    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-gauge-high"></i> 2. Truck Dynamics & Interactive 3D Inspection</h2>
          <div class="page-subtitle" style="font-size: 14px;">Real-time vehicle physics from MPU6050 6-DOF IMU + Interactive 3D Volvo Truck Model</div>
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

      <!-- Top Score & KPI Cards -->
      <div class="grid-container grid-cols-12" style="margin-bottom: 24px;">
        <!-- AI Driving Score Canvas Card -->
        <div class="card span-4" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
          <div class="card-header" style="width: 100%; margin-bottom: 12px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-brain"></i> AI Driving Score</span>
            <span class="card-tag ai">MPU6050 + RPI-5</span>
          </div>

          <div class="gauge-container" style="margin: 10px 0;">
            <canvas id="driving-score-gauge" width="180" height="180"></canvas>
            <div class="gauge-score">
              <div class="num" id="dyn-score-num" style="color: ${scoreColor}; font-size: 38px;">${data.drivingScore}</div>
              <div class="label" style="font-size: 11px;">out of 100</div>
            </div>
          </div>

          <div style="font-size: 14px; font-weight: 700; color: #fff;">Status: <span id="dyn-score-status" style="color: ${scoreColor};">${data.drivingStatus}</span></div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Evaluates smooth cornering, braking & speed limits.</div>
        </div>

        <!-- Dynamic Physical Parameters Grid -->
        <div class="span-8 grid-container grid-cols-3">
          <div class="card metric-box" style="padding: 20px;">
            <div class="card-header">
              <span class="card-title">Current Speed</span>
              <span class="card-tag sensor">CAN / GPS</span>
            </div>
            <div class="metric-val" id="dyn-val-speed" style="font-size: 32px;">${data.speed.toFixed(1)} <span class="metric-unit">km/h</span></div>
            <div class="metric-label">Governor Limit: ${data.maxSpeed} km/h</div>
            <div class="metric-trend up"><i class="fa-solid fa-chart-line"></i> Avg: ${data.avgSpeed} km/h</div>
          </div>

          <div class="card metric-box" style="padding: 20px;">
            <div class="card-header">
              <span class="card-title">Longitudinal Accel</span>
              <span class="card-tag sensor">MPU6050 IMU</span>
            </div>
            <div class="metric-val" id="dyn-val-accel" style="font-size: 32px;">${data.acceleration.toFixed(2)} <span class="metric-unit">m/s²</span></div>
            <div class="metric-label">Decel Rate: ${data.deceleration} m/s²</div>
            <div class="metric-trend"><i class="fa-solid fa-bolt"></i> Braking Int: ${(data.brakingIntensity * 100).toFixed(0)}%</div>
          </div>

          <div class="card metric-box" style="padding: 20px;">
            <div class="card-header">
              <span class="card-title">IMU Attitude Matrix</span>
              <span class="card-tag ai">6-DOF ANGLE</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; margin-top: 4px;">
              <div style="display:flex; justify-content:space-between;"><span>Pitch Incline:</span> <strong style="color:var(--primary);" id="dyn-val-pitch">${data.pitch > 0 ? '+' : ''}${data.pitch.toFixed(1)}°</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Roll Incline:</span> <strong style="color:var(--success);" id="dyn-val-roll">${data.roll > 0 ? '+' : ''}${data.roll.toFixed(1)}°</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Yaw Heading:</span> <strong style="color:var(--warning);" id="dyn-val-yaw">${data.yaw.toFixed(1)}°</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Harsh Events:</span> <strong style="color:var(--danger);" id="dyn-val-harsh">${data.harshAccelEvents + data.harshBrakingEvents}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Embedded Interactive 3D Model Card (Flat Bounding Box - No Container Tilting!) -->
      <div class="card span-12" style="margin-bottom: 24px; padding: 20px;">
        <div class="card-header" style="margin-bottom: 16px;">
          <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-cube"></i> Interactive Volvo FH Series 3D Truck Model Viewer</span>
          <div style="display: flex; gap: 8px;">
            <span class="card-tag ai" id="dyn-imu-tag">IMU PITCH: ${data.pitch.toFixed(1)}° | ROLL: ${data.roll.toFixed(1)}°</span>
          </div>
        </div>

        <div style="
          height: 460px; 
          width: 100%; 
          border-radius: var(--radius-md); 
          overflow: hidden; 
          background: #070a12; 
          position: relative;
          border: 1px solid var(--border-color);
        ">
          <iframe 
            id="sketchfab-truck-iframe"
            title="Volvo FH series Truck 3D Model" 
            src="https://sketchfab.com/models/748a51c9d1034efa896a2c917cad434f/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0" 
            style="width: 100%; height: 100%; border: none;"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowfullscreen>
          </iframe>
        </div>

        <!-- 3D Orbit View Control Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12px; color: var(--text-muted);">
            <i class="fa-solid fa-hand-pointer" style="color: var(--primary);"></i> Drag left/right with mouse or finger to rotate 3D truck 360°.
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="sim-btn" onclick="window.dynamicsComp.setCameraAngle(0)">
              <i class="fa-solid fa-cube"></i> 3/4 View
            </button>
            <button class="sim-btn" onclick="window.dynamicsComp.setCameraAngle(1)">
              <i class="fa-solid fa-truck-front"></i> Front
            </button>
            <button class="sim-btn" onclick="window.dynamicsComp.setCameraAngle(2)">
              <i class="fa-solid fa-truck-side"></i> Side
            </button>
            <button class="sim-btn" onclick="window.dynamicsComp.setCameraAngle(3)">
              <i class="fa-solid fa-truck"></i> Rear
            </button>
          </div>
        </div>
      </div>

      <!-- Real-Time Dynamics Charts -->
      <div class="grid-container grid-cols-2">
        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-line"></i> Speed vs Time (km/h)</span>
            <span class="card-tag sensor">REALTIME</span>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chart-speed"></canvas>
          </div>
        </div>

        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-wave-square"></i> Acceleration (m/s²) vs Time</span>
            <span class="card-tag sensor">MPU6050 50Hz</span>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chart-accel"></canvas>
          </div>
        </div>
      </div>
    `;

    window.dynamicsComp = this;

    setTimeout(() => {
      this.drawScoreGauge(data.drivingScore, scoreColor);
      this.renderCharts(data);
    }, 100);
  }

  // Smooth In-Place DOM Update (Zero Blinking / Flashing!)
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

    const valHarsh = document.getElementById('dyn-val-harsh');
    if (valHarsh) valHarsh.textContent = `${data.harshAccelEvents + data.harshBrakingEvents}`;

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

    const imuTag = document.getElementById('dyn-imu-tag');
    if (imuTag) imuTag.textContent = `IMU PITCH: ${data.pitch.toFixed(1)}° | ROLL: ${data.roll.toFixed(1)}°`;

    this.drawScoreGauge(data.drivingScore, scoreColor);
    this.updateCharts(data);
  }

  setCameraAngle(index) {
    this.currentAngleIndex = index;
    const iframe = document.getElementById('sketchfab-truck-iframe');
    if (!iframe) return;

    const base = 'https://sketchfab.com/models/748a51c9d1034efa896a2c917cad434f/embed?';
    const params = this.angleParams[index] || this.angleParams[0];
    iframe.src = base + params;
  }

  drawScoreGauge(score, color) {
    const canvas = document.getElementById('driving-score-gauge');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth || 180;
    canvas.height = canvas.clientHeight || 180;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 16;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineCap = 'round';
    ctx.stroke();

    const currentAngle = startAngle + (score / 100) * (endAngle - startAngle);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.lineWidth = 14;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  renderCharts(data) {
    if (typeof Chart === 'undefined') return;

    const labels = data.history ? data.history.timestamps : ['10:00', '10:05', '10:10'];

    const ctxSpeed = document.getElementById('chart-speed');
    if (ctxSpeed) {
      if (this.speedChart) this.speedChart.destroy();
      this.speedChart = new Chart(ctxSpeed, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Speed (km/h)',
            data: data.history ? data.history.speed : [75, 78, data.speed],
            borderColor: '#00d2ff',
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 0, max: 110 }
          }
        }
      });
    }

    const ctxAccel = document.getElementById('chart-accel');
    if (ctxAccel) {
      if (this.accelChart) this.accelChart.destroy();
      this.accelChart = new Chart(ctxAccel, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Acceleration (m/s²)',
            data: data.history ? data.history.acceleration : [0.1, 0.15, data.acceleration],
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            fill: true,
            tension: 0.2,
            borderWidth: 2,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: -3, max: 3 }
          }
        }
      });
    }
  }

  updateCharts(data) {
    if (!data.history) return;
    if (this.speedChart) {
      this.speedChart.data.labels = data.history.timestamps;
      this.speedChart.data.datasets[0].data = data.history.speed;
      this.speedChart.update('none');
    }
    if (this.accelChart) {
      this.accelChart.data.labels = data.history.timestamps;
      this.accelChart.data.datasets[0].data = data.history.acceleration;
      this.accelChart.update('none');
    }
  }
}

window.DynamicsComponent = DynamicsComponent;
