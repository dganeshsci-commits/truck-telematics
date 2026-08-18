/**
 * Slide 3: Dedicated Fuel Tilt Compensation Component
 * Hardware: MPU6050 IMU (6-DOF Accelerometer + Gyroscope) + DYP-L02 Ultrasonic Fuel Height Sensor
 * Zero-Blinking In-Place DOM Updates
 */

class TiltComponent {
  constructor() {
    this.tiltChart = null;
  }

  render(container, data) {
    // 1. If structure built, update in-place to prevent blinking!
    if (container.querySelector('#tank-tilt-canvas')) {
      this.updateInPlace(data);
      return;
    }

    // 2. Initial Full Render
    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-compass-drafting"></i> 3. Fuel Tilt Compensation Engine</h2>
          <div class="page-subtitle" style="font-size: 14px;">MPU6050 IMU 6-DOF Incline Matrix + DYP-L02 Ultrasonic Geometric Correction</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="sim-btn ${data.pitch > 4.0 ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px;" onclick="window.telemetryEngine.toggleSteepIncline()">
            <i class="fa-solid fa-mountain"></i> ${data.pitch > 4.0 ? 'Reset Flat Terrain' : 'Simulate Steep Incline (+6.8° Pitch)'}
          </button>
        </div>
      </div>

      <!-- Prominent Full-Width Metric Banner -->
      <div class="card" style="background: linear-gradient(135deg, rgba(0, 210, 255, 0.12), rgba(58, 134, 255, 0.06)); border: 1px solid rgba(0, 210, 255, 0.3); margin-bottom: 24px; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;">
          <div>
            <div style="font-size: 13px; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
              Primary Telematics Metric
            </div>
            <div style="font-size: 34px; font-weight: 900; color: #fff; margin-top: 4px;">
              Tilt-Compensated Fuel Level: <span style="color: var(--success);" id="tilt-val-fuel">${data.correctedFuelVolume.toFixed(1)} L</span>
            </div>
            <div style="font-size: 14px; color: var(--text-muted); margin-top: 6px;">
              Raw Ultrasonic Reading: <strong style="color: var(--warning);" id="tilt-val-raw">${data.rawFuelVolume.toFixed(1)} L</strong> (Delta Error: <span id="tilt-val-delta">${(data.correctedFuelVolume - data.rawFuelVolume).toFixed(1)} L</span>)
            </div>
          </div>

          <div style="display: flex; gap: 20px;">
            <div class="card metric-box" style="background: rgba(0,0,0,0.5); padding: 16px 24px; min-width: 140px; text-align: center;">
              <div class="metric-label" style="font-size: 12px;">IMU Pitch Angle</div>
              <div class="metric-val" id="tilt-val-pitch" style="font-size: 26px; color: var(--primary); font-weight: 800;">${data.pitch > 0 ? '+' : ''}${data.pitch.toFixed(1)}°</div>
              <div class="metric-trend" style="justify-content: center;"><i class="fa-solid fa-arrows-up-down"></i> Longitudinal</div>
            </div>
            <div class="card metric-box" style="background: rgba(0,0,0,0.5); padding: 16px 24px; min-width: 140px; text-align: center;">
              <div class="metric-label" style="font-size: 12px;">IMU Roll Angle</div>
              <div class="metric-val" id="tilt-val-roll" style="font-size: 26px; color: var(--success); font-weight: 800;">${data.roll > 0 ? '+' : ''}${data.roll.toFixed(1)}°</div>
              <div class="metric-trend" style="justify-content: center;"><i class="fa-solid fa-arrows-left-right"></i> Lateral</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2D Fuel Tank Visualizer & Mathematics Split Section -->
      <div class="grid-container grid-cols-12" style="margin-bottom: 24px;">
        <div class="card span-7" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-cubes"></i> Fuel Tank Inclination & Sloshing Dynamics Visualizer</span>
            <span class="card-tag ai">MPU6050 + DYP-L02</span>
          </div>
          <div style="height: 320px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #070a12; border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow: hidden; padding: 10px;">
            <canvas id="tank-tilt-canvas" style="width: 100%; height: 100%; max-height: 280px;"></canvas>
            <div style="position: absolute; bottom: 10px; font-size: 12px; color: var(--text-muted); background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px;">
              <i class="fa-solid fa-filter" style="color: var(--primary);"></i> Low-pass Butterworth Sloshing Filter: <strong style="color:#fff;">ACTIVE (0.5 Hz Cutoff)</strong>
            </div>
          </div>
        </div>

        <div class="card span-5" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-header" style="margin-bottom: 14px;">
              <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-calculator"></i> Tilt Compensation Physics</span>
              <span class="card-tag sensor">ALGORITHM</span>
            </div>

            <div style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
              When a Volvo FH heavy-duty truck travels on grades or banks, liquid fuel tilts inside the rectangular 450L tank.
              An uncompensated bottom ultrasonic sensor (DYP-L02) incurs up to <strong style="color: var(--warning);">&plusmn;15% false fuel reading errors</strong>.
            </div>

            <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid var(--border-glow); border-radius: var(--radius-md); padding: 16px; font-family: monospace; font-size: 12px; color: var(--primary); margin-bottom: 16px;">
              <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">Trigonometric Correction Equation:</div>
              <div>H_corrected = H_raw &times; cos(&theta;_pitch) &times; cos(&phi;_roll)</div>
              <div style="margin-top: 6px; color: var(--text-muted);">Volume = Length &times; Width &times; H_corrected</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; background: rgba(255,255,255,0.02); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Raw Fuel Height:</span> <strong style="color:var(--warning);" id="tilt-val-hraw">${data.rawFuelHeight} mm</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Corrected Fuel Height:</span> <strong style="color:var(--success);" id="tilt-val-hcorr">${data.correctedFuelHeight} mm</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span>Filtered Slosh Amplitude:</span> <strong style="color:var(--primary);">&lt; 1.2 mm</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Raw vs Corrected Comparison Chart -->
      <div class="card span-12" style="padding: 20px;">
        <div class="card-header" style="margin-bottom: 16px;">
          <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-line"></i> Raw Ultrasonic vs Tilt-Compensated Fuel Volume Trend</span>
          <span class="card-tag sensor">REALTIME COMPARISON</span>
        </div>
        <div style="height: 320px; position: relative;">
          <canvas id="chart-tilt-comparison"></canvas>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.drawTankCanvas(data.pitch, data.roll, data.fuelPercent);
      this.renderCharts(data);
    }, 100);
  }

  updateInPlace(data) {
    const valFuel = document.getElementById('tilt-val-fuel');
    if (valFuel) valFuel.textContent = `${data.correctedFuelVolume.toFixed(1)} L`;

    const valRaw = document.getElementById('tilt-val-raw');
    if (valRaw) valRaw.textContent = `${data.rawFuelVolume.toFixed(1)} L`;

    const valDelta = document.getElementById('tilt-val-delta');
    if (valDelta) valDelta.textContent = `${(data.correctedFuelVolume - data.rawFuelVolume).toFixed(1)} L`;

    const valPitch = document.getElementById('tilt-val-pitch');
    if (valPitch) valPitch.textContent = `${data.pitch > 0 ? '+' : ''}${data.pitch.toFixed(1)}°`;

    const valRoll = document.getElementById('tilt-val-roll');
    if (valRoll) valRoll.textContent = `${data.roll > 0 ? '+' : ''}${data.roll.toFixed(1)}°`;

    const valHraw = document.getElementById('tilt-val-hraw');
    if (valHraw) valHraw.textContent = `${data.rawFuelHeight} mm`;

    const valHcorr = document.getElementById('tilt-val-hcorr');
    if (valHcorr) valHcorr.textContent = `${data.correctedFuelHeight} mm`;

    this.drawTankCanvas(data.pitch, data.roll, data.fuelPercent);
    if (this.tiltChart && data.history) {
      this.tiltChart.data.labels = data.history.timestamps;
      this.tiltChart.data.datasets[0].data = data.history.rawFuel;
      this.tiltChart.data.datasets[1].data = data.history.correctedFuel;
      this.tiltChart.update('none');
    }
  }

  drawTankCanvas(pitch, roll, fuelPercent) {
    const canvas = document.getElementById('tank-tilt-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth || 550;
    canvas.height = canvas.clientHeight || 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const angleRad = (pitch * Math.PI) / 180;
    ctx.rotate(angleRad);

    const w = 360;
    const h = 160;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.7)';
    ctx.strokeRect(-w / 2, -h / 2, w, h);

    const fillH = (h * (fuelPercent / 100));
    const liquidY = (h / 2) - fillH;

    ctx.save();
    ctx.rotate(-angleRad);

    ctx.fillStyle = 'rgba(0, 230, 118, 0.4)';
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.rect(-w / 2 + 5, liquidY - (Math.tan(angleRad) * (w / 2)), w - 10, fillH + 20);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = '#ff3d71';
    ctx.beginPath();
    ctx.arc(0, h / 2, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText('DYP-L02 Ultrasonic Sensor Transceiver', -110, (h / 2) + 24);

    ctx.restore();
  }

  renderCharts(data) {
    if (typeof Chart === 'undefined') return;

    const ctx = document.getElementById('chart-tilt-comparison');
    if (!ctx) return;
    if (this.tiltChart) this.tiltChart.destroy();

    const labels = data.history ? data.history.timestamps : ['10:00', '10:05', '10:10'];

    this.tiltChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Raw Fuel Height (Uncompensated - DYP-L02)',
            data: data.history ? data.history.rawFuel : [320, 318, 318],
            borderColor: '#ffb300',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Tilt-Compensated Fuel Level (MPU6050 Filtered)',
            data: data.history ? data.history.correctedFuel : [326, 325, 325],
            borderColor: '#00e676',
            backgroundColor: 'rgba(0, 230, 118, 0.12)',
            borderWidth: 3,
            pointRadius: 0,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#fff', font: { size: 13 } } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 200, max: 420 }
        }
      }
    });
  }
}

window.TiltComponent = TiltComponent;
