/**
 * Slide 6: Vehicle Battery Monitoring Component
 * Features: 24V DC Dual Commercial Starter System Telematics + Battery Theft & Disconnect Anomaly Protection
 */

class BatteryComponent {
  render(container, data) {
    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-battery-three-quarters"></i> 6. Vehicle Battery Monitoring (24V System)</h2>
          <div class="page-subtitle" style="font-size: 14px;">Commercial starter & auxiliary battery bank voltage, current, state of health, and anti-theft protection</div>
        </div>
      </div>

      <!-- Battery System Note -->
      <div class="card" style="background: rgba(0, 210, 255, 0.05); border: 1px solid rgba(0, 210, 255, 0.2); margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <i class="fa-solid fa-circle-info" style="font-size: 20px; color: var(--primary);"></i>
          <div style="font-size: 12px; color: var(--text-muted);">
            <strong>Commercial Diesel Starter System:</strong> Telemetry monitors 24V dual AGM batteries powering the Volvo FH engine starter, RPi 5 edge compute, and telematic sensors.
          </div>
        </div>
      </div>

      <!-- Battery KPIs Grid -->
      <div class="grid-container grid-cols-4" style="margin-bottom: 20px;">
        <div class="card metric-box" style="padding: 18px;">
          <div class="card-header">
            <span class="card-title">Battery Voltage</span>
            <span class="card-tag sensor">24V DC</span>
          </div>
          <div class="metric-val" style="color: var(--success); font-size: 28px;">${data.batteryVoltage} <span class="metric-unit">V</span></div>
          <div class="metric-label">Alternator Charging: 27.0 - 28.5 V</div>
          <div class="metric-trend up"><i class="fa-solid fa-check"></i> Charging Nominal</div>
        </div>

        <div class="card metric-box" style="padding: 18px;">
          <div class="card-header">
            <span class="card-title">Current Draw / Charge</span>
            <span class="card-tag sensor">SHUNT HALL</span>
          </div>
          <div class="metric-val" style="font-size: 28px;">+${data.batteryCurrent} <span class="metric-unit">A</span></div>
          <div class="metric-label">Status: <strong style="color:var(--success);">${data.batteryStatus}</strong></div>
          <div class="metric-trend"><i class="fa-solid fa-bolt"></i> 110A Commercial Alternator</div>
        </div>

        <div class="card metric-box" style="padding: 18px;">
          <div class="card-header">
            <span class="card-title">State of Charge (SOC)</span>
            <span class="card-tag ai">ESTIMATED</span>
          </div>
          <div class="metric-val" style="font-size: 28px;">${data.batterySoc} <span class="metric-unit">%</span></div>
          <div style="width: 100%; background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-top: 6px;">
            <div style="width: ${data.batterySoc}%; height: 100%; background: var(--success);"></div>
          </div>
          <div class="metric-label" style="margin-top: 4px;">Remaining Capacity: 210 Ah</div>
        </div>

        <div class="card metric-box" style="padding: 18px;">
          <div class="card-header">
            <span class="card-title">State of Health (SOH)</span>
            <span class="card-tag sensor">BMS DIAGNOSTICS</span>
          </div>
          <div class="metric-val" style="font-size: 28px;">${data.batterySoh} <span class="metric-unit">%</span></div>
          <div class="metric-label">Cell Temperature: ${data.batteryTemp}°C</div>
          <div class="metric-trend up"><i class="fa-solid fa-temperature-arrow-down"></i> Thermal Envelope OK</div>
        </div>
      </div>

      <!-- Battery Theft & Disconnect Anomaly Protection Card -->
      <div class="card" style="background: rgba(255,61,113,0.06); border: 1px solid rgba(255,61,113,0.3); padding: 18px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <i class="fa-solid fa-shield-cat" style="font-size: 32px; color: var(--danger);"></i>
            <div>
              <div style="font-size: 15px; font-weight: 800; color: #fff;">Battery Tampering & Theft Protection System</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                Monitors terminal disconnection and voltage drop (< 20V DC) when engine is OFF. Triggers immediate 4G backup alert & GPS location pulse.
              </div>
            </div>
          </div>
          <span class="event-pill ok" style="font-size: 12px; padding: 6px 14px;"><i class="fa-solid fa-lock"></i> Terminals Secured</span>
        </div>
      </div>
    `;
  }
}

window.BatteryComponent = BatteryComponent;
