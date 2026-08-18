/**
 * Slide 4: Dedicated Fuel Monitoring Component
 * Sensors: DYP-L02 Ultrasonic Fuel Level Sensor + OF06ZAT Digital Pulse Fuel Flow Sensor
 * Zero-Blinking In-Place Telemetry Updates
 */

class FuelComponent {
  constructor() {
    this.fuelLevelChart = null;
    this.fuelConsTimeChart = null;
    this.fuelConsDistChart = null;
  }

  render(container, data) {
    if (container.querySelector('#chart-fuel-level')) {
      this.updateInPlace(data);
      return;
    }

    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-gas-pump"></i> 4. Fuel Level & Flow Telematics</h2>
          <div class="page-subtitle" style="font-size: 14px;">Hardware Architecture: DYP-L02 Ultrasonic Level Sensor + OF06ZAT Flow Sensor</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="sim-btn ${data.isFuelTheftDetected ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px;" onclick="window.telemetryEngine.toggleFuelTheft()">
            <i class="fa-solid fa-user-ninja"></i> ${data.isFuelTheftDetected ? 'Stop Fuel Theft Sim' : 'Simulate Fuel Theft'}
          </button>
        </div>
      </div>

      <!-- Fuel Theft Alert Banner if active -->
      <div id="fuel-theft-banner-container">
        ${data.isFuelTheftDetected ? `
          <div class="alert-banner" style="margin-bottom: 24px;">
            <div class="alert-banner-content">
              <i class="fa-solid fa-shield-cat"></i>
              <div class="alert-banner-text">
                <h3>POSSIBLE FUEL THEFT DETECTED</h3>
                <p>Vehicle ${data.vehicleId} is stationary with engine OFF. Ultrasonic sensor DYP-L02 reported a sudden drop of >30.0 L in under 60 seconds.</p>
              </div>
            </div>
            <button class="sim-btn active" onclick="window.telemetryEngine.resetAllTriggers()">Acknowledge Alert</button>
          </div>
        ` : ''}
      </div>

      <!-- Hardware Sensor Architecture Banner -->
      <div class="grid-container grid-cols-2" style="margin-bottom: 24px;">
        <div class="card" style="background: rgba(0, 210, 255, 0.04); border-color: rgba(0, 210, 255, 0.2); padding: 20px;">
          <div class="card-header">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-microchip"></i> Fuel Level Sensor</span>
            <span class="card-tag sensor">DYP-L02 ULTRASONIC</span>
          </div>
          <div style="font-size: 13px; color: var(--text-muted);">
            Non-contact ultrasonic transceiver mounted externally at the bottom of the diesel tank. Measures liquid height without tank perforation.
          </div>
          <div style="display: flex; gap: 20px; margin-top: 14px;">
            <div><span style="font-size: 12px; color: var(--text-dim);">Fuel Height:</span> <strong style="color:#fff;" id="fuel-val-h">${data.rawFuelHeight} mm</strong></div>
            <div><span style="font-size: 12px; color: var(--text-dim);">Tank Capacity:</span> <strong style="color:#fff;">${data.tankCapacity} L</strong></div>
          </div>
        </div>

        <div class="card" style="background: rgba(58, 134, 255, 0.04); border-color: rgba(58, 134, 255, 0.2); padding: 20px;">
          <div class="card-header">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-faucet-drip"></i> Fuel Flow Sensor</span>
            <span class="card-tag sensor">OF06ZAT FLOW METER</span>
          </div>
          <div style="font-size: 13px; color: var(--text-muted);">
            Positive displacement oval gear pulse sensor inline with diesel supply line. Feeds high-precision digital pulses to Arduino Nano hardware interrupt.
          </div>
          <div style="display: flex; gap: 20px; margin-top: 14px;">
            <div><span style="font-size: 12px; color: var(--text-dim);">Instant Flow:</span> <strong style="color:#fff;" id="fuel-val-flow">${data.instantConsumption.toFixed(1)} L/h</strong></div>
            <div><span style="font-size: 12px; color: var(--text-dim);">Economy:</span> <strong style="color:#fff;" id="fuel-val-econ">${data.fuelEconomy} km/L</strong></div>
          </div>
        </div>
      </div>

      <!-- Fuel Level KPIs -->
      <div class="grid-container grid-cols-4" style="margin-bottom: 24px;">
        <div class="card metric-box" style="padding: 20px;">
          <div class="card-header">
            <span class="card-title">Fuel Level (%)</span>
            <span class="card-tag sensor">DYP-L02</span>
          </div>
          <div class="metric-val" id="fuel-val-pct" style="color: ${data.fuelPercent < 25 ? 'var(--danger)' : 'var(--success)'}; font-size: 32px;">
            ${data.fuelPercent.toFixed(1)} <span class="metric-unit">%</span>
          </div>
          <div style="width: 100%; background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 8px;">
            <div id="fuel-bar-fill" style="width: ${data.fuelPercent}%; height: 100%; background: ${data.fuelPercent < 25 ? 'var(--danger)' : 'var(--success)'}; transition: width 0.5s;"></div>
          </div>
          <div class="metric-label" style="margin-top: 8px;" id="fuel-val-rem">Remaining Volume: ${data.correctedFuelVolume.toFixed(1)} L</div>
        </div>

        <div class="card metric-box" style="padding: 20px;">
          <div class="card-header">
            <span class="card-title">Estimated Range</span>
            <span class="card-tag ai">AI ESTIMATE</span>
          </div>
          <div class="metric-val" id="fuel-val-range" style="font-size: 32px;">${data.estimatedRange} <span class="metric-unit">km</span></div>
          <div class="metric-label">Based on avg 32.6 L/100km</div>
          <div class="metric-trend up"><i class="fa-solid fa-route"></i> Next Fuel Station in 85 km</div>
        </div>

        <div class="card metric-box" style="padding: 20px;">
          <div class="card-header">
            <span class="card-title">Avg Consumption</span>
            <span class="card-tag sensor">OF06ZAT</span>
          </div>
          <div class="metric-val" id="fuel-val-avg" style="font-size: 32px;">${data.avgConsumption} <span class="metric-unit">L/100km</span></div>
          <div class="metric-label">Trip Consumed: ${data.tripFuelConsumed} L</div>
          <div class="metric-trend"><i class="fa-solid fa-fill-drip"></i> Total Lifetime: ${data.totalFuelConsumed.toLocaleString()} L</div>
        </div>

        <div class="card metric-box" style="padding: 20px;">
          <div class="card-header">
            <span class="card-title">Anomaly Status</span>
            <span class="card-tag ai">AI SAFETY</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
            <span class="event-pill ${data.isFuelTheftDetected ? 'alert' : 'ok'}">
              <i class="fa-solid fa-shield"></i> ${data.isFuelTheftDetected ? 'Theft Detected' : 'No Theft Detected'}
            </span>
            <span class="event-pill ${data.isFuelLeakDetected ? 'alert' : 'ok'}">
              <i class="fa-solid fa-oil-can"></i> ${data.isFuelLeakDetected ? 'Leakage Flagged' : 'No Leakage'}
            </span>
          </div>
        </div>
      </div>

      <!-- Fuel Analytics Graphs -->
      <div class="grid-container grid-cols-3">
        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-area"></i> Fuel Volume vs Time</span>
            <span class="card-tag sensor">DYP-L02</span>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chart-fuel-level"></canvas>
          </div>
        </div>

        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-line"></i> Consumption (L/h) vs Time</span>
            <span class="card-tag sensor">OF06ZAT</span>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chart-fuel-cons-time"></canvas>
          </div>
        </div>

        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-column"></i> Consumption vs Distance</span>
            <span class="card-tag ai">L/100KM</span>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chart-fuel-cons-dist"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.renderCharts(data);
    }, 100);
  }

  updateInPlace(data) {
    const valPct = document.getElementById('fuel-val-pct');
    if (valPct) valPct.innerHTML = `${data.fuelPercent.toFixed(1)} <span class="metric-unit">%</span>`;

    const barFill = document.getElementById('fuel-bar-fill');
    if (barFill) barFill.style.width = `${data.fuelPercent}%`;

    const valRem = document.getElementById('fuel-val-rem');
    if (valRem) valRem.textContent = `Remaining Volume: ${data.correctedFuelVolume.toFixed(1)} L`;

    const valFlow = document.getElementById('fuel-val-flow');
    if (valFlow) valFlow.textContent = `${data.instantConsumption.toFixed(1)} L/h`;

    const valH = document.getElementById('fuel-val-h');
    if (valH) valH.textContent = `${data.rawFuelHeight} mm`;

    if (data.history) {
      if (this.fuelLevelChart) {
        this.fuelLevelChart.data.labels = data.history.timestamps;
        this.fuelLevelChart.data.datasets[0].data = data.history.correctedFuel;
        this.fuelLevelChart.update('none');
      }
      if (this.fuelConsTimeChart) {
        this.fuelConsTimeChart.data.labels = data.history.timestamps;
        this.fuelConsTimeChart.data.datasets[0].data = data.history.fuelConsumption;
        this.fuelConsTimeChart.update('none');
      }
    }
  }

  renderCharts(data) {
    if (typeof Chart === 'undefined') return;

    const labels = data.history ? data.history.timestamps : ['10:00', '10:05', '10:10'];

    const ctxLevel = document.getElementById('chart-fuel-level');
    if (ctxLevel) {
      if (this.fuelLevelChart) this.fuelLevelChart.destroy();
      this.fuelLevelChart = new Chart(ctxLevel, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Fuel Level (L)',
            data: data.history ? data.history.correctedFuel : [326, 325, 325],
            borderColor: data.isFuelTheftDetected ? '#ff3d71' : '#00e676',
            backgroundColor: data.isFuelTheftDetected ? 'rgba(255, 61, 113, 0.15)' : 'rgba(0, 230, 118, 0.1)',
            fill: true,
            tension: 0.2,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 150, max: 450 }
          }
        }
      });
    }

    const ctxConsTime = document.getElementById('chart-fuel-cons-time');
    if (ctxConsTime) {
      if (this.fuelConsTimeChart) this.fuelConsTimeChart.destroy();
      this.fuelConsTimeChart = new Chart(ctxConsTime, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Instant Flow (L/h)',
            data: data.history ? data.history.fuelConsumption : [27, 28, 28.4],
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 0, max: 60 }
          }
        }
      });
    }

    const ctxConsDist = document.getElementById('chart-fuel-cons-dist');
    if (ctxConsDist) {
      if (this.fuelConsDistChart) this.fuelConsDistChart.destroy();
      const distLabels = ['0-50 km', '50-100 km', '100-150 km', '150-200 km', '200-250 km', '250-300 km'];
      const distData = [31.2, 33.5, 30.8, 34.1, 32.6, 31.9];

      this.fuelConsDistChart = new Chart(ctxConsDist, {
        type: 'bar',
        data: {
          labels: distLabels,
          datasets: [{
            label: 'L/100 km',
            data: distData,
            backgroundColor: 'rgba(0, 210, 255, 0.4)',
            borderColor: '#00d2ff',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 20, max: 40 }
          }
        }
      });
    }
  }
}

window.FuelComponent = FuelComponent;
