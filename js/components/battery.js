/**
 * Slide 7: Vehicle Battery Monitoring Component
 * Commercial 24V Dual AGM System Telematics (Graph Removed as requested)
 */

class BatteryComponent {
  render(container, data) {
    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2><i class="fa-solid fa-battery-three-quarters"></i> 7. Vehicle Battery Monitoring (24V System)</h2>
          <div class="page-subtitle">Commercial starter & auxiliary battery bank voltage, current and state of health</div>
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
      <div class="grid-container grid-cols-4">
        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title">Battery Voltage</span>
            <span class="card-tag sensor">24V DC</span>
          </div>
          <div class="metric-val" style="color: var(--success);">${data.batteryVoltage} <span class="metric-unit">V</span></div>
          <div class="metric-label">Alternator Charging: 27.0 - 28.5 V</div>
          <div class="metric-trend up"><i class="fa-solid fa-check"></i> Charging Nominal</div>
        </div>

        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title">Current Draw / Charge</span>
            <span class="card-tag sensor">SHUNT HALL</span>
          </div>
          <div class="metric-val">+${data.batteryCurrent} <span class="metric-unit">A</span></div>
          <div class="metric-label">Status: <strong style="color:var(--success);">${data.batteryStatus}</strong></div>
          <div class="metric-trend"><i class="fa-solid fa-bolt"></i> 110A Commercial Alternator</div>
        </div>

        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title">State of Charge (SOC)</span>
            <span class="card-tag ai">ESTIMATED</span>
          </div>
          <div class="metric-val">${data.batterySoc} <span class="metric-unit">%</span></div>
          <div style="width: 100%; background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-top: 6px;">
            <div style="width: ${data.batterySoc}%; height: 100%; background: var(--success);"></div>
          </div>
          <div class="metric-label" style="margin-top: 4px;">Remaining Capacity: 210 Ah</div>
        </div>

        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title">State of Health (SOH)</span>
            <span class="card-tag sensor">BMS DIAGNOSTICS</span>
          </div>
          <div class="metric-val">${data.batterySoh} <span class="metric-unit">%</span></div>
          <div class="metric-label">Cell Temperature: ${data.batteryTemp}°C</div>
          <div class="metric-trend up"><i class="fa-solid fa-temperature-arrow-down"></i> Thermal Envelope OK</div>
        </div>
      </div>
    `;
  }
}

window.BatteryComponent = BatteryComponent;
