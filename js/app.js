/**
 * AI Telematics Application Controller
 * Handles Navigation, Views Switching, Multi-Vehicle State Binding,
 * Authentication Gateway (User & Admin Passwords), Dropdown Handlers, and Alert Modals.
 */

class TelematicsApp {
  constructor() {
    this.currentView = 'overview';
    this.currentData = null;
    this.fleetData = [];
    this.currentUserRole = null; // 'admin' or 'user'

    this.components = {
      overview: new OverviewComponent(),
      dynamics: new DynamicsComponent(),
      fuel: new FuelComponent(),
      tpms: new TPMSComponent(),
      cameras: new CamerasComponent(),
      battery: new BatteryComponent(),
      fleet: new FleetComponent(),
      maintenance: new MaintenanceComponent(),
      alerts: new AlertsComponent()
    };
  }

  init() {
    this.bindNavigation();
    this.bindVehicleSelector();
    this.startClock();
    
    // Check authentication status
    this.checkAuthStatus();

    // Subscribe to multi-vehicle telemetry engine ticks
    if (window.telemetryEngine) {
      window.telemetryEngine.subscribe((data, fleet) => {
        this.currentData = data;
        this.fleetData = fleet;
        this.updateHeaderSummary();
        this.renderCurrentView();
      });

      // Initial render trigger
      this.currentData = window.telemetryEngine.getActiveVehicleData();
      this.fleetData = window.telemetryEngine.getFleetList();
      this.updateHeaderSummary();
      this.renderCurrentView();
    }
  }

  checkAuthStatus() {
    const savedRole = sessionStorage.getItem('telematicsRole');
    if (savedRole) {
      this.currentUserRole = savedRole;
      this.toggleAuthModal(false);
      this.updateUserRoleHeaderBadge();
    } else {
      // Force Login Gateway Modal on first startup!
      this.currentUserRole = null;
      this.toggleAuthModal(true);
    }
  }

  handleDashboardLogin() {
    const roleSelect = document.getElementById('auth-role-select');
    const passwordInput = document.getElementById('auth-password-input');
    const errorMsg = document.getElementById('auth-error-msg');

    const selectedRole = roleSelect ? roleSelect.value : 'admin';
    const password = passwordInput ? passwordInput.value.trim() : '';

    let isValid = false;

    if (selectedRole === 'admin' && password === 'admin123') {
      isValid = true;
    } else if (selectedRole === 'user' && password === 'user123') {
      isValid = true;
    }

    if (isValid) {
      this.currentUserRole = selectedRole;
      sessionStorage.setItem('telematicsRole', selectedRole);
      if (errorMsg) errorMsg.style.display = 'none';
      this.toggleAuthModal(false);
      this.updateUserRoleHeaderBadge();
      if (passwordInput) passwordInput.value = '';
    } else {
      if (errorMsg) errorMsg.style.display = 'block';
    }
  }

  showLoginModal() {
    sessionStorage.removeItem('telematicsRole');
    const passwordInput = document.getElementById('auth-password-input');
    if (passwordInput) passwordInput.value = '';
    const errorMsg = document.getElementById('auth-error-msg');
    if (errorMsg) errorMsg.style.display = 'none';
    this.toggleAuthModal(true);
  }

  toggleAuthModal(show) {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = show ? 'flex' : 'none';
    }
  }

  updateUserRoleHeaderBadge() {
    const badgeText = document.getElementById('header-user-role-text');
    if (badgeText) {
      if (this.currentUserRole === 'admin') {
        badgeText.innerHTML = `User: <strong>Admin (Pridas)</strong>`;
      } else if (this.currentUserRole === 'user') {
        badgeText.innerHTML = `User: <strong>Operator (View Only)</strong>`;
      } else {
        badgeText.innerHTML = `User: <strong>Not Logged In</strong>`;
      }
    }
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.switchView(view);
      });
    });
  }

  bindVehicleSelector() {
    const selectVeh = document.getElementById('select-vehicle');
    if (selectVeh) {
      selectVeh.addEventListener('change', (e) => {
        this.selectVehicle(e.target.value);
      });
    }
  }

  selectVehicle(vehicleId) {
    if (window.telemetryEngine) {
      window.telemetryEngine.setActiveVehicle(vehicleId);
      this.currentData = window.telemetryEngine.getActiveVehicleData();
      this.fleetData = window.telemetryEngine.getFleetList();

      const selectVeh = document.getElementById('select-vehicle');
      if (selectVeh) selectVeh.value = vehicleId;

      this.updateHeaderSummary();

      // Force clean full re-render when changing trucks so all values across all slides immediately update!
      const targetContainer = document.getElementById(`view-${this.currentView}`);
      if (targetContainer) {
        targetContainer.innerHTML = '';
      }

      this.renderCurrentView();
    }
  }

  switchView(viewName) {
    if (!this.components[viewName]) return;
    this.currentView = viewName;

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) activeNav.classList.add('active');

    document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    this.renderCurrentView();
  }

  renderCurrentView() {
    if (!this.currentData) return;

    const targetContainer = document.getElementById(`view-${this.currentView}`);
    if (!targetContainer) return;

    const comp = this.components[this.currentView];
    if (comp && typeof comp.render === 'function') {
      if (this.currentView === 'fleet') {
        comp.render(targetContainer, this.currentData, this.fleetData, this.getAlertsList());
      } else if (this.currentView === 'alerts') {
        comp.render(targetContainer, this.getAlertsList());
      } else {
        comp.render(targetContainer, this.currentData);
      }
    }
  }

  onDriverSelect(val) {
    if (val === 'ADD_NEW_DRIVER') {
      this.toggleAddDriverModal(true);
      return;
    }
    if (window.telemetryEngine && this.currentData) {
      window.telemetryEngine.updateVehicleDriver(this.currentData.vehicleId, val);
    }
  }

  onStartLocSelect(val) {
    if (val === 'ADD_NEW_START') {
      const customLoc = prompt('Enter New Start Pick Location Name:');
      if (customLoc && customLoc.trim()) {
        window.telemetryEngine.addCustomLocation(customLoc.trim());
        window.telemetryEngine.updateVehicleStartLocation(this.currentData.vehicleId, customLoc.trim());
      }
      return;
    }
    if (window.telemetryEngine && this.currentData) {
      window.telemetryEngine.updateVehicleStartLocation(this.currentData.vehicleId, val);
    }
  }

  onDestLocSelect(val) {
    if (val === 'ADD_NEW_DEST') {
      const customLoc = prompt('Enter New Drop Destination Location Name:');
      if (customLoc && customLoc.trim()) {
        window.telemetryEngine.addCustomLocation(customLoc.trim());
        window.telemetryEngine.updateVehicleDestination(this.currentData.vehicleId, customLoc.trim());
      }
      return;
    }
    if (window.telemetryEngine && this.currentData) {
      window.telemetryEngine.updateVehicleDestination(this.currentData.vehicleId, val);
    }
  }

  saveDriverRowDetails(vehId, index) {
    const driverInput = document.getElementById(`driver-name-input-${index}`);
    const locInput = document.getElementById(`driver-loc-input-${index}`);

    const newDriver = driverInput ? driverInput.value.trim() : '';
    const newLoc = locInput ? locInput.value.trim() : '';

    if (window.telemetryEngine) {
      if (newDriver) window.telemetryEngine.updateVehicleDriver(vehId, newDriver);
      if (newLoc) window.telemetryEngine.updateVehicleStartLocation(vehId, newLoc);
      alert(`Updated ${vehId} assignment: Driver "${newDriver}" at "${newLoc}"`);
    }
  }

  toggleAddDriverModal(show) {
    const modal = document.getElementById('add-driver-modal');
    if (modal) {
      modal.style.display = show ? 'flex' : 'none';
      if (show) modal.classList.add('open');
      else modal.classList.remove('open');
    }
  }

  submitNewDriverForm() {
    const vehId = document.getElementById('new-veh-id').value.trim();
    const driverName = document.getElementById('new-driver-name').value.trim();
    const model = document.getElementById('new-veh-model').value.trim() || 'Volvo FH 750 Diesel';
    const location = document.getElementById('new-veh-loc').value.trim() || 'Gothenburg Logistics Hub';
    const speed = parseFloat(document.getElementById('new-veh-speed').value) || 76;

    if (window.telemetryEngine) {
      window.telemetryEngine.addNewVehicle({
        id: vehId,
        driver: driverName,
        model: model,
        location: location,
        speed: speed,
        fuel: 85
      });

      this.toggleAddDriverModal(false);
      this.selectVehicle(vehId);
    }
  }

  toggleAlertModal(show) {
    const modal = document.getElementById('alerts-modal');
    if (modal) {
      modal.style.display = show ? 'flex' : 'none';
      if (show) {
        modal.classList.add('open');
        const content = document.getElementById('modal-alerts-content');
        if (content) {
          this.components.alerts.render(content, this.getAlertsList());
        }
      } else {
        modal.classList.remove('open');
      }
    }
  }

  updateVehicleDropdownOptions(fleet) {
    const selectVeh = document.getElementById('select-vehicle');
    if (!selectVeh) return;

    const currentVal = selectVeh.value;
    selectVeh.innerHTML = fleet.map(v => `
      <option value="${v.id}" ${v.id === currentVal ? 'selected' : ''}>
        ${v.id} (${v.driver})
      </option>
    `).join('');
  }

  updateHeaderSummary() {
    if (!this.currentData) return;

    const statusBadge = document.getElementById('header-status-badge');
    if (statusBadge) {
      const statusClass = (this.currentData.status || 'Running').toLowerCase();
      statusBadge.className = `status-badge ${statusClass}`;
      statusBadge.innerHTML = `<i class="fa-solid fa-circle"></i> ${this.currentData.status}`;
    }

    this.updateVehicleDropdownOptions(this.fleetData);

    const alertDot = document.getElementById('header-alert-dot');
    if (alertDot) {
      const activeAlerts = this.getAlertsList();
      alertDot.style.display = activeAlerts.length > 0 ? 'block' : 'none';
    }
  }

  getAlertsList() {
    if (!this.currentData) return [];

    const alerts = [];
    if (this.currentData.isFuelTheftDetected) {
      alerts.push({ type: 'CRITICAL', title: 'Fuel Theft Anomaly', desc: `Ultrasonic DYP-L02 drop >30L on ${this.currentData.vehicleId}`, time: 'Just now' });
    }
    if (this.currentData.tpms && this.currentData.tpms.some(t => t.press < 95)) {
      alerts.push({ type: 'CRITICAL', title: 'Low Tyre Pressure (<95 PSI)', desc: 'Rear Left Tyre 3 pressure breached minimum threshold', time: '2 mins ago' });
    }
    if (this.currentData.driverDrowsiness) {
      alerts.push({ type: 'WARNING', title: 'Driver Fatigue Alert', desc: 'Cockpit AI camera detected eye closure > 1.5s', time: 'Just now' });
    }
    if (this.currentData.speed > 85) {
      alerts.push({ type: 'WARNING', title: 'Overspeed Warning', desc: `Speed ${this.currentData.speed.toFixed(1)} km/h exceeds 85 km/h threshold`, time: '5 mins ago' });
    }

    return alerts;
  }

  startClock() {
    const clockEl = document.getElementById('telematics-clock');
    const updateTime = () => {
      if (clockEl) {
        const now = new Date();
        clockEl.innerHTML = `<i class="fa-solid fa-clock"></i> ${now.toUTCString().split(' ')[4]} UTC`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new TelematicsApp();
  window.appInstance.init();
});
