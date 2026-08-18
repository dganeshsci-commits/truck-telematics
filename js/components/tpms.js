/**
 * Slide 5: TPMS Tyre Pressure Component
 * Embedded Top View Image Asset of Volvo FH Truck Chassis & Wheel Telematics
 * Alert Policy: Gives alert ONLY after pressure changes below minimum safety pressure (<95 PSI)
 */

class TPMSComponent {
  constructor() {
    this.pressChart = null;
    this.tempChart = null;
  }

  render(container, data) {
    const tyres = data.tpms || [];
    const activePressureAlerts = tyres.filter(t => t.press < 95.0 || t.temp > 65.0 || t.status === 'CRITICAL');

    if (container.querySelector('#chart-tyre-press')) {
      this.updateInPlace(data, tyres, activePressureAlerts);
      return;
    }

    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-compact-disc"></i> 5. Tyre Pressure & Top View Telematics</h2>
          <div class="page-subtitle" style="font-size: 14px;">Real-time 433 MHz RF sensor telemetry with minimum threshold alert triggers</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="sim-btn ${data.flags?.tyreLeakActive ? 'active' : ''}" style="padding: 8px 16px; font-size: 12px;" onclick="window.telemetryEngine.toggleTyreLeak()">
            <i class="fa-solid fa-triangle-exclamation"></i> ${data.flags?.tyreLeakActive ? 'Reset Pressure Leak Sim' : 'Simulate Rear-Left Pressure Loss (<95 PSI)'}
          </button>
        </div>
      </div>

      <!-- Threshold Alert Banner (Only displays when pressure drops below minimum pressure!) -->
      <div id="tpms-alert-banner-container">
        ${this.renderAlertBannerHTML(activePressureAlerts)}
      </div>

      <!-- Top View Truck & Tyre Layout Grid -->
      <div class="grid-container grid-cols-12" style="margin-bottom: 24px;">
        <div class="card span-7" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-truck-monster"></i> Top View Volvo FH Truck Chassis & Wheel Layout</span>
            <span class="card-tag sensor">433 MHz RF TPMS</span>
          </div>

          <div class="tpms-layout" style="padding: 10px 0;">
            <div class="truck-axle-grid" style="grid-template-columns: 1fr 160px 1fr; gap: 20px; align-items: center;">
              <!-- Left Wheels Column -->
              <div style="display: flex; flex-direction: column; gap: 24px;" id="tpms-left-wheels">
                ${this.renderTyreCard(tyres[0] || { pos: 'Front Left', press: 105, temp: 42, id: 'FL' })}
                ${this.renderTyreCard(tyres[2] || { pos: 'Rear Left (Inner)', press: 96.4, temp: 68, id: 'RL1' })}
                ${this.renderTyreCard(tyres[3] || { pos: 'Rear Left (Outer)', press: 106, temp: 43, id: 'RL2' })}
              </div>

              <!-- Embedded Top View Image Asset of Volvo FH Truck -->
              <div style="
                height: 480px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 14px 6px;
                position: relative;
              ">
                <div style="font-weight: 800; color: var(--primary); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                  TOP VIEW FRONT
                </div>
                
                <img 
                  src="assets/volvo_truck_top_view.png" 
                  alt="Volvo FH Truck Top View Schematic" 
                  style="max-height: 400px; width: 100%; object-fit: contain; filter: drop-shadow(0 0 12px rgba(0, 210, 255, 0.5));"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />

                <div style="display: none; color: var(--text-dim); font-size: 12px; text-align: center; flex-direction: column; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-truck-front" style="font-size: 56px; color: rgba(0,210,255,0.4);"></i>
                  <span style="font-weight: 700; color: #fff;">VOLVO FH 6x2</span>
                </div>

                <div style="font-weight: 800; color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
                  TOP VIEW REAR
                </div>
              </div>

              <!-- Right Wheels Column -->
              <div style="display: flex; flex-direction: column; gap: 24px;" id="tpms-right-wheels">
                ${this.renderTyreCard(tyres[1] || { pos: 'Front Right', press: 105, temp: 42, id: 'FR' })}
                ${this.renderTyreCard(tyres[4] || { pos: 'Rear Right (Inner)', press: 105, temp: 42, id: 'RR1' })}
                ${this.renderTyreCard(tyres[5] || { pos: 'Rear Right (Outer)', press: 105, temp: 42, id: 'RR2' })}
              </div>
            </div>
          </div>
        </div>

        <!-- Minimum Threshold Alert Policy Card -->
        <div class="card span-5" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-header" style="margin-bottom: 16px;">
              <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-shield-halved"></i> Minimum Pressure Alert Logic</span>
              <span class="card-tag ai">ALERT RULE</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px;">
              <div style="background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.3); padding: 16px; border-radius: var(--radius-md);">
                <div style="font-size: 13px; font-weight: 700; color: var(--success);">Normal Cold Pressure Baseline</div>
                <div style="font-size: 24px; font-weight: 900; color: #fff; margin-top: 2px;">105.0 PSI</div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Standard commercial Volvo heavy-duty inflation level</div>
              </div>

              <div style="background: rgba(255,61,113,0.1); border: 1px solid rgba(255,61,113,0.4); padding: 16px; border-radius: var(--radius-md);">
                <div style="font-size: 13px; font-weight: 700; color: var(--danger);">Minimum Safety Pressure Threshold</div>
                <div style="font-size: 20px; color: #fff; font-weight: 800; margin-top: 2px;">95.0 PSI</div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px; line-height: 1.5;">
                  System triggers acoustic & telematics alert <strong>ONLY when pressure drops below 95.0 PSI</strong> or when a rapid leak occurs.
                </div>
              </div>
            </div>
          </div>

          <div style="background: rgba(0, 210, 255, 0.05); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: var(--radius-md); padding: 14px; font-size: 12px; color: var(--text-muted); margin-top: 16px;">
            <i class="fa-solid fa-microchip" style="color:var(--primary);"></i> 433 MHz RF receivers update wheel pressure & temp at 1 Hz intervals.
          </div>
        </div>
      </div>

      <!-- Tyre Telematics Analytics Charts -->
      <div class="grid-container grid-cols-2">
        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-chart-line"></i> Tyre Pressure vs Time (PSI)</span>
            <span class="card-tag sensor">REALTIME TPMS</span>
          </div>
          <div style="height: 300px; position: relative;">
            <canvas id="chart-tyre-press"></canvas>
          </div>
        </div>

        <div class="card" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-temperature-three-quarters"></i> Tyre Temperature vs Time (°C)</span>
            <span class="card-tag sensor">THERMAL SENSORS</span>
          </div>
          <div style="height: 300px; position: relative;">
            <canvas id="chart-tyre-temp"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.renderCharts(data);
    }, 100);
  }

  renderAlertBannerHTML(activePressureAlerts) {
    if (activePressureAlerts.length > 0) {
      return `
        <div class="alert-banner" style="margin-bottom: 24px; padding: 16px 24px;">
          <div class="alert-banner-content">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 24px;"></i>
            <div class="alert-banner-text">
              <h3 style="font-size: 16px;">LOW TYRE PRESSURE ALERT TRIGGERED</h3>
              <p style="font-size: 13px;">Minimum safety pressure threshold (95.0 PSI) breached on ${activePressureAlerts.map(t => `${t.pos} (${t.press.toFixed(1)} PSI)`).join(', ')}. Action required.</p>
            </div>
          </div>
          <button class="sim-btn active" style="padding: 8px 16px; font-size: 12px;" onclick="window.telemetryEngine.resetAllTriggers()">Clear Alert</button>
        </div>
      `;
    } else {
      return `
        <div class="card" style="background: rgba(0, 230, 118, 0.05); border: 1px solid rgba(0, 230, 118, 0.25); margin-bottom: 24px; padding: 16px 24px;">
          <div style="display: flex; align-items: center; gap: 14px; font-size: 14px; color: var(--success); font-weight: 700;">
            <i class="fa-solid fa-circle-check" style="font-size: 22px;"></i>
            All 6 tyre pressures are operating above minimum threshold (95.0 PSI). Chassis telemetry nominal.
          </div>
        </div>
      `;
    }
  }

  updateInPlace(data, tyres, activePressureAlerts) {
    const bannerContainer = document.getElementById('tpms-alert-banner-container');
    if (bannerContainer) bannerContainer.innerHTML = this.renderAlertBannerHTML(activePressureAlerts);

    const leftCol = document.getElementById('tpms-left-wheels');
    if (leftCol && tyres.length >= 4) {
      leftCol.innerHTML = `
        ${this.renderTyreCard(tyres[0])}
        ${this.renderTyreCard(tyres[2])}
        ${this.renderTyreCard(tyres[3])}
      `;
    }

    const rightCol = document.getElementById('tpms-right-wheels');
    if (rightCol && tyres.length >= 6) {
      rightCol.innerHTML = `
        ${this.renderTyreCard(tyres[1])}
        ${this.renderTyreCard(tyres[4])}
        ${this.renderTyreCard(tyres[5])}
      `;
    }

    if (data.history) {
      if (this.pressChart) {
        this.pressChart.data.labels = data.history.timestamps;
        if (data.history.tyrePressures) {
          this.pressChart.data.datasets[0].data = data.history.tyrePressures[0];
          this.pressChart.data.datasets[1].data = data.history.tyrePressures[1];
          this.pressChart.data.datasets[2].data = data.history.tyrePressures[2];
          this.pressChart.data.datasets[3].data = data.history.tyrePressures[5];
        }
        this.pressChart.update('none');
      }
      if (this.tempChart) {
        this.tempChart.data.labels = data.history.timestamps;
        if (data.history.tyreTemps) {
          this.tempChart.data.datasets[0].data = data.history.tyreTemps[0];
          this.tempChart.data.datasets[1].data = data.history.tyreTemps[2];
        }
        this.tempChart.update('none');
      }
    }
  }

  renderTyreCard(tyre) {
    const press = tyre.press || 105;
    const temp = tyre.temp || 42;
    const isBelowMin = press < 95.0;
    const isCrit = tyre.status === 'CRITICAL' || isBelowMin;
    const statusText = isBelowMin ? 'BELOW 95 PSI ALERT' : (tyre.status || 'NORMAL');
    const statusColor = isCrit ? 'var(--danger)' : (tyre.status === 'WARNING' ? 'var(--warning)' : 'var(--success)');

    return `
      <div class="tyre-card ${isCrit ? 'critical' : (tyre.status === 'WARNING' ? 'warning' : 'normal')}" style="padding: 14px 16px;">
        <div class="tyre-header" style="font-size: 13px;">
          <span>${tyre.pos}</span>
          <span style="color: ${statusColor}; font-weight: 800; font-size: 11px;">${statusText}</span>
        </div>
        <div class="tyre-body" style="margin: 8px 0;">
          <div class="tyre-press" style="color: ${isBelowMin ? 'var(--danger)' : '#fff'}; font-size: 22px; font-weight: 800;">${press.toFixed(1)} <span style="font-size: 12px; color: var(--text-muted);">PSI</span></div>
          <div class="tyre-temp" style="font-size: 14px;">${temp.toFixed(1)}°C</div>
        </div>
        <div style="font-size: 10px; font-family: monospace; color: var(--text-dim);">
          RF ID: ${tyre.id}
        </div>
      </div>
    `;
  }

  renderCharts(data) {
    if (typeof Chart === 'undefined') return;

    const labels = data.history ? data.history.timestamps : ['10:00', '10:05', '10:10'];

    const ctxP = document.getElementById('chart-tyre-press');
    if (ctxP) {
      if (this.pressChart) this.pressChart.destroy();
      this.pressChart = new Chart(ctxP, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Front Left', data: data.history ? data.history.tyrePressures[0] : [105, 105.2], borderColor: '#00d2ff', borderWidth: 2, pointRadius: 0 },
            { label: 'Front Right', data: data.history ? data.history.tyrePressures[1] : [104, 104.8], borderColor: '#3a86ff', borderWidth: 2, pointRadius: 0 },
            { label: 'Rear Left (Inner)', data: data.history ? data.history.tyrePressures[2] : [98, 96.4], borderColor: '#ff3d71', borderWidth: 3, pointRadius: 0 },
            { label: 'Rear Right (Outer)', data: data.history ? data.history.tyrePressures[5] : [105, 105.8], borderColor: '#00e676', borderWidth: 2, pointRadius: 0 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#8a99ad', font: { size: 11 } } } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 65, max: 120 }
          }
        }
      });
    }

    const ctxT = document.getElementById('chart-tyre-temp');
    if (ctxT) {
      if (this.tempChart) this.tempChart.destroy();
      this.tempChart = new Chart(ctxT, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Front Left', data: data.history ? data.history.tyreTemps[0] : [40, 42.1], borderColor: '#00d2ff', borderWidth: 2, pointRadius: 0 },
            { label: 'Rear Left (Inner)', data: data.history ? data.history.tyreTemps[2] : [50, 68.2], borderColor: '#ffb300', borderWidth: 3, pointRadius: 0 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#8a99ad', font: { size: 11 } } } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad', font: { size: 11 } }, min: 20, max: 90 }
          }
        }
      });
    }
  }
}

window.TPMSComponent = TPMSComponent;
