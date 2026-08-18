/**
 * Technology Architecture & Hardware Blueprint Component
 * Edge Computing Setup: Arduino Nano (Sensors) + Raspberry Pi 5 (AI & Telematics Gateway)
 * Interactive Simulation Scenario Trigger Panel
 */

class HardwareComponent {
  render(container, data) {
    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2><i class="fa-solid fa-microchip"></i> Hardware Architecture & Simulation Controls</h2>
          <div class="page-subtitle">Embedded Edge Pipeline: Arduino Nano Sensor Acquisition &rarr; Raspberry Pi 5 AI Gateway</div>
        </div>
      </div>

      <!-- Architectural Data Separation Card -->
      <div class="grid-container grid-cols-4" style="margin-bottom: 20px;">
        <div class="card metric-box" style="border-color: rgba(0, 230, 118, 0.3);">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-wave-square"></i> 1. Sensor Data</span>
            <span class="card-tag sensor">ARDUINO NANO</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
            Raw physical signals: DYP-L02 height (mm), OF06ZAT pulse counts, MPU6050 accelerations, TPMS 433MHz RF, Battery voltage ADC.
          </div>
        </div>

        <div class="card metric-box" style="border-color: rgba(58, 134, 255, 0.3);">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-sliders"></i> 2. Simulated Data</span>
            <span class="card-tag simulated">PROTOTYPE LAYER</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
            Realistic telemetry generator producing noise, incline tilt, fuel consumption curves, and GPS highway tracks.
          </div>
        </div>

        <div class="card metric-box" style="border-color: rgba(0, 210, 255, 0.3);">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-brain"></i> 3. AI Predictions</span>
            <span class="card-tag ai">RPI-5 EDGE AI</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
            YOLOv8 obstacle vision, OpenVINO cockpit fatigue tracking, tilt compensation matrix, Random Forest maintenance prognostics.
          </div>
        </div>

        <div class="card metric-box" style="border-color: rgba(255, 61, 113, 0.3);">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-bell"></i> 4. Telematics Alerts</span>
            <span class="card-tag" style="background:rgba(255,61,113,0.15); color:var(--danger);">ACTIVE HUB</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
            Categorized event triggers (Critical, Warning, Info) with recommended driver & dispatch actions.
          </div>
        </div>
      </div>

      <!-- Hardware Architecture Blueprint Schematic -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <span class="card-title"><i class="fa-solid fa-diagram-project"></i> Hardware Connection Topology</span>
          <span class="card-tag sensor">NO CAN BUS IN PROTOTYPE</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 15px; background: rgba(0,0,0,0.4); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
            <div style="background: rgba(0, 230, 118, 0.1); border: 1px solid rgba(0, 230, 118, 0.3); padding: 14px; border-radius: var(--radius-md); width: 260px;">
              <div style="font-weight: 800; color: var(--success);"><i class="fa-solid fa-microchip"></i> Arduino Nano</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Sensor Acquisition Unit (100 Hz)</div>
              <ul style="font-size: 11px; color: #fff; margin-top: 8px; padding-left: 15px;">
                <li>DYP-L02 Ultrasonic (UART)</li>
                <li>OF06ZAT Flow Sensor (Digital Pulse)</li>
                <li>MPU6050 6-DOF IMU (I2C)</li>
                <li>TPMS Receiver (SPI/RF)</li>
                <li>Battery Voltage Divider (ADC)</li>
              </ul>
            </div>

            <div style="font-size: 24px; color: var(--primary);"><i class="fa-solid fa-arrow-right"></i><br><span style="font-size:10px; color:var(--text-muted);">UART 115200 Baud</span></div>

            <div style="background: rgba(0, 210, 255, 0.1); border: 1px solid rgba(0, 210, 255, 0.3); padding: 14px; border-radius: var(--radius-md); width: 280px;">
              <div style="font-weight: 800; color: var(--primary);"><i class="fa-solid fa-server"></i> Raspberry Pi 5</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Edge Compute & AI Gateway</div>
              <ul style="font-size: 11px; color: #fff; margin-top: 8px; padding-left: 15px;">
                <li>6 Camera Feeds (CSI / USB)</li>
                <li>Tilt Compensation Math Matrix</li>
                <li>YOLOv8 + OpenVINO Edge AI</li>
                <li>Local Telematics Web Dashboard</li>
                <li>4G / Wi-Fi MQTT Cloud Bridge</li>
              </ul>
            </div>

            <div style="font-size: 24px; color: var(--success);"><i class="fa-solid fa-arrow-right"></i><br><span style="font-size:10px; color:var(--text-muted);">HTTP / WebSockets</span></div>

            <div style="background: rgba(58, 134, 255, 0.1); border: 1px solid rgba(58, 134, 255, 0.3); padding: 14px; border-radius: var(--radius-md); width: 220px;">
              <div style="font-weight: 800; color: var(--accent);"><i class="fa-solid fa-desktop"></i> Web Telematics UI</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Production-Style Dashboard</div>
              <ul style="font-size: 11px; color: #fff; margin-top: 8px; padding-left: 15px;">
                <li>HTML5 / CSS3 Glassmorphism</li>
                <li>Leaflet GPS Mapping</li>
                <li>Chart.js Realtime Graphs</li>
                <li>Centralized Alert Engine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Prototype Simulation Event Trigger Center -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fa-solid fa-gamepad"></i> Interactive Telemetry Scenario Simulator</span>
          <span class="card-tag ai">EVALUATION CONTROL</span>
        </div>

        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
          Use these control toggles to trigger real-time physical sensor anomalies during your project demonstration:
        </div>

        <div class="grid-container grid-cols-3">
          <button class="sim-btn ${data.isFuelTheftDetected ? 'active' : ''}" style="padding: 14px; justify-content: center;" onclick="window.telemetryEngine.toggleFuelTheft()">
            <i class="fa-solid fa-shield-cat" style="font-size: 16px;"></i>
            ${data.isFuelTheftDetected ? 'Reset Fuel Theft' : 'Trigger Fuel Theft Anomaly'}
          </button>

          <button class="sim-btn ${data.pitch > 4.0 ? 'active' : ''}" style="padding: 14px; justify-content: center;" onclick="window.telemetryEngine.toggleSteepIncline()">
            <i class="fa-solid fa-mountain" style="font-size: 16px;"></i>
            ${data.pitch > 4.0 ? 'Reset Terrain Slope' : 'Trigger Incline Slope (+6.8° Pitch)'}
          </button>

          <button class="sim-btn ${data.flags?.tyreLeakActive ? 'active' : ''}" style="padding: 14px; justify-content: center;" onclick="window.telemetryEngine.toggleTyreLeak()">
            <i class="fa-solid fa-compact-disc" style="font-size: 16px;"></i>
            ${data.flags?.tyreLeakActive ? 'Reset Tyre Pressure' : 'Trigger Rear-Left Tyre Pressure Loss'}
          </button>

          <button class="sim-btn ${data.driverDrowsiness ? 'active' : ''}" style="padding: 14px; justify-content: center;" onclick="window.telemetryEngine.toggleFatigue()">
            <i class="fa-solid fa-user-ninja" style="font-size: 16px;"></i>
            ${data.driverDrowsiness ? 'Reset Driver AI' : 'Trigger Driver Drowsiness & Distraction'}
          </button>

          <button class="sim-btn ${data.routeCompliance === 'Deviated' ? 'active' : ''}" style="padding: 14px; justify-content: center;" onclick="window.telemetryEngine.toggleRouteDeviation()">
            <i class="fa-solid fa-route" style="font-size: 16px;"></i>
            ${data.routeCompliance === 'Deviated' ? 'Reset Route Path' : 'Trigger Route Deviation Anomaly'}
          </button>

          <button class="sim-btn" style="padding: 14px; justify-content: center; background: var(--success); color: #000; font-weight: 800;" onclick="window.telemetryEngine.resetAllTriggers()">
            <i class="fa-solid fa-rotate-left" style="font-size: 16px;"></i>
            Reset All Simulation Signals
          </button>
        </div>
      </div>
    `;
  }
}

window.HardwareComponent = HardwareComponent;
