/**
 * Slide 5: Camera Telematics & Multi-Layout View Component
 * Features 3 Interactive Layout Modes:
 * 1. Full Monitoring: All 6 cameras equally visible in a 3x2 grid.
 * 2. Road & Driving Focus: Cockpit/Road Front view enlarged as hero feed + 5 smaller feeds.
 * 3. High-Risk & Blindspot Focus: Enlarged views for Left/Right Blindspots, Cabin Activity, & Rear Surroundings.
 */

class CamerasComponent {
  constructor() {
    this.animationFrameId = null;
    this.activeLayout = 'full'; // Options: 'full', 'road', 'risk'
  }

  setLayout(layoutMode) {
    this.activeLayout = layoutMode;
    if (window.appInstance) window.appInstance.renderCurrentView();
  }

  render(container, data) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 22px;"><i class="fa-solid fa-video"></i> 5. Camera Telematics & Multi-Layout Vision</h2>
          <div class="page-subtitle" style="font-size: 14px;">Select from 3 Camera Monitoring Layout Modes (Cockpit AI + Auxiliary Surround Feeds)</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="sim-btn ${data.driverDrowsiness ? 'active' : ''}" style="padding: 6px 12px; font-size: 12px;" onclick="window.telemetryEngine.toggleFatigue()">
            <i class="fa-solid fa-eye-slash"></i> ${data.driverDrowsiness ? 'Reset Driver AI Sim' : 'Simulate Driver Fatigue'}
          </button>
        </div>
      </div>

      <!-- Layout Switcher Control Bar -->
      <div class="card" style="margin-bottom: 20px; padding: 14px 20px; background: rgba(0, 210, 255, 0.05); border: 1px solid var(--border-glow);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 13px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-border-all" style="color: var(--primary);"></i> Camera View Layout Mode:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="sim-btn ${this.activeLayout === 'full' ? 'active' : ''}" style="padding: 8px 14px;" onclick="window.appInstance.components.cameras.setLayout('full')">
              <i class="fa-solid fa-grid-2"></i> Layout 1: Full Monitoring (All 6 Equal)
            </button>
            <button class="sim-btn ${this.activeLayout === 'road' ? 'active' : ''}" style="padding: 8px 14px;" onclick="window.appInstance.components.cameras.setLayout('road')">
              <i class="fa-solid fa-road"></i> Layout 2: Road & Driving Focus (Cockpit Hero)
            </button>
            <button class="sim-btn ${this.activeLayout === 'risk' ? 'active' : ''}" style="padding: 8px 14px;" onclick="window.appInstance.components.cameras.setLayout('risk')">
              <i class="fa-solid fa-shield-halved"></i> Layout 3: High-Risk & Blindspot Focus
            </button>
          </div>
        </div>
      </div>

      <!-- ADAS Cockpit AI Safety Status Banner -->
      <div class="card" style="background: ${data.adasStatus === 'SAFE' ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 61, 113, 0.15)'}; border: 1px solid ${data.adasStatus === 'SAFE' ? 'rgba(0, 230, 118, 0.3)' : 'var(--danger)'}; margin-bottom: 20px; padding: 14px 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: ${data.adasStatus === 'SAFE' ? 'var(--success-glow)' : 'var(--danger-glow)'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              color: ${data.adasStatus === 'SAFE' ? 'var(--success)' : 'var(--danger)'};
            ">
              <i class="fa-solid ${data.adasStatus === 'SAFE' ? 'fa-shield-check' : 'fa-triangle-exclamation'}"></i>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Cockpit AI Vision System</div>
              <div style="font-size: 18px; font-weight: 900; color: #fff;">
                COCKPIT DRIVER AI: <span style="color: ${data.adasStatus === 'SAFE' ? 'var(--success)' : 'var(--danger)'};">${data.adasStatus}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <span class="event-pill ${data.driverDrowsiness ? 'alert' : 'ok'}">Driver Drowsiness</span>
            <span class="event-pill ${data.driverDistraction ? 'alert' : 'ok'}">Driver Distraction</span>
            <span class="event-pill ok">Seatbelt Buckled</span>
          </div>
        </div>
      </div>

      <!-- Render Camera Layout Based on Mode -->
      ${this.renderLayoutHTML(data)}
    `;

    setTimeout(() => {
      this.initCockpitCanvas(data);
    }, 100);
  }

  renderLayoutHTML(data) {
    if (this.activeLayout === 'road') {
      // LAYOUT 2: Road & Driving Focus Mode (Cockpit Front View Hero)
      return `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px;">
          <!-- Hero Cockpit / Road Camera -->
          <div class="camera-box" style="height: 380px; border: 2px solid var(--primary); box-shadow: 0 0 20px var(--primary-glow);">
            <div class="camera-overlay-tag" style="background: rgba(0,210,255,0.25); border-color: var(--primary); font-size: 12px; padding: 6px 12px;">
              <span class="rec-dot"></span> HERO FEED: COCKPIT & ROAD DRIVING VIEW (AI ACTIVE)
            </div>
            <canvas id="cam-cockpit" style="height: 100%; width: 100%;"></canvas>
            <div class="ai-detect-box" style="border-color: ${data.driverDrowsiness ? 'var(--danger)' : 'var(--border-glow)'}; font-size: 12px;">
              <span style="color: ${data.driverDrowsiness ? 'var(--danger)' : 'var(--success)'};">
                <i class="fa-solid fa-user"></i> Driver: <strong>${data.driverDrowsiness ? 'DROWSY / DISTRACTED' : 'ATTENTIVE'}</strong>
              </span>
              <span style="color: var(--success);">Speed: <strong>${data.speed.toFixed(1)} km/h</strong></span>
            </div>
          </div>

          <!-- Side Panel: 5 Smaller Feeds Grid -->
          <div style="display: grid; grid-template-columns: 1fr; gap: 12px; max-height: 380px; overflow-y: auto;">
            ${this.renderSmallCamFeed('CAM-2: FRONT ROAD VIEW', 'DISCONNECTED')}
            ${this.renderSmallCamFeed('CAM-3: LEFT MIRROR BLINDSPOT', 'STANDBY')}
            ${this.renderSmallCamFeed('CAM-4: RIGHT MIRROR BLINDSPOT', 'STANDBY')}
            ${this.renderSmallCamFeed('CAM-5: REAR CARGO HITCH', 'DISCONNECTED')}
            ${this.renderSmallCamFeed('CAM-6: CARGO BAY INTERIOR', 'STANDBY')}
          </div>
        </div>
      `;
    } else if (this.activeLayout === 'risk') {
      // LAYOUT 3: High-Risk & Blindspot Focus Mode
      return `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
          <!-- High-Risk Area 1: Left Mirror Blindspot -->
          <div class="camera-box" style="height: 220px; border: 1px solid var(--warning);">
            <div class="camera-overlay-tag" style="background: rgba(255,179,0,0.2); border-color: var(--warning);">
              <i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i> HIGH-RISK 1: LEFT MIRROR BLINDSPOT
            </div>
            <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #070a12; color: var(--text-muted); gap: 6px;">
              <i class="fa-solid fa-eye-slash" style="font-size: 32px; color: var(--warning);"></i>
              <span style="font-size: 13px; font-weight: 700; color: #fff;">LEFT SIDE BLINDSPOT MONITORING</span>
              <span style="font-size: 11px; color: var(--success);">Proximity Sensor: CLEAR (No Cyclist / Vehicle)</span>
            </div>
          </div>

          <!-- High-Risk Area 2: Right Mirror Blindspot -->
          <div class="camera-box" style="height: 220px; border: 1px solid var(--warning);">
            <div class="camera-overlay-tag" style="background: rgba(255,179,0,0.2); border-color: var(--warning);">
              <i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i> HIGH-RISK 2: RIGHT MIRROR BLINDSPOT
            </div>
            <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #070a12; color: var(--text-muted); gap: 6px;">
              <i class="fa-solid fa-eye-slash" style="font-size: 32px; color: var(--warning);"></i>
              <span style="font-size: 13px; font-weight: 700; color: #fff;">RIGHT SIDE BLINDSPOT MONITORING</span>
              <span style="font-size: 11px; color: var(--success);">Proximity Sensor: CLEAR (No Obstacle)</span>
            </div>
          </div>

          <!-- High-Risk Area 3: Cockpit Cabin Activity -->
          <div class="camera-box" style="height: 220px; border: 1px solid var(--primary);">
            <div class="camera-overlay-tag" style="background: rgba(0,210,255,0.2); border-color: var(--primary);">
              <span class="rec-dot"></span> HIGH-RISK 3: COCKPIT CABIN ACTIVITY (AI ACTIVE)
            </div>
            <canvas id="cam-cockpit" style="height: 100%; width: 100%;"></canvas>
          </div>

          <!-- High-Risk Area 4: Rear Cargo & Surroundings -->
          <div class="camera-box" style="height: 220px; border: 1px solid var(--danger);">
            <div class="camera-overlay-tag" style="background: rgba(255,61,113,0.2); border-color: var(--danger);">
              <i class="fa-solid fa-video-slash"></i> HIGH-RISK 4: REAR SURROUNDINGS & HITCH
            </div>
            <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #070a12; color: var(--text-muted); gap: 6px;">
              <i class="fa-solid fa-truck-ramp-box" style="font-size: 32px; color: var(--danger);"></i>
              <span style="font-size: 13px; font-weight: 700; color: #fff;">REAR HITCH & CARGO SURROUNDINGS</span>
              <span style="font-size: 11px; color: var(--danger);">Feed Standby / Auxiliary Sensor Active</span>
            </div>
          </div>
        </div>
      `;
    } else {
      // LAYOUT 1: Full Monitoring Mode (All 6 Equal 3x2 Grid)
      return `
        <div class="camera-grid" style="margin-bottom: 20px;">
          <!-- 1. COCKPIT / DRIVER CAMERA (MAIN - ACTIVE AI) -->
          <div class="camera-box" style="border: 2px solid var(--primary); box-shadow: 0 0 15px var(--primary-glow);">
            <div class="camera-overlay-tag" style="background: rgba(0,210,255,0.2); border-color: var(--primary);">
              <span class="rec-dot"></span> CAM-1: COCKPIT DRIVER (MAIN AI ACTIVE)
            </div>
            <canvas id="cam-cockpit"></canvas>
            <div class="ai-detect-box" style="border-color: ${data.driverDrowsiness ? 'var(--danger)' : 'var(--border-glow)'};">
              <span style="color: ${data.driverDrowsiness ? 'var(--danger)' : 'var(--success)'};">
                <i class="fa-solid fa-user"></i> Driver: <strong>${data.driverDrowsiness ? 'DROWSY / DISTRACTED' : 'ATTENTIVE'}</strong>
              </span>
              <span style="color: var(--success);">Seatbelt: <strong>BUCKLED</strong></span>
            </div>
          </div>

          <!-- 2. Front Road Camera -->
          ${this.renderGridCamFeed('CAM-2: FRONT ROAD VIEW', 'DISCONNECTED')}
          <!-- 3. Left Mirror Blindspot -->
          ${this.renderGridCamFeed('CAM-3: LEFT MIRROR BLINDSPOT', 'STANDBY')}
          <!-- 4. Right Mirror Blindspot -->
          ${this.renderGridCamFeed('CAM-4: RIGHT MIRROR BLINDSPOT', 'STANDBY')}
          <!-- 5. Rear Cargo Hitch -->
          ${this.renderGridCamFeed('CAM-5: REAR CARGO HITCH', 'DISCONNECTED')}
          <!-- 6. Cargo Bay Interior -->
          ${this.renderGridCamFeed('CAM-6: CARGO BAY INTERIOR', 'STANDBY')}
        </div>
      `;
    }
  }

  renderGridCamFeed(name, status) {
    return `
      <div class="camera-box disconnected">
        <div class="camera-overlay-tag" style="background: rgba(255,255,255,0.06);">
          <i class="fa-solid fa-video"></i> ${name}
        </div>
        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 6px;">
          <i class="fa-solid fa-video-slash" style="font-size: 28px;"></i>
          <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">${status}</span>
          <span style="font-size: 9px; color: var(--text-dim);">Auxiliary Telematics Feed</span>
        </div>
      </div>
    `;
  }

  renderSmallCamFeed(name, status) {
    return `
      <div style="background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 11px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-video" style="color: var(--primary);"></i> ${name}
        </div>
        <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${status}</span>
      </div>
    `;
  }

  initCockpitCanvas(data) {
    const canvas = document.getElementById('cam-cockpit');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth || 360;
    canvas.height = canvas.clientHeight || 200;

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 210, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      const headX = canvas.width / 2;
      const headY = canvas.height / 2 - 10;
      const isDrowsy = data.driverDrowsiness;

      // Draw Driver Face Tracking Mesh
      ctx.strokeStyle = isDrowsy ? '#ff3d71' : '#00d2ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(headX, headY, 35, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = isDrowsy ? '#ff3d71' : '#00e676';
      if (isDrowsy) {
        ctx.fillRect(headX - 18, headY - 8, 12, 2);
        ctx.fillRect(headX + 6, headY - 8, 12, 2);
      } else {
        ctx.beginPath();
        ctx.arc(headX - 12, headY - 8, 4, 0, Math.PI * 2);
        ctx.arc(headX + 12, headY - 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // AI Bounding Box
      const boxColor = isDrowsy ? '#ff3d71' : '#00e676';
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(headX - 45, headY - 45, 90, 100);

      ctx.fillStyle = boxColor;
      ctx.font = '10px monospace';
      ctx.fillText(isDrowsy ? 'ALERT: EYE CLOSURE DETECTED' : 'FACE MESH: NOMINAL', headX - 45, headY - 50);

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }
}

window.CamerasComponent = CamerasComponent;
