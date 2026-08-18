/**
 * AI Telematics Application Controller
 * Handles Navigation, Views Switching, Multi-Vehicle State Binding,
 * Dropdown Handlers for Drivers & Locations, and Centralized Alert Popup Modals.
 */

class TelematicsApp {
  constructor() {
    this.currentView = 'overview';
    this.currentData = null;
    this.fleetData = [];

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

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-view');
        this.switchView(targetView);
      });
    });
  }

  bindVehicleSelector() {
    const selector = document.getElementById('select-vehicle');
    if (selector) {
      selector.addEventListener('change', (e) => {
        const vehicleId = e.target.value;
        this.selectVehicle(vehicleId);
      });
    }
  }

  switchView(viewName) {
    if (!this.components[viewName]) return;

    this.currentView = viewName;

    // Update sidebar navigation active classes
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update page container views
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => v.classList.remove('active'));

    const targetContainer = document.getElementById(`view-${viewName}`);
    if (targetContainer) {
      targetContainer.classList.add('active');
    }

    this.renderCurrentView();
  }

  renderCurrentView() {
    if (!this.currentData) return;

    const comp = this.components[this.currentView];
    const activePanel = document.getElementById(`view-${this.currentView}`);

    if (comp && activePanel) {
      if (this.currentView === 'fleet') {
        comp.render(activePanel, this.currentData, this.fleetData, this.getAlertsList());
      } else if (this.currentView === 'alerts') {
        comp.render(activePanel, this.getAlertsList());
      } else {
        comp.render(activePanel, this.currentData);
      }
    }
  }

  selectVehicle(vehicleId) {
    if (window.telemetryEngine) {
      window.telemetryEngine.selectVehicle(vehicleId);
    }

    const vehSelect = document.getElementById('select-vehicle');
    if (vehSelect) vehSelect.value = vehicleId;

    this.renderCurrentView();
  }

  updateVehicleDropdownOptions(fleet) {
    const vehSelect = document.getElementById('select-vehicle');
    if (!vehSelect || !fleet) return;

    const currentSelected = window.telemetryEngine ? window.telemetryEngine.activeVehicleId : 'VOLVO-FH-001';

    if (vehSelect.options.length !== fleet.length) {
      vehSelect.innerHTML = fleet.map(v => `
        <option value="${v.id}" ${v.id === currentSelected ? 'selected' : ''}>${v.id} (${v.driver})</option>
      `).join('');
    } else {
      vehSelect.value = currentSelected;
    }
  }

  onDriverSelect(val) {
    if (!this.currentData) return;
    if (val === 'ADD_NEW_DRIVER') {
      const newDriver = prompt('Enter New Driver Full Name:');
      if (newDriver && newDriver.trim()) {
        const cleanName = newDriver.trim();
        if (window.telemetryEngine) window.telemetryEngine.addCustomDriver(cleanName);
        this.currentData.driver = cleanName;
        window.telemetryEngine.notify();
      } else {
        this.renderCurrentView();
      }
    } else {
      this.currentData.driver = val;
      if (window.telemetryEngine) window.telemetryEngine.notify();
    }
  }

  onStartLocSelect(val) {
    if (!this.currentData) return;
    if (val === 'ADD_NEW_START') {
      const newLoc = prompt('Enter New Start Location (Pick):');
      if (newLoc && newLoc.trim()) {
        const cleanLoc = newLoc.trim();
        if (window.telemetryEngine) window.telemetryEngine.addCustomLocation(cleanLoc);
        this.currentData.startLocation = cleanLoc;
        window.telemetryEngine.notify();
      } else {
        this.renderCurrentView();
      }
    } else {
      this.currentData.startLocation = val;
      if (window.telemetryEngine) window.telemetryEngine.notify();
    }
  }

  onDestLocSelect(val) {
    if (!this.currentData) return;
    if (val === 'ADD_NEW_DEST') {
      const newLoc = prompt('Enter New Drop Location (Destination):');
      if (newLoc && newLoc.trim()) {
        const cleanLoc = newLoc.trim();
        if (window.telemetryEngine) window.telemetryEngine.addCustomLocation(cleanLoc);
        this.currentData.destination = cleanLoc;
        window.telemetryEngine.notify();
      } else {
        this.renderCurrentView();
      }
    } else {
      this.currentData.destination = val;
      if (window.telemetryEngine) window.telemetryEngine.notify();
    }
  }

  saveDriverRowDetails(vehicleId, index) {
    const driverInput = document.getElementById(`driver-name-input-${index}`);
    const locInput = document.getElementById(`driver-loc-input-${index}`);

    if (!driverInput) return;
    const newDriverName = driverInput.value.trim();
    const newLoc = locInput ? locInput.value.trim() : '';

    if (!newDriverName) return;

    if (window.telemetryEngine && window.telemetryEngine.vehiclesData[vehicleId]) {
      const v = window.telemetryEngine.vehiclesData[vehicleId];
      v.driver = newDriverName;
      if (newLoc) v.locationName = newLoc;
      window.telemetryEngine.updateFleetArray();
      window.telemetryEngine.notify();
    }

    alert(`Saved details for ${vehicleId}:\nDriver: ${newDriverName}${newLoc ? `\nLocation: ${newLoc}` : ''}`);
    if (document.activeElement) document.activeElement.blur();
    this.renderCurrentView();
  }

  toggleAddDriverModal(show) {
    const modal = document.getElementById('add-driver-modal');
    if (!modal) return;

    if (show) {
      modal.classList.add('open');
      modal.style.display = 'flex';
    } else {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }
  }

  submitNewDriverForm() {
    const vehId = document.getElementById('new-veh-id').value.trim();
    const driverName = document.getElementById('new-driver-name').value.trim();
    const model = document.getElementById('new-veh-model').value.trim();
    const loc = document.getElementById('new-veh-loc').value.trim();
    const speed = document.getElementById('new-veh-speed').value;
    const fuel = document.getElementById('new-veh-fuel').value;

    if (!vehId || !driverName) {
      alert('Please fill out Vehicle ID and Driver Name!');
      return;
    }

    if (window.telemetryEngine) {
      window.telemetryEngine.addNewVehicle({
        vehicleId: vehId,
        driver: driverName,
        model: model || 'Volvo FH 750 Diesel',
        location: loc || 'Gothenburg Logistics Terminal',
        speed: speed || 76,
        fuel: fuel || 85,
        health: 96
      });
    }

    this.toggleAddDriverModal(false);
    alert(`Vehicle ${vehId} registered successfully with driver ${driverName}!`);
  }

  toggleAlertModal(show) {
    const modal = document.getElementById('alerts-modal');
    const content = document.getElementById('modal-alerts-content');

    if (!modal || !content) return;

    if (show) {
      this.components.alerts.render(content, this.getAlertsList());
      modal.classList.add('open');
      modal.style.display = 'flex';
    } else {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }
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
