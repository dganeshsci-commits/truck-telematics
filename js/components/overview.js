/**
 * Slide 1: Main Overview Dashboard Component
 * Version 2: Enhanced Destination & Trip Block Card
 * Features: Trip No, Date, Start/End Timestamps, Preset & Custom Dropdown Selectors for Driver, Start (Pick), and Drop (Destination) Locations.
 */

class OverviewComponent {
  constructor() {
    this.map = null;
    this.truckMarker = null;
    this.routePolyline = null;
    this.actualPolyline = null;
    this.geofenceCircle = null;
    this.actualPathPoints = [];
  }

  render(container, data) {
    const statusClass = (data.status || 'Running').toLowerCase();
    const defaultLocations = (window.telemetryEngine && window.telemetryEngine.defaultLocations) ? window.telemetryEngine.defaultLocations : [
      'Gothenburg Logistics Hub', 'Stockholm Freight Terminal', 'Malmö Transport Depot', 'Jönköping Cargo Hub'
    ];
    const defaultDrivers = (window.telemetryEngine && window.telemetryEngine.defaultDrivers) ? window.telemetryEngine.defaultDrivers : [
      'Erik Lindqvist', 'Lars Svensson', 'Astrid Nilsson', 'Johan Berg', 'Karin Olsson'
    ];

    // Ensure active vehicle locations & driver are in default lists
    if (!defaultLocations.includes(data.startLocation)) defaultLocations.unshift(data.startLocation);
    if (!defaultLocations.includes(data.destination)) defaultLocations.push(data.destination);
    if (!defaultDrivers.includes(data.driver)) defaultDrivers.unshift(data.driver);
    
    // 1. In-place update if overview layout is already rendered to PREVENT BLINKING!
    if (container.querySelector('#ov-val-veh')) {
      this.updateInPlace(data, statusClass, defaultLocations, defaultDrivers);
      return;
    }

    // Cleanup old Leaflet map reference if DOM container was replaced
    const mapElement = document.getElementById('leaflet-map');
    if (this.map && mapElement && !mapElement.contains(this.map.getContainer())) {
      try { this.map.remove(); } catch(e){}
      this.map = null;
    }

    container.innerHTML = `
      <!-- Alert Banner if Theft or Critical event -->
      ${data.isFuelTheftDetected ? `
        <div class="alert-banner">
          <div class="alert-banner-content">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div class="alert-banner-text">
              <h3>POSSIBLE FUEL THEFT DETECTED</h3>
              <p>Vehicle ${data.vehicleId} engine is OFF, but fuel volume dropped abruptly by >30L. Ultrasonic height sensor DYP-L02 anomaly flagged.</p>
            </div>
          </div>
          <button class="alert-close" onclick="window.telemetryEngine.resetAllTriggers()">&times;</button>
        </div>
      ` : ''}

      <!-- Top KPI Cards Grid -->
      <div class="grid-container grid-cols-4" style="margin-bottom: 20px;">
        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-truck"></i> Vehicle Name</span>
            <span class="card-tag sensor">VOLVO-FH</span>
          </div>
          <div class="metric-val" style="font-size: 20px;" id="ov-val-veh">${data.vehicleId}</div>
          <div class="metric-label" id="ov-val-model">${data.model}</div>
          <div class="metric-trend" id="ov-val-status"><span class="status-badge ${statusClass}">${data.status}</span></div>
        </div>

        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-user"></i> Driver Name</span>
            <span class="card-tag ai">RFID LINKED</span>
          </div>
          <div class="metric-val" style="font-size: 20px;" id="ov-val-driver">${data.driver}</div>
          <div class="metric-label">Engine: <strong style="color:${data.engineStatus === 'ON' ? 'var(--success)' : 'var(--danger)'}; font-size: 14px;" id="ov-val-eng">${data.engineStatus}</strong></div>
          <div class="metric-trend up"><i class="fa-solid fa-check"></i> Driver ID Verified</div>
        </div>

        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-gauge-high"></i> Speed</span>
            <span class="card-tag sensor">GPS SPEED</span>
          </div>
          <div class="metric-val" id="ov-val-speed">${data.speed.toFixed(1)} <span class="metric-unit">km/h</span></div>
          <div class="metric-label">Governor Limit: ${data.maxSpeed} km/h</div>
          <div class="metric-trend" id="ov-val-odo"><i class="fa-solid fa-route"></i> Odo: ${data.totalDistance.toLocaleString()} km</div>
        </div>

        <div class="card metric-box">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-bolt"></i> Battery Voltage</span>
            <span class="card-tag sensor">24V SYSTEM</span>
          </div>
          <div class="metric-val" id="ov-val-bat">${data.batteryVoltage} <span class="metric-unit">V</span></div>
          <div class="metric-label">24V Commercial Starter</div>
          <div class="metric-trend up" id="ov-val-soc"><i class="fa-solid fa-battery-full"></i> SoC: ${data.batterySoc}%</div>
        </div>
      </div>

      <!-- Main Map & Enhanced Destination Block Split View -->
      <div class="grid-container grid-cols-12">
        <div class="card span-7">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-map-location-dot"></i> Live GPS Location Integration</span>
            <span class="card-tag ai">LIVE GPS / MAPS TILES</span>
          </div>
          <div id="leaflet-map" style="height: 440px; width: 100%; border-radius: var(--radius-md); background: #070a12;"></div>
        </div>

        <!-- Destination & Trip Block Card with Dropdown Selectors -->
        <div class="card span-5" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-route"></i> Destination & Trip Block</span>
            <span class="card-tag sensor">TRIP CONFIG</span>
          </div>

          <!-- Trip Info Sub-Card -->
          <div style="background: rgba(0, 210, 255, 0.06); border: 1px solid var(--border-glow); border-radius: var(--radius-md); padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div>
                <span style="font-size: 10px; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">TRIP NUMBER</span>
                <div style="font-size: 18px; font-weight: 900; color: #fff;" id="ov-val-tripno">${data.tripNo || '#TRIP-026'}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 10px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">DATE</span>
                <div style="font-size: 13px; font-weight: 700; color: var(--text-main);" id="ov-val-tripdate">${data.tripDate || '2026-08-18'}</div>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px;">
              <div>
                <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;"><i class="fa-regular fa-clock" style="color: var(--success);"></i> Start Time:</span>
                <div style="font-size: 13px; font-weight: 700; color: var(--success);" id="ov-val-starttime">${data.startTime || '08:30 AM'}</div>
              </div>
              <div>
                <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;"><i class="fa-solid fa-flag-checkered" style="color: var(--warning);"></i> End Time (Est):</span>
                <div style="font-size: 13px; font-weight: 700; color: var(--warning);" id="ov-val-endtime">${data.endTime || '04:45 PM'}</div>
              </div>
            </div>
          </div>

          <!-- Dropdown 1: Driver Selection -->
          <div class="edit-input-group">
            <label><i class="fa-solid fa-user-gear" style="color: var(--primary);"></i> Assigned Driver:</label>
            <select id="select-driver-name" class="edit-input-field" onchange="window.appInstance.onDriverSelect(this.value)">
              ${defaultDrivers.map(d => `<option value="${d}" ${d === data.driver ? 'selected' : ''}>${d}</option>`).join('')}
              <option value="ADD_NEW_DRIVER" style="color: var(--primary); font-weight: 700;">+ Add New Driver...</option>
            </select>
          </div>

          <!-- Dropdown 2: Start Location (Pick) -->
          <div class="edit-input-group">
            <label><i class="fa-solid fa-circle-dot" style="color: var(--success);"></i> Start Location (Pick):</label>
            <select id="select-start-loc" class="edit-input-field" onchange="window.appInstance.onStartLocSelect(this.value)">
              ${defaultLocations.map(l => `<option value="${l}" ${l === data.startLocation ? 'selected' : ''}>${l}</option>`).join('')}
              <option value="ADD_NEW_START" style="color: var(--success); font-weight: 700;">+ Add New Start Location...</option>
            </select>
          </div>

          <!-- Dropdown 3: Drop Location (Destination) -->
          <div class="edit-input-group">
            <label><i class="fa-solid fa-location-dot" style="color: var(--danger);"></i> Drop Location (Destination):</label>
            <select id="select-dest-loc" class="edit-input-field" onchange="window.appInstance.onDestLocSelect(this.value)">
              ${defaultLocations.map(l => `<option value="${l}" ${l === data.destination ? 'selected' : ''}>${l}</option>`).join('')}
              <option value="ADD_NEW_DEST" style="color: var(--danger); font-weight: 700;">+ Add New Drop Location...</option>
            </select>
          </div>

          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Compliance</div>
                <div style="font-size: 13px; font-weight: 800; color: ${data.routeCompliance === 'Compliant' ? 'var(--success)' : 'var(--danger)'};" id="ov-val-comp">
                  ${data.routeCompliance}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Distance Remaining</div>
                <div style="font-size: 13px; font-weight: 800; color: var(--primary);" id="ov-val-dist">${data.distanceRemaining} km</div>
              </div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: var(--success); font-weight: 600;" id="ov-val-eta">
              <i class="fa-solid fa-clock"></i> Estimated Arrival: ${data.eta}
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.initOrUpdateMap(data);
    }, 100);
  }

  updateInPlace(data, statusClass, defaultLocations, defaultDrivers) {
    const elVeh = document.getElementById('ov-val-veh');
    if (elVeh) elVeh.textContent = data.vehicleId;

    const elModel = document.getElementById('ov-val-model');
    if (elModel) elModel.textContent = data.model;

    const elDriver = document.getElementById('ov-val-driver');
    if (elDriver) elDriver.textContent = data.driver;

    const elEng = document.getElementById('ov-val-eng');
    if (elEng) {
      elEng.textContent = data.engineStatus;
      elEng.style.color = data.engineStatus === 'ON' ? 'var(--success)' : 'var(--danger)';
    }

    const elSpeed = document.getElementById('ov-val-speed');
    if (elSpeed) elSpeed.innerHTML = `${data.speed.toFixed(1)} <span class="metric-unit">km/h</span>`;

    const elBat = document.getElementById('ov-val-bat');
    if (elBat) elBat.innerHTML = `${data.batteryVoltage} <span class="metric-unit">V</span>`;

    const elTripNo = document.getElementById('ov-val-tripno');
    if (elTripNo) elTripNo.textContent = data.tripNo || '#TRIP-026';

    const elTripDate = document.getElementById('ov-val-tripdate');
    if (elTripDate) elTripDate.textContent = data.tripDate || '2026-08-18';

    const elStartT = document.getElementById('ov-val-starttime');
    if (elStartT) elStartT.textContent = data.startTime || '08:30 AM';

    const elEndT = document.getElementById('ov-val-endtime');
    if (elEndT) elEndT.textContent = data.endTime || '04:45 PM';

    const elDist = document.getElementById('ov-val-dist');
    if (elDist) elDist.textContent = `${data.distanceRemaining} km`;

    const elEta = document.getElementById('ov-val-eta');
    if (elEta) elEta.innerHTML = `<i class="fa-solid fa-clock"></i> Estimated Arrival: ${data.eta}`;

    this.initOrUpdateMap(data);
  }

  initOrUpdateMap(data) {
    const mapElement = document.getElementById('leaflet-map');
    if (!mapElement) return;

    if (typeof L === 'undefined') {
      mapElement.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #070a12; border-radius: 8px; border: 1px solid var(--border-color); padding: 20px; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-map-location-dot" style="font-size: 42px; color: var(--primary); margin-bottom: 12px;"></i>
          <div style="font-size: 16px; font-weight: 800; color: #fff;">LIVE GPS TELEMATICS TRACKER</div>
          <div style="font-size: 13px; color: var(--success); font-weight: 700; margin-top: 4px;">CURRENT LOCATION: ${data.locationName}</div>
          <div style="font-size: 12px; font-family: monospace; color: var(--primary); margin-top: 4px;">LAT: ${data.currentLat.toFixed(5)}, LNG: ${data.currentLng.toFixed(5)}</div>
          <div style="font-size: 11px; color: var(--text-dim); margin-top: 10px;">Route: ${data.startLocation} &rarr; ${data.destination} (${data.distanceRemaining} km remaining)</div>
        </div>
      `;
      return;
    }

    if (this.map && (!mapElement.contains(this.map.getContainer()) || !document.body.contains(mapElement))) {
      try { this.map.remove(); } catch(e){}
      this.map = null;
    }

    const truckCoords = [data.currentLat, data.currentLng];

    if (!this.map) {
      try {
        this.map = L.map('leaflet-map', {
          zoomControl: true,
          attributionControl: false
        }).setView(truckCoords, 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(this.map);

        const depotCoords = [57.70887, 11.97456];
        this.geofenceCircle = L.circle(depotCoords, {
          color: '#00e676',
          fillColor: '#00e676',
          fillOpacity: 0.1,
          radius: 1200
        }).addTo(this.map).bindPopup('Geofence Zone: GOTH-HUB-01');

        const plannedRoute = window.telemetryEngine ? window.telemetryEngine.plannedRoute : [];
        if (plannedRoute.length > 0) {
          this.routePolyline = L.polyline(plannedRoute, {
            color: '#00d2ff',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.7
          }).addTo(this.map);
        }

        const truckIcon = L.divIcon({
          className: 'custom-truck-marker',
          html: `
            <div style="
              width: 36px;
              height: 36px;
              background: linear-gradient(135deg, #00d2ff, #3a86ff);
              border: 2px solid #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              box-shadow: 0 0 15px rgba(0, 210, 255, 0.8);
            ">
              <i class="fa-solid fa-truck-front" style="font-size: 16px;"></i>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        this.truckMarker = L.marker(truckCoords, { icon: truckIcon })
          .addTo(this.map)
          .bindPopup(`<b>${data.vehicleId}</b><br>Speed: ${data.speed.toFixed(1)} km/h<br>Driver: ${data.driver}`);

        this.actualPolyline = L.polyline([], {
          color: '#ff3d71',
          weight: 3
        }).addTo(this.map);

        this.map.invalidateSize();
      } catch(err) {
        console.error('Leaflet map init error:', err);
      }
    } else {
      this.truckMarker.setLatLng(truckCoords);
      this.truckMarker.getPopup().setContent(`<b>${data.vehicleId}</b><br>Speed: ${data.speed.toFixed(1)} km/h<br>Status: ${data.routeCompliance}`);
      this.map.panTo(truckCoords);

      this.actualPathPoints.push(truckCoords);
      if (this.actualPathPoints.length > 50) this.actualPathPoints.shift();
      this.actualPolyline.setLatLngs(this.actualPathPoints);
      this.map.invalidateSize();
    }
  }
}

window.OverviewComponent = OverviewComponent;
