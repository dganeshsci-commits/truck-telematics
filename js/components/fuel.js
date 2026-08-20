/**
 * Slide 3: Dedicated Fuel Monitoring Component
 * Features:
 * 1. Tank Capacity (450 L), Fuel Height (mm), and Fuel Flow Rate (L/h) Primary Parameters
 * 2. Trip Details Summary (Trip No, Date, Trip Distance, Trip Fuel Consumed, Avg Economy)
 * 3. Fuel Volume vs Time Graph (1-Min Sampling Rate / 0.016 Hz)
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
          <h2 style="font-size: 22px;"><i class="fa-solid fa-gas-pump"></i> 3. Fuel Monitoring & Telematics</h2>
          <div class="page-subtitle" style="font-size: 14px;">Real-time Diesel Tank Telematics, Flow Dynamics & Trip Fuel Analytics</div>
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
                <p>Vehicle ${data.vehicleId} is stationary with engine OFF. Ultrasonic sensor reported a sudden drop of >30.0 L in under 60 seconds.</p>
              </div>
            </div>
            <button class="sim-btn active" onclick="window.telemetryEngine.resetAllTriggers()">Acknowledge Alert</button>
          </div>
        ` : ''}
      </div>

      <!-- Primary Parameters: Tank Capacity, Fuel Height, Fuel Flow Rate + Trip Details -->
      <div class="grid-container grid-cols-12" style="margin-bottom: 24px;">
        <!-- Card 1: Tank & Flow Parameters -->
        <div class="card span-7" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-cubes"></i> Fuel Tank & Flow Parameters</span>
            <span class="card-tag sensor">REALTIME TELEMETRY</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div class="card metric-box" style="background: rgba(0, 0, 0, 0.4); padding: 14px; text-align: center;">
              <div class="metric-label" style="font-size: 11px;">Tank Capacity</div>
              <div class="metric-val" style="font-size: 24px; color: var(--primary); font-weight: 800;">${data.tankCapacity.toFixed(1)} <span class="metric-unit">L</span></div>
              <div class="metric-trend" style="justify-content: center; font-size: 10px;">Volvo Dual Diesel Tank</div>
            </div>

            <div class="card metric-box" style="background: rgba(0, 0, 0, 0.4); padding: 14px; text-align: center;">
              <div class="metric-label" style="font-size: 11px;">Fuel Height</div>
              <div class="metric-val" id="fuel-val-h" style="font-size: 24px; color: var(--success); font-weight: 800;">${data.rawFuelHeight.toFixed(1)} <span class="metric-unit">mm</span></div>
              <div class="metric-trend" style="justify-content: center; font-size: 10px;">Ultrasonic Level</div>
            </div>

            <div class="card metric-box" style="background: rgba(0, 0, 0, 0.4); padding: 14px; text-align: center;">
              <div class="metric-label" style="font-size: 11px;">Fuel Flow Rate</div>
              <div class="metric-val" id="fuel-val-flow" style="font-size: 24px; color: var(--warning); font-weight: 800;">${data.instantConsumption.toFixed(1)} <span class="metric-unit">L/h</span></div>
              <div class="metric-trend" style="justify-content: center; font-size: 10px;">Inline Digital Flow</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,210,255,0.04); border: 1px solid rgba(0,210,255,0.2); border-radius: var(--radius-md); padding: 12px 16px; margin-top: 16px; font-size: 12px;">
            <div><span>Remaining Volume:</span> <strong style="color: var(--success);" id="fuel-val-rem">${data.correctedFuelVolume.toFixed(1)} L (${data.fuelPercent.toFixed(1)}%)</strong></div>
            <div><span>Estimated Range:</span> <strong style="color: var(--primary);" id="fuel-val-range">${data.estimatedRange} km</strong></div>
          </div>
        </div>

        <!-- Card 2: Trip Details in Fuel Monitoring -->
        <div class="card span-5" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-header" style="margin-bottom: 14px;">
              <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-route"></i> Trip Fuel Details</span>
              <span class="card-tag ai">TRIP SUMMARY</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                <span style="color: var(--text-muted);">Trip Number:</span>
                <strong style="color: #fff;" id="fuel-val-tripno">${data.tripNo || '#TRIP-026'}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                <span style="color: var(--text-muted);">Trip Date:</span>
                <strong style="color: var(--text-main);" id="fuel-val-tripdate">${data.tripDate || '2026-08-18'}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                <span style="color: var(--text-muted);">Trip Distance Traveled:</span>
                <strong style="color: var(--primary);">${data.tripDistance} km</strong>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                <span style="color: var(--text-muted);">Total Fuel Consumed:</span>
                <strong style="color: var(--warning);">${data.tripFuelConsumed} L</strong>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: var(--text-muted);">Avg Fuel Economy:</span>
                <strong style="color: var(--success);" id="fuel-val-econ">${data.fuelEconomy} km/L (${data.avgConsumption} L/100km)</strong>
              </div>
            </div>
          </div>

          <div style="background: rgba(0, 230, 118, 0.05); border: 1px solid rgba(0, 230, 118, 0.2); border-radius: var(--radius-md); padding: 10px 14px; font-size: 11px; color: var(--text-muted); margin-top: 14px;">
            <i class="fa-solid fa-leaf" style="color: var(--success);"></i> Trip fuel efficiency operating within nominal eco-driving limits.
          </div>
        </div>
      </div>

      <!-- Fuel Analytics Graphs -->
      <div class="grid-container grid-cols-3">
        <!-- Fuel Volume vs Time Graph (1-Min Sampling Rate / 0.016 Hz) -->
        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-area"></i> Fuel Volume vs Time</span>
            <span class="card-tag sensor">1 MIN INTERVAL (0.016 Hz)</span>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chart-fuel-level"></canvas>
          </div>
        </div>

        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-line"></i> Consumption (L/h) vs Time</span>
            <span class="card-tag sensor">1 MIN INTERVAL</span>
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
    const valH = document.getElementById('fuel-val-h');
    if (valH) valH.innerHTML = `${data.rawFuelHeight.toFixed(1)} <span class="metric-unit">mm</span>`;

    const valFlow = document.getElementById('fuel-val-flow');
    if (valFlow) valFlow.innerHTML = `${data.instantConsumption.toFixed(1)} <span class="metric-unit">L/h</span>`;

    const valRem = document.getElementById('fuel-val-rem');
    if (valRem) valRem.textContent = `${data.correctedFuelVolume.toFixed(1)} L (${data.fuelPercent.toFixed(1)}%)`;

    const valRange = document.getElementById('fuel-val-range');
    if (valRange) valRange.textContent = `${data.estimatedRange} km`;

    const valTripNo = document.getElementById('fuel-val-tripno');
    if (valTripNo) valTripNo.textContent = data.tripNo || '#TRIP-026';

    const valTripDate = document.getElementById('fuel-val-tripdate');
    if (valTripDate) valTripDate.textContent = data.tripDate || '2026-08-18';

    const valEcon = document.getElementById('fuel-val-econ');
    if (valEcon) valEcon.textContent = `${data.fuelEconomy} km/L (${data.avgConsumption} L/100km)`;

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

    // 1-Minute Interval Labels
    const labels = data.history ? data.history.timestamps : ['10:00', '10:01', '10:02', '10:03', '10:04', '10:05'];

    const ctxLevel = document.getElementById('chart-fuel-level');
    if (ctxLevel) {
      if (this.fuelLevelChart) this.fuelLevelChart.destroy();
      this.fuelLevelChart = new Chart(ctxLevel, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Fuel Volume (L) [1-Min Interval]',
            data: data.history ? data.history.correctedFuel : [326, 325.5, 325.2, 325, 324.8, 324.5],
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
            x: { 
              grid: { color: 'rgba(255,255,255,0.05)' }, 
              ticks: { color: '#8a99ad', font: { size: 11 } },
              title: { display: true, text: 'Time (1-Minute Intervals)', color: '#5c6b80', font: { size: 10 } }
            },
            y: { 
              grid: { color: 'rgba(255,255,255,0.05)' }, 
              ticks: { color: '#8a99ad', font: { size: 11 } }, 
              min: 150, 
              max: 450,
              title: { display: true, text: 'Volume (L)', color: '#5c6b80', font: { size: 10 } }
            }
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
            data: data.history ? data.history.fuelConsumption : [27, 28, 28.4, 28.1, 28.3, 28.4],
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
