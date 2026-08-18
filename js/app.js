/**
 * Main Telematics Application Router & Controller
 * Multi-Vehicle Dynamic Switching, Route Config, Add Driver/Vehicle & Modal Controllers
 */

class TelematicsApp {
  constructor() {
    this.currentViewId = 'overview';
    this.components = {};
    this.alertsComponent = null;

    try {
      if (window.AlertsComponent) {
        this.alertsComponent = new window.AlertsComponent();
      }
    } catch(e) {
      console.warn('AlertsComponent init warning:', e);
    }

    this.init();
  }

  getComponent(viewId) {
    if (!this.components[viewId]) {
      const classMap = {
        overview: window.OverviewComponent,
        dynamics: window.DynamicsComponent,
        tilt: window.TiltComponent,
        fuel: window.FuelComponent,
        tpms: window.TPMSComponent,
        cameras: window.CamerasComponent,
        battery: window.BatteryComponent,
        fleet: window.FleetComponent,
        maintenance: window.MaintenanceComponent
      };

      const CompClass = classMap[viewId];
      if (CompClass) {
        try {
          this.components[viewId] = new CompClass();
        } catch (err) {
          console.error(`Error instantiating component ${viewId}:`, err);
        }
      }
    }
    return this.components[viewId];
  }

  init() {
    // 1. Setup Navigation Event Listeners
    try {
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const targetView = item.getAttribute('data-view');
          this.switchView(targetView);
        });
      });
    } catch(err) {
      console.error('Nav setup error:', err);
    }

    // 2. Setup Vehicle Selector Listener
    try {
      const vehSelect = document.getElementById('select-vehicle');
      if (vehSelect) {
        vehSelect.addEventListener('change', (e) => {
          this.selectVehicle(e.target.value);
        });
      }
    } catch(err) {
      console.error('Vehicle select setup error:', err);
    }

    // 3. Start Header Telematics Clock Immediately
    this.startClock();

    // 4. Subscribe to Live Telemetry Simulation Updates
    if (window.telemetryEngine && typeof window.telemetryEngine.subscribe === 'function') {
      window.telemetryEngine.subscribe((telemetry, fleet, alerts) => {
        this.currentData = telemetry;
        this.currentFleet = fleet;
        this.currentAlerts = alerts;
        this.updateVehicleDropdownOptions(fleet);
        this.updateHeaderBadgeCounts(alerts);
        this.renderCurrentView();
        if (this.isAlertModalOpen) {
          this.renderAlertsModalContent();
        }
      });
    }

    // Force Initial Render
    this.switchView('overview');
  }

  switchView(viewId) {
    this.currentViewId = viewId;

    // Update sidebar UI state
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide all view panels and show active panel
    document.querySelectorAll('.page-view').forEach(panel => {
      if (panel.id === `view-${viewId}`) {
        panel.classList.add('active');
        panel.style.display = 'block';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });

    const activePanel = document.getElementById(`view-${viewId}`);
    if (activePanel) {
      const comp = this.getComponent(viewId);
      if (comp && typeof comp.render === 'function') {
        try {
          comp.render(activePanel, this.currentData, this.currentFleet, this.currentAlerts);
        } catch(err) {
          console.error(`Error rendering view ${viewId}:`, err);
        }
      }
    }
  }

  selectVehicle(vehicleId) {
    if (window.telemetryEngine) {
      window.telemetryEngine.selectVehicle(vehicleId);
      this.currentData = window.telemetryEngine.telemetry;
    }

    const vehSelect = document.getElementById('select-vehicle');
    if (vehSelect) vehSelect.value = vehicleId;

    this.renderCurrentView();
  }

  updateVehicleDropdownOptions(fleet) {
    const vehSelect = document.getElementById('select-vehicle');
    if (!vehSelect || !fleet) return;

    const currentSelected = window.telemetryEngine ? window.telemetryEngine.activeVehicleId : 'VOLVO-FH-001';

    // Update dropdown options if fleet count changed
    if (vehSelect.options.length !== fleet.length) {
      vehSelect.innerHTML = fleet.map(v => `
        <option value="${v.id}" ${v.id === currentSelected ? 'selected' : ''}>${v.id} (${v.driver})</option>
      `).join('');
    } else {
      vehSelect.value = currentSelected;
    }
  }

  updateRouteLocations() {
    const startInput = document.getElementById('input-start-loc');
    const destInput = document.getElementById('input-dest-loc');

    if (startInput && destInput && this.currentData) {
      const startVal = startInput.value.trim();
      const destVal = destInput.value.trim();
      if (!startVal || !destVal) return;

      this.currentData.startLocation = startVal;
      this.currentData.destination = destVal;
      this.currentData.distanceRemaining = Math.round(320 + Math.random() * 100);
      this.currentData.eta = `${Math.floor(this.currentData.distanceRemaining / 75)}h ${(this.currentData.distanceRemaining % 60)}m`;

      alert(`Route Locations Updated for ${this.currentData.vehicleId}!\nStart Location: ${startVal}\nStop Destination: ${destVal}\nDistance Remaining: ${this.currentData.distanceRemaining} km`);
      
      if (document.activeElement) document.activeElement.blur();
      this.renderCurrentView();
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
        health: 96,
        route: 'Compliant'
      });
    }

    this.toggleAddDriverModal(false);
    alert(`Successfully registered new driver ${driverName} with Vehicle ID ${vehId}!`);
    this.selectVehicle(vehId);
  }

  toggleAlertModal(show) {
    const modal = document.getElementById('alerts-modal');
    if (!modal) return;

    this.isAlertModalOpen = show;
    if (show) {
      modal.classList.add('open');
      modal.style.display = 'flex';
      this.renderAlertsModalContent();
    } else {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }
  }

  renderAlertsModalContent() {
    const modalContent = document.getElementById('modal-alerts-content');
    if (modalContent) {
      if (!this.alertsComponent && window.AlertsComponent) {
        this.alertsComponent = new window.AlertsComponent();
      }
      if (this.alertsComponent) {
        this.alertsComponent.render(modalContent, this.currentData, this.currentFleet, this.currentAlerts);
      }
    }
  }

  renderCurrentView() {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      return;
    }

    const activePanel = document.getElementById(`view-${this.currentViewId}`);
    if (!activePanel) return;

    const comp = this.getComponent(this.currentViewId);
    if (comp && typeof comp.render === 'function') {
      try {
        comp.render(activePanel, this.currentData, this.currentFleet, this.currentAlerts);
      } catch(err) {
        console.error(`Error re-rendering ${this.currentViewId}:`, err);
      }
    }
  }

  updateHeaderBadgeCounts(alerts) {
    const counterEl = document.getElementById('alert-counter-badge');
    const headerDot = document.getElementById('header-alert-dot');
    if (counterEl) counterEl.textContent = alerts ? alerts.length : 0;
    if (headerDot) headerDot.style.display = (alerts && alerts.length > 0) ? 'block' : 'none';
  }

  startClock() {
    const clockEl = document.getElementById('telematics-clock');
    if (!clockEl) return;

    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const dateStr = now.toISOString().split('T')[0];
      clockEl.innerHTML = `<i class="fa-solid fa-clock"></i> ${dateStr} ${timeStr} UTC`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }
}

// Reliable boot trigger
function bootApp() {
  if (!window.appInstance) {
    try {
      window.appInstance = new TelematicsApp();
    } catch(err) {
      console.error('Fatal TelematicsApp Boot Error:', err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
