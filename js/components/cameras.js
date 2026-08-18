/**
 * Slide 6: Camera Telematics & Cockpit AI Component
 * Camera Order: Cockpit Main Camera FIRST (with AI capabilities)
 * Extra Cameras: Rendered after Cockpit, explicitly marked DISCONNECTED / NO AI
 */

class CamerasComponent {
  constructor() {
    this.animationFrameId = null;
  }

  render(container, data) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2><i class="fa-solid fa-video"></i> 6. Camera Telematics</h2>
          <div class="page-subtitle">Cockpit Main AI Camera (Active) + Auxiliary Feeds (Disconnected / No AI)</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="sim-btn ${data.driverDrowsiness ? 'active' : ''}" onclick="window.telemetryEngine.toggleFatigue()">
            <i class="fa-solid fa-eye-slash"></i> ${data.driverDrowsiness ? 'Reset Driver AI Sim' : 'Simulate Driver Fatigue & Distraction'}
          </button>
        </div>
      </div>

      <!-- ADAS Cockpit AI Safety Status Banner -->
      <div class="card" style="background: ${data.adasStatus === 'SAFE' ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 61, 113, 0.15)'}; border: 1px solid ${data.adasStatus === 'SAFE' ? 'rgba(0, 230, 118, 0.3)' : 'var(--danger)'}; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: ${data.adasStatus === 'SAFE' ? 'var(--success-glow)' : 'var(--danger-glow)'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: ${data.adasStatus === 'SAFE' ? 'var(--success)' : 'var(--danger)'};
            ">
              <i class="fa-solid ${data.adasStatus === 'SAFE' ? 'fa-shield-check' : 'fa-triangle-exclamation'}"></i>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Cockpit AI Vision System</div>
              <div style="font-size: 22px; font-weight: 900; color: #fff;">
                COCKPIT DRIVER AI: <span style="color: ${data.adasStatus === 'SAFE' ? 'var(--success)' : 'var(--danger)'};">${data.adasStatus}</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted);">
                ${data.adasStatus === 'SAFE' ? 'Driver eyes attentive & forward road facing. Seatbelt buckled.' : 'CRITICAL HAZARD: Driver distraction & eye-closure (>3s) detected by Cockpit AI.'}
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

      <!-- Camera Grid: COCKPIT FIRST with AI, Extra Cameras DISCONNECTED / NO AI -->
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

        <!-- 2. Front Camera (DISCONNECTED / NO AI) -->
        <div class="camera-box disconnected">
          <div class="camera-overlay-tag" style="background: rgba(255,61,113,0.3); border-color: var(--danger);">
            <i class="fa-solid fa-plug-circle-xmark"></i> CAM-2: FRONT ROAD (DISCONNECTED / NO AI)
          </div>
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 8px;">
            <i class="fa-solid fa-video-slash" style="font-size: 32px;"></i>
            <span style="font-size: 12px; font-weight: 700; color: var(--danger);">CAMERA DISCONNECTED</span>
            <span style="font-size: 10px;">No AI Processing Enabled</span>
          </div>
        </div>

        <!-- 3. Rear Camera (DISCONNECTED / NO AI) -->
        <div class="camera-box disconnected">
          <div class="camera-overlay-tag" style="background: rgba(255,61,113,0.3); border-color: var(--danger);">
            <i class="fa-solid fa-plug-circle-xmark"></i> CAM-3: REAR HITCH (DISCONNECTED / NO AI)
          </div>
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 8px;">
            <i class="fa-solid fa-video-slash" style="font-size: 32px;"></i>
            <span style="font-size: 12px; font-weight: 700; color: var(--danger);">CAMERA DISCONNECTED</span>
            <span style="font-size: 10px;">No AI Processing Enabled</span>
          </div>
        </div>

        <!-- 4. Left Camera (DISCONNECTED / NO AI) -->
        <div class="camera-box disconnected">
          <div class="camera-overlay-tag" style="background: rgba(255,61,113,0.3); border-color: var(--danger);">
            <i class="fa-solid fa-plug-circle-xmark"></i> CAM-4: LEFT SIDE (DISCONNECTED / NO AI)
          </div>
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 8px;">
            <i class="fa-solid fa-video-slash" style="font-size: 32px;"></i>
            <span style="font-size: 12px; font-weight: 700; color: var(--danger);">CAMERA DISCONNECTED</span>
            <span style="font-size: 10px;">No AI Processing Enabled</span>
          </div>
        </div>

        <!-- 5. Right Camera (DISCONNECTED / NO AI) -->
        <div class="camera-box disconnected">
          <div class="camera-overlay-tag" style="background: rgba(255,61,113,0.3); border-color: var(--danger);">
            <i class="fa-solid fa-plug-circle-xmark"></i> CAM-5: RIGHT SIDE (DISCONNECTED / NO AI)
          </div>
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 8px;">
            <i class="fa-solid fa-video-slash" style="font-size: 32px;"></i>
            <span style="font-size: 12px; font-weight: 700; color: var(--danger);">CAMERA DISCONNECTED</span>
            <span style="font-size: 10px;">No AI Processing Enabled</span>
          </div>
        </div>

        <!-- 6. 360° Surround Camera (DISCONNECTED / NO AI) -->
        <div class="camera-box disconnected">
          <div class="camera-overlay-tag" style="background: rgba(255,61,113,0.3); border-color: var(--danger);">
            <i class="fa-solid fa-plug-circle-xmark"></i> CAM-6: 360° SURROUND (DISCONNECTED / NO AI)
          </div>
          <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); gap: 8px;">
            <i class="fa-solid fa-video-slash" style="font-size: 32px;"></i>
            <span style="font-size: 12px; font-weight: 700; color: var(--danger);">CAMERA DISCONNECTED</span>
            <span style="font-size: 10px;">No AI Processing Enabled</span>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.startCockpitStream(data);
    }, 100);
  }

  startCockpitStream(data) {
    let tick = 0;

    const drawCockpit = () => {
      tick += 1;
      const cCockpit = document.getElementById('cam-cockpit');
      if (cCockpit) {
        const ctx = cCockpit.getContext('2d');
        cCockpit.width = cCockpit.clientWidth || 320;
        cCockpit.height = cCockpit.clientHeight || 180;
        const w = cCockpit.width;
        const h = cCockpit.height;

        ctx.fillStyle = '#0a0d18';
        ctx.fillRect(0, 0, w, h);

        const isDrowsy = data.driverDrowsiness;
        ctx.strokeStyle = isDrowsy ? '#ff3d71' : '#00d2ff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.45, Math.min(w, h) * 0.22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(w * 0.38, h * 0.22, w * 0.24, h * 0.52);

        const eyeColor = isDrowsy ? '#ff3d71' : '#00e676';
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(w * 0.42, h * 0.42, isDrowsy ? 2 : 5, 0, Math.PI * 2);
        ctx.arc(w * 0.58, h * 0.42, isDrowsy ? 2 : 5, 0, Math.PI * 2);
        ctx.fill();

        if (isDrowsy) {
          ctx.fillStyle = '#ff3d71';
          ctx.font = '12px monospace';
          ctx.fillText('CRITICAL: DROWSINESS / EYE CLOSURE', w * 0.15, h * 0.88);
        } else {
          ctx.fillStyle = '#00e676';
          ctx.font = '11px monospace';
          ctx.fillText('AI MESH TRACKING: NOMINAL', w * 0.22, h * 0.88);
        }
      }

      this.animationFrameId = requestAnimationFrame(drawCockpit);
    };

    drawCockpit();
  }
}

window.CamerasComponent = CamerasComponent;
