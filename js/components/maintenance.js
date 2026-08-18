/**
 * Slide 9: Dedicated Predictive Maintenance Component (Positioned as Last Slide)
 * AI Machine Learning Prognostics, Component Health Breakdown & Actionable Insights
 */

class MaintenanceComponent {
  constructor() {
    this.healthChart = null;
  }

  render(container, data) {
    const health = data.components;

    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2><i class="fa-solid fa-wrench"></i> 9. AI Predictive Maintenance & Vehicle Health</h2>
          <div class="page-subtitle">Raspberry Pi 5 Edge Prognostics Engine (Random Forest + LSTM Time-to-Failure Models)</div>
        </div>
      </div>

      <!-- Overall Vehicle Health Score Card -->
      <div class="card" style="background: linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(0, 210, 255, 0.05)); border: 1px solid rgba(0, 230, 118, 0.3); margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: var(--success); font-weight: 700;">Overall Fleet Prognostic Index</div>
            <div style="font-size: 32px; font-weight: 900; color: #fff; margin-top: 2px;">
              Vehicle Health Score: <span style="color: var(--success);">${data.overallHealthScore}/100 – Healthy</span>
            </div>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
              No catastrophic subsystem failure predicted within next 10,000 km.
            </div>
          </div>

          <div style="display: flex; gap: 15px;">
            <div class="card metric-box" style="background: rgba(0,0,0,0.4); padding: 12px 18px;">
              <div class="metric-label">Predicted Downtime Risk</div>
              <div class="metric-val" style="font-size: 22px; color: var(--success);">LOW (4.2%)</div>
            </div>
            <div class="card metric-box" style="background: rgba(0,0,0,0.4); padding: 12px 18px;">
              <div class="metric-label">Next Scheduled Service</div>
              <div class="metric-val" style="font-size: 22px; color: var(--primary);">In 14,500 km</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Recommendation Section -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <span class="card-title"><i class="fa-solid fa-robot"></i> AI Natural Language Diagnostics & Recommendations</span>
          <span class="card-tag ai">GENERATIVE PROGNOSTICS</span>
        </div>

        <div class="ai-recom-card">
          <i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i>
          <div class="ai-recom-text">
            <h4>Rear-Left Tyre Pressure & Temperature Anomaly</h4>
            <p>"Rear-left tyre pressure is gradually decreasing (96.4 PSI, 68.2°C). Thermal gradient indicates high friction. Inspect for possible slow bead leakage within 7 days."</p>
          </div>
        </div>

        <div class="ai-recom-card">
          <i class="fa-solid fa-circle-check" style="color: var(--success);"></i>
          <div class="ai-recom-text">
            <h4>Ultrasonic Fuel Tank Sensor DYP-L02 Normal</h4>
            <p>"Fuel level acoustics nominal. Tilt-compensation filtering is maintaining &plusmn;0.5L accuracy across highway inclines."</p>
          </div>
        </div>

        <div class="ai-recom-card">
          <i class="fa-solid fa-battery-half" style="color: var(--primary);"></i>
          <div class="ai-recom-text">
            <h4>24V Starter Battery State of Health Nominal</h4>
            <p>"Battery SOH calculated at 91%. Alternator charging voltage steady at 27.4 V. Replacement recommended at 180,000 km."</p>
          </div>
        </div>
      </div>

      <!-- Component Health Breakdown Grid -->
      <div class="grid-container grid-cols-3" style="margin-bottom: 20px;">
        ${this.renderComponentCard('Engine System', health.engine, 'fa-engine')}
        ${this.renderComponentCard('Battery & Electrical', health.battery, 'fa-bolt')}
        ${this.renderComponentCard('Tyres & Axles', health.tyres, 'fa-compact-disc')}
        ${this.renderComponentCard('Braking System', health.braking, 'fa-shield')}
        ${this.renderComponentCard('Fuel Delivery System', health.fuelSystem, 'fa-gas-pump')}
        ${this.renderComponentCard('Cooling System', health.cooling, 'fa-fan')}
      </div>

      <!-- Historical Health Trend Chart -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fa-solid fa-chart-line"></i> Vehicle Health Score & Maintenance Risk Trend</span>
          <span class="card-tag sensor">30-DAY HISTORY</span>
        </div>
        <div style="height: 250px; position: relative;">
          <canvas id="chart-health-trend"></canvas>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.renderCharts(data);
    }, 100);
  }

  renderComponentCard(name, comp, icon) {
    const isWarn = comp.risk === 'Medium';
    const isCrit = comp.risk === 'High';
    const statusColor = isCrit ? 'var(--danger)' : (isWarn ? 'var(--warning)' : 'var(--success)');

    return `
      <div class="card metric-box">
        <div class="card-header">
          <span class="card-title"><i class="fa-solid ${icon}"></i> ${name}</span>
          <span class="card-tag" style="background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}44;">
            RISK: ${comp.risk}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div class="metric-val" style="color: ${statusColor};">${comp.score}%</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff;">${comp.status}</div>
        </div>

        <div style="width: 100%; background: rgba(255,255,255,0.08); height: 6px; border-radius: 3px; overflow: hidden; margin: 8px 0;">
          <div style="width: ${comp.score}%; height: 100%; background: ${statusColor};"></div>
        </div>

        <div class="metric-label" style="font-size: 11px;">Predicted Service: <strong style="color:#fff;">${comp.predictedMaint}</strong></div>
      </div>
    `;
  }

  renderCharts(data) {
    if (typeof Chart === 'undefined') return;

    const ctx = document.getElementById('chart-health-trend');
    if (!ctx) return;
    if (this.healthChart) this.healthChart.destroy();

    const days = ['Day -30', 'Day -25', 'Day -20', 'Day -15', 'Day -10', 'Day -5', 'Today'];

    this.healthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Overall Vehicle Health Score',
            data: [98, 97, 96, 95, 94, 93, data.overallHealthScore],
            borderColor: '#00e676',
            backgroundColor: 'rgba(0, 230, 118, 0.1)',
            borderWidth: 2,
            fill: true
          },
          {
            label: 'Failure Risk (%)',
            data: [2, 3, 4, 5, 6, 7, 8],
            borderColor: '#ff3d71',
            borderDash: [4, 4],
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8a99ad' } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a99ad' }, min: 0, max: 100 }
        }
      }
    });
  }
}

window.MaintenanceComponent = MaintenanceComponent;
