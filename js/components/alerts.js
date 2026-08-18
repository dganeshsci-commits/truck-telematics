/**
 * Dedicated Centralized Alerts Component
 * Categorized Telematics Events with Actionable Recommendations & Filtering
 */

class AlertsComponent {
  constructor() {
    this.currentFilter = 'ALL';
  }

  render(container, data, fleet, alerts) {
    const filteredAlerts = alerts.filter(a => {
      if (this.currentFilter === 'ALL') return true;
      return a.severity.toUpperCase() === this.currentFilter;
    });

    container.innerHTML = `
      <div class="page-title-row">
        <div>
          <h2><i class="fa-solid fa-bell"></i> Centralized Telematics Alerts & Notifications</h2>
          <div class="page-subtitle">Real-time edge event hub: Overspeed, Fuel Theft, TPMS, ADAS & Maintenance</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="sim-btn ${this.currentFilter === 'ALL' ? 'active' : ''}" onclick="window.alertsComp.setFilter('ALL')">All (${alerts.length})</button>
          <button class="sim-btn ${this.currentFilter === 'CRITICAL' ? 'active' : ''}" onclick="window.alertsComp.setFilter('CRITICAL')">Critical</button>
          <button class="sim-btn ${this.currentFilter === 'WARNING' ? 'active' : ''}" onclick="window.alertsComp.setFilter('WARNING')">Warning</button>
          <button class="sim-btn ${this.currentFilter === 'INFO' ? 'active' : ''}" onclick="window.alertsComp.setFilter('INFO')">Info</button>
        </div>
      </div>

      <!-- Alerts Feed Table -->
      <div class="card custom-table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Time</th>
              <th>Vehicle ID</th>
              <th>Location</th>
              <th>Category & Description</th>
              <th>Recommended Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAlerts.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No alerts match filter criteria.</td></tr>
            ` : filteredAlerts.map(alert => {
              const isCrit = alert.severity === 'Critical';
              const isWarn = alert.severity === 'Warning';
              const badgeClass = isCrit ? 'danger' : (isWarn ? 'warning' : 'info');
              const badgeColor = isCrit ? 'var(--danger)' : (isWarn ? 'var(--warning)' : 'var(--info)');

              return `
                <tr>
                  <td>
                    <span class="status-badge ${badgeClass}" style="border-color: ${badgeColor};">
                      <i class="fa-solid ${isCrit ? 'fa-triangle-exclamation' : (isWarn ? 'fa-circle-exclamation' : 'fa-info-circle')}"></i>
                      ${alert.severity}
                    </span>
                  </td>
                  <td style="font-family: monospace; font-size: 12px; color: var(--text-muted);">${alert.time}</td>
                  <td><strong style="color: #fff;">${alert.vehicle}</strong></td>
                  <td style="font-size: 12px; color: var(--text-muted);">${alert.location}</td>
                  <td>
                    <div style="font-weight: 700; color: #fff; font-size: 13px;">${alert.category}</div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${alert.desc}</div>
                  </td>
                  <td style="font-size: 12px; color: var(--primary); font-weight: 500;">
                    <i class="fa-solid fa-square-check"></i> ${alert.action}
                  </td>
                  <td>
                    <button class="sim-btn" onclick="window.telemetryEngine.resetAllTriggers()">Resolve</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  setFilter(filter) {
    this.currentFilter = filter;
    window.appInstance.renderCurrentView();
  }
}

window.AlertsComponent = AlertsComponent;
window.alertsComp = new AlertsComponent();
