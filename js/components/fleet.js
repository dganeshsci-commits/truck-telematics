/**
 * Slide 7: Fleet Management Component
 * Driver Assignment & Vehicle Registration Overview
 * Columns: Vehicle ID, Assigned Driver, Current Location, Speed, Vehicle Health Score
 * Features Role-Based Edit Controls (Admin = Editable, User = View Only Read-Only)
 */

class FleetComponent {
  render(container, data, fleet, alerts) {
    const isAdmin = window.appInstance && window.appInstance.currentUserRole === 'admin';

    container.innerHTML = `
      <div class="page-title-row" style="margin-bottom: 24px; align-items: center;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(0, 210, 255, 0.1); border: 1px solid var(--border-glow); display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--primary);">
            <i class="fa-solid fa-truck-fleet"></i>
          </div>
          <div>
            <h2 style="font-size: 22px;"><i class="fa-solid fa-truck-fleet" style="color: var(--primary);"></i> 7. Fleet Management & Driver Assignment</h2>
            <div class="page-subtitle" style="font-size: 13px;">List of active drivers & vehicles (${isAdmin ? 'Admin Edit Mode Active' : 'User View-Only Mode'})</div>
          </div>
        </div>
        <div>
          ${isAdmin ? `
            <button class="sim-btn active" style="padding: 10px 20px; font-size: 13px;" onclick="window.appInstance.toggleAddDriverModal(true)">
              <i class="fa-solid fa-user-plus"></i> + Add New Driver & Vehicle
            </button>
          ` : `
            <span style="font-size: 12px; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 8px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <i class="fa-solid fa-lock" style="color: var(--warning);"></i> Read-Only View Mode (Login as Admin to Edit)
            </span>
          `}
        </div>
      </div>

      <!-- Fleet Overview Table -->
      <div class="card custom-table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Assigned Driver ${isAdmin ? '(Editable Name)' : '(Read-Only)'}</th>
              <th>Current Location</th>
              <th>Speed</th>
              <th>Vehicle Health Score</th>
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
                        style="width: 180px; font-weight: 700; ${!isAdmin ? 'opacity: 0.75; cursor: not-allowed;' : ''}"
                        ${!isAdmin ? 'disabled readonly' : ''}
                        onchange="window.appInstance.saveDriverRowDetails('${v.id}', ${index})"
                      />
                    </div>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      id="driver-loc-input-${index}" 
                      class="edit-input-field" 
                      value="${v.location}" 
                      style="width: 220px; font-size: 12px; ${!isAdmin ? 'opacity: 0.75; cursor: not-allowed;' : ''}"
                      ${!isAdmin ? 'disabled readonly' : ''}
                      onchange="window.appInstance.saveDriverRowDetails('${v.id}', ${index})"
                    />
                  </td>
                  <td style="font-weight: 700; color: #fff;">${v.speed} km/h</td>
                  <td style="font-weight: 800; color: var(--success); font-size: 14px;">${v.health}</td>
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
