/**
 * Slide 7: Fleet Management Component
 * Driver Assignment, Add New Driver & Vehicle Form Modal + Inline Detail Editing
 * Features: Volvo Heavy Logistics Fleet Management Official Logo Badge
 */

class FleetComponent {
  render(container, data, fleet, alerts) {
    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 24px; align-items: center;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="assets/volvo_fleet_logo.jpg" alt="Volvo Fleet Management Logo" style="width: 56px; height: 56px; border-radius: 12px; object-fit: cover; border: 1px solid var(--border-glow); box-shadow: 0 0 15px var(--primary-glow);" />
          <div>
            <h2 style="font-size: 22px;"><i class="fa-solid fa-truck-fleet" style="color: var(--primary);"></i> 7. Fleet Management & Driver Assignment</h2>
            <div class="page-subtitle" style="font-size: 13px;">List of active drivers & vehicles with inline driver editing & new driver creation</div>
          </div>
        </div>
        <div>
          <button class="sim-btn active" style="padding: 10px 20px; font-size: 13px;" onclick="window.appInstance.toggleAddDriverModal(true)">
            <i class="fa-solid fa-user-plus"></i> + Add New Driver & Vehicle
          </button>
        </div>
      </div>

      <!-- Fleet Overview Table -->
      <div class="card custom-table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Assigned Driver (Editable)</th>
              <th>Current Location</th>
              <th>Speed</th>
              <th>Fuel Level</th>
              <th>Tyre Status</th>
              <th>Vehicle Health</th>
              <th>Route Compliance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${fleet.map((v, index) => {
              const isSelected = v.id === data.vehicleId;
              const currentDriverName = isSelected ? data.driver : v.driver;

              return `
                <tr style="${isSelected ? 'background: rgba(0, 210, 255, 0.08);' : ''}">
                  <td>
                    <strong style="color: var(--primary); font-size: 14px;">${v.id}</strong>
                    ${isSelected ? '<span class="card-tag sensor" style="margin-left: 6px;">ACTIVE</span>' : ''}
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <input 
                        type="text" 
                        id="driver-name-input-${index}" 
                        class="edit-input-field" 
                        value="${currentDriverName}" 
                        style="width: 140px;"
                      />
                    </div>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      id="driver-loc-input-${index}" 
                      class="edit-input-field" 
                      value="${v.location}" 
                      style="width: 180px; font-size: 12px;"
                    />
                  </td>
                  <td style="font-weight: 700; color: #fff;">${v.speed}</td>
                  <td style="color: var(--success); font-weight: 700;">${v.fuel}</td>
                  <td>
                    <span style="color: ${v.tyre.includes('WARNING') ? 'var(--warning)' : (v.tyre.includes('CRITICAL') ? 'var(--danger)' : 'var(--success)')}; font-weight: 700; font-size: 11px;">
                      ${v.tyre}
                    </span>
                  </td>
                  <td style="font-weight: 700; color: var(--success);">${v.health}</td>
                  <td>
                    <span class="status-badge ${v.route === 'Compliant' ? 'running' : 'offline'}">${v.route}</span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button class="sim-btn active" style="padding: 4px 8px;" onclick="window.appInstance.saveDriverRowDetails('${v.id}', ${index})">
                        <i class="fa-solid fa-floppy-disk"></i> Save
                      </button>
                      <button class="sim-btn" style="padding: 4px 8px;" onclick="window.appInstance.selectVehicle('${v.id}')">
                        <i class="fa-solid fa-gauge-high"></i> Select
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

window.FleetComponent = FleetComponent;
