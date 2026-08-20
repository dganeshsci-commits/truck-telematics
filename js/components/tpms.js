/**
 * Slide 4: TPMS Tyre Pressure Component
 * Features:
 * 1. Enlarged Fitted Top View Volvo FH Truck Chassis & Wheel Sensor Layout
 * 2. Reduced & Compact Minimum Safety Threshold Alert Logic (<95 PSI)
 */

class TPMSComponent {
  render(container, data) {
    const tyres = data.tpms || [];
    const activePressureAlerts = tyres.filter(t => t.press < 95.0 || t.temp > 65.0 || t.status === 'CRITICAL');

    if (container.querySelector('#tpms-left-wheels')) {
      this.updateInPlace(data, tyres, activePressureAlerts);
      return;
    }

    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-compact-disc"></i> 4. Tyre Pressure & Top View Telematics</h2>
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

      <!-- Top View Truck & Tyre Layout Grid (Expanded 8-col / 4-col split for large fitted top view image) -->
      <div class="grid-container grid-cols-12">
        <div class="card span-8" style="padding: 20px;">
          <div class="card-header" style="margin-bottom: 16px;">
            <span class="card-title" style="font-size: 15px;"><i class="fa-solid fa-truck-monster"></i> Top View Volvo FH Truck Chassis & Wheel Layout</span>
            <span class="card-tag sensor">433 MHz RF TPMS</span>
          </div>

          <div class="tpms-layout" style="padding: 10px 0;">
            <div class="truck-axle-grid" style="grid-template-columns: 1fr 240px 1fr; gap: 24px; align-items: center;">
              <!-- Left Wheels Column -->
              <div style="display: flex; flex-direction: column; gap: 24px;" id="tpms-left-wheels">
                ${this.renderTyreCard(tyres[0] || { pos: 'Front Left', press: 105, temp: 42, id: 'FL' })}
                ${this.renderTyreCard(tyres[2] || { pos: 'Rear Left (Inner)', press: 96.4, temp: 68, id: 'RL1' })}
                ${this.renderTyreCard(tyres[3] || { pos: 'Rear Left (Outer)', press: 106, temp: 43, id: 'RL2' })}
              </div>

              <!-- Enlarged Fitted Top View Image Asset of Volvo FH Truck -->
              <div style="
                height: 560px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 16px 8px;
                position: relative;
                box-shadow: inset 0 0 20px rgba(0, 210, 255, 0.08);
              ">
                <div style="font-weight: 800; color: var(--primary); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                  TOP VIEW FRONT
                </div>
                
                <img 
                  src="assets/volvo_truck_top_view.png" 
                  alt="Volvo FH Truck Top View Schematic" 
                  style="height: 480px; width: 100%; object-fit: contain; filter: drop-shadow(0 0 16px rgba(0, 210, 255, 0.6));"
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

        <!-- Reduced & Compact Minimum Pressure Alert Logic Card -->
        <div class="card span-4" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-header" style="margin-bottom: 14px;">
              <span class="card-title" style="font-size: 14px;"><i class="fa-solid fa-shield-halved"></i> Pressure Alert Logic</span>
              <span class="card-tag ai" style="font-size: 9px; padding: 1px 6px;">POLICY</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px;">
              <div style="background: rgba(0,230,118,0.06); border: 1px solid rgba(0,230,118,0.25); padding: 12px; border-radius: var(--radius-md);">
                <div style="font-size: 11px; font-weight: 700; color: var(--success);">Normal Baseline</div>
                <div style="font-size: 20px; font-weight: 800; color: #fff; margin-top: 1px;">105.0 PSI</div>
              </div>

              <div style="background: rgba(255,61,113,0.08); border: 1px solid rgba(255,61,113,0.3); padding: 12px; border-radius: var(--radius-md);">
                <div style="font-size: 11px; font-weight: 700; color: var(--danger);">Min Threshold</div>
                <div style="font-size: 20px; color: #fff; font-weight: 800; margin-top: 1px;">95.0 PSI</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
                  Triggers alert when pressure drops below <strong>95.0 PSI</strong>.
                </div>
              </div>
            </div>
          </div>

          <div style="background: rgba(0, 210, 255, 0.05); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: var(--radius-md); padding: 10px 12px; font-size: 11px; color: var(--text-muted); margin-top: 14px;">
            <i class="fa-solid fa-microchip" style="color:var(--primary);"></i> 433 MHz RF update rate: 1 Hz.
          </div>
        </div>
      </div>
    `;
  }

  renderAlertBannerHTML(activePressureAlerts) {
    if (activePressureAlerts.length > 0) {
      return `
        <div class="alert-banner" style="margin-bottom: 20px; padding: 14px 20px;">
          <div class="alert-banner-content">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 22px;"></i>
            <div class="alert-banner-text">
              <h3 style="font-size: 15px;">LOW TYRE PRESSURE ALERT TRIGGERED</h3>
              <p style="font-size: 12px;">Minimum safety pressure threshold (95.0 PSI) breached on ${activePressureAlerts.map(t => `${t.pos} (${t.press.toFixed(1)} PSI)`).join(', ')}. Action required.</p>
            </div>
          </div>
          <button class="sim-btn active" style="padding: 6px 14px; font-size: 12px;" onclick="window.telemetryEngine.resetAllTriggers()">Clear Alert</button>
        </div>
      `;
    } else {
      return `
        <div class="card" style="background: rgba(0, 230, 118, 0.05); border: 1px solid rgba(0, 230, 118, 0.25); margin-bottom: 20px; padding: 12px 20px;">
          <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--success); font-weight: 700;">
            <i class="fa-solid fa-circle-check" style="font-size: 20px;"></i>
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
}

window.TPMSComponent = TPMSComponent;
