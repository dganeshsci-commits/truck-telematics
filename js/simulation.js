/**
 * AI-Powered Truck Fleet Telematics Simulation Engine
 * Supports Multi-Vehicle Telemetry States (VOLVO-FH-001, 002, 003, 004 & custom added vehicles)
 */

class TelemetrySimulationEngine {
  constructor() {
    this.listeners = [];
    this.activeVehicleId = 'VOLVO-FH-001';

    // Interactive Trigger Flags
    this.flags = {
      fuelTheftActive: false,
      steepInclineActive: false,
      tyreLeakActive: false,
      drowsinessActive: false,
      routeDeviatedActive: false
    };

    // Planned GPS Routes
    this.plannedRoutes = {
      'VOLVO-FH-001': [
        [57.70887, 11.97456], [57.71250, 11.98120], [57.71900, 11.99200], [57.72800, 12.00800],
        [57.73900, 12.02500], [57.75100, 12.04900], [57.76500, 12.07200], [57.78000, 12.09900]
      ],
      'VOLVO-FH-002': [
        [55.60500, 13.00380], [55.61200, 13.01500], [55.62500, 13.03800], [55.63900, 13.06000]
      ],
      'VOLVO-FH-003': [
        [57.78140, 14.16100], [57.79500, 14.18000], [57.81000, 14.20500], [57.83000, 14.23500]
      ],
      'VOLVO-FH-004': [
        [58.58770, 16.18240], [58.58770, 16.18240]
      ]
    };

    // Multi-Vehicle Independent Telemetry States Database
    this.vehiclesData = {
      'VOLVO-FH-001': {
        vehicleId: 'VOLVO-FH-001',
        model: 'Volvo FH16 750 6x2 Diesel Heavy-Duty',
        driver: 'Erik Lindqvist',
        status: 'Running',
        engineStatus: 'ON',
        totalDistance: 148290.4,
        tripDistance: 312.8,
        locationName: 'E6 Highway, Km 42 Northbound',
        startLocation: 'Gothenburg Logistics Hub',
        destination: 'Stockholm Freight Terminal',
        currentLat: 57.71900,
        currentLng: 11.99200,
        distanceRemaining: 442.2,
        eta: '4h 18m',
        routeCompliance: 'Compliant',
        geofenceStatus: 'Inside Zone (GOTH-HUB-01)',
        speed: 78.4,
        maxSpeed: 90.0,
        avgSpeed: 72.5,
        acceleration: 0.15,
        deceleration: 0.0,
        brakingIntensity: 0.05,
        harshAccelEvents: 2,
        harshBrakingEvents: 1,
        corneringEvents: 3,
        overspeedEvents: 1,
        drivingScore: 87,
        drivingStatus: 'Good',
        tankCapacity: 450.0,
        rawFuelHeight: 318.0,
        rawFuelVolume: 318.0,
        correctedFuelHeight: 325.0,
        correctedFuelVolume: 325.0,
        fuelPercent: 72.2,
        estimatedRange: 940.0,
        instantConsumption: 28.4,
        avgConsumption: 32.6,
        tripFuelConsumed: 102.0,
        totalFuelConsumed: 48390.0,
        fuelEconomy: 3.07,
        isLowFuel: false,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: 2.4,
        roll: -1.2,
        yaw: 15.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 105.2, temp: 42.1, status: 'NORMAL' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 104.8, temp: 41.5, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 96.4, temp: 68.2, status: 'WARNING' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 106.1, temp: 43.8, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 105.5, temp: 42.9, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 105.8, temp: 43.1, status: 'NORMAL' }
        ],
        batteryVoltage: 27.4,
        batteryCurrent: 14.2,
        batterySoc: 94,
        batterySoh: 91,
        batteryTemp: 28.5,
        batteryStatus: 'CHARGING',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 92,
        components: {
          engine: { score: 96, risk: 'Low', status: 'Healthy', predictedMaint: '25,000 km' },
          battery: { score: 91, risk: 'Low', status: 'Healthy', predictedMaint: '18,000 km' },
          tyres: { score: 78, risk: 'Medium', status: 'Inspect Pressure', predictedMaint: '5,000 km' },
          braking: { score: 94, risk: 'Low', status: 'Healthy', predictedMaint: '30,000 km' },
          fuelSystem: { score: 98, risk: 'Low', status: 'Healthy', predictedMaint: '40,000 km' },
          cooling: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '35,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [72, 75, 78, 81, 79, 77, 78.4],
          acceleration: [0.1, 0.2, 0.15, -0.3, 0.0, 0.1, 0.15],
          rawFuel: [330, 328, 325, 322, 320, 319, 318],
          correctedFuel: [335, 333, 331, 329, 327, 326, 325],
          fuelConsumption: [27, 29, 31, 28, 27, 28, 28.4],
          tyrePressures: [
            [105, 105, 105.1, 105.2, 105.2, 105.2, 105.2],
            [104, 104.2, 104.5, 104.7, 104.8, 104.8, 104.8],
            [102, 100, 98.5, 97.2, 96.8, 96.5, 96.4],
            [106, 106, 106.1, 106.1, 106.1, 106.1, 106.1],
            [105, 105.2, 105.3, 105.4, 105.5, 105.5, 105.5],
            [105, 105.4, 105.6, 105.7, 105.8, 105.8, 105.8]
          ],
          tyreTemps: [
            [40, 40.5, 41, 41.5, 41.8, 42, 42.1],
            [40, 40.2, 40.8, 41.1, 41.3, 41.4, 41.5],
            [50, 54, 58, 62, 65, 67, 68.2],
            [41, 41.5, 42, 42.6, 43, 43.5, 43.8],
            [40, 40.8, 41.4, 42, 42.4, 42.7, 42.9],
            [40, 41, 41.6, 42.1, 42.6, 42.9, 43.1]
          ]
        }
      },

      'VOLVO-FH-002': {
        vehicleId: 'VOLVO-FH-002',
        model: 'Volvo FH 500 4x2 Tractor',
        driver: 'Lars Svensson',
        status: 'Running',
        engineStatus: 'ON',
        totalDistance: 92410.0,
        tripDistance: 185.2,
        locationName: 'E22 Highway, Malmö Southbound',
        startLocation: 'Malmö Distribution Center',
        destination: 'Copenhagen Cargo Hub',
        currentLat: 55.60500,
        currentLng: 13.00380,
        distanceRemaining: 62.5,
        eta: '0h 45m',
        routeCompliance: 'Compliant',
        geofenceStatus: 'Inside Zone (MALMO-02)',
        speed: 84.2,
        maxSpeed: 90.0,
        avgSpeed: 80.1,
        acceleration: 0.22,
        deceleration: 0.0,
        brakingIntensity: 0.02,
        harshAccelEvents: 0,
        harshBrakingEvents: 0,
        corneringEvents: 1,
        overspeedEvents: 0,
        drivingScore: 95,
        drivingStatus: 'Excellent',
        tankCapacity: 400.0,
        rawFuelHeight: 340.0,
        rawFuelVolume: 340.0,
        correctedFuelHeight: 341.0,
        correctedFuelVolume: 341.0,
        fuelPercent: 85.25,
        estimatedRange: 1120.0,
        instantConsumption: 26.1,
        avgConsumption: 30.2,
        tripFuelConsumed: 56.0,
        totalFuelConsumed: 27900.0,
        fuelEconomy: 3.31,
        isLowFuel: false,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: -4.5,
        roll: 3.2,
        yaw: -8.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 106.0, temp: 39.0, status: 'NORMAL' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 106.2, temp: 39.2, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 105.8, temp: 41.0, status: 'NORMAL' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 105.9, temp: 41.2, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 106.1, temp: 41.1, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 106.0, temp: 41.3, status: 'NORMAL' }
        ],
        batteryVoltage: 27.8,
        batteryCurrent: 18.5,
        batterySoc: 98,
        batterySoh: 96,
        batteryTemp: 26.0,
        batteryStatus: 'CHARGING',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 97,
        components: {
          engine: { score: 98, risk: 'Low', status: 'Healthy', predictedMaint: '32,000 km' },
          battery: { score: 96, risk: 'Low', status: 'Healthy', predictedMaint: '28,000 km' },
          tyres: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '22,000 km' },
          braking: { score: 97, risk: 'Low', status: 'Healthy', predictedMaint: '35,000 km' },
          fuelSystem: { score: 99, risk: 'Low', status: 'Healthy', predictedMaint: '45,000 km' },
          cooling: { score: 98, risk: 'Low', status: 'Healthy', predictedMaint: '40,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [80, 82, 83, 85, 84, 84.5, 84.2],
          acceleration: [0.1, 0.1, 0.2, 0.1, 0.0, 0.1, 0.22],
          rawFuel: [346, 345, 344, 343, 342, 341, 340],
          correctedFuel: [347, 346, 345, 344, 343, 342, 341],
          fuelConsumption: [25, 26, 26, 27, 26, 26, 26.1],
          tyrePressures: [
            [106, 106, 106, 106, 106, 106, 106],
            [106.2, 106.2, 106.2, 106.2, 106.2, 106.2, 106.2],
            [105.8, 105.8, 105.8, 105.8, 105.8, 105.8, 105.8],
            [105.9, 105.9, 105.9, 105.9, 105.9, 105.9, 105.9],
            [106.1, 106.1, 106.1, 106.1, 106.1, 106.1, 106.1],
            [106, 106, 106, 106, 106, 106, 106]
          ],
          tyreTemps: [
            [38, 38.2, 38.5, 38.8, 39, 39, 39],
            [38, 38.3, 38.6, 38.9, 39.1, 39.2, 39.2],
            [39, 39.5, 40, 40.5, 40.8, 41, 41],
            [39, 39.5, 40.1, 40.6, 40.9, 41.1, 41.2],
            [39, 39.4, 40, 40.4, 40.7, 41, 41.1],
            [39, 39.5, 40.1, 40.6, 40.9, 41.2, 41.3]
          ]
        }
      },

      'VOLVO-FH-003': {
        vehicleId: 'VOLVO-FH-003',
        model: 'Volvo FH 460 6x4 Heavy Transport',
        driver: 'Astrid Nilsson',
        status: 'Running',
        engineStatus: 'ON',
        totalDistance: 215800.0,
        tripDistance: 410.5,
        locationName: 'Route 40, Jönköping Incline',
        startLocation: 'Jönköping Logistics Park',
        destination: 'Oslo Cargo Depot',
        currentLat: 57.78140,
        currentLng: 14.16100,
        distanceRemaining: 310.0,
        eta: '3h 30m',
        routeCompliance: 'Deviated',
        geofenceStatus: 'Outside Geofence (Route Deviation)',
        speed: 65.2,
        maxSpeed: 90.0,
        avgSpeed: 61.4,
        acceleration: -0.4,
        deceleration: 0.4,
        brakingIntensity: 0.25,
        harshAccelEvents: 4,
        harshBrakingEvents: 3,
        corneringEvents: 5,
        overspeedEvents: 2,
        drivingScore: 68,
        drivingStatus: 'Needs Review',
        tankCapacity: 500.0,
        rawFuelHeight: 240.0,
        rawFuelVolume: 240.0,
        correctedFuelHeight: 245.0,
        correctedFuelVolume: 245.0,
        fuelPercent: 49.0,
        estimatedRange: 680.0,
        instantConsumption: 38.5,
        avgConsumption: 36.8,
        tripFuelConsumed: 151.0,
        totalFuelConsumed: 79400.0,
        fuelEconomy: 2.71,
        isLowFuel: false,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: 6.8,
        roll: -2.1,
        yaw: 42.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 92.1, temp: 58.5, status: 'CRITICAL' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 104.0, temp: 44.0, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 103.5, temp: 45.1, status: 'NORMAL' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 103.8, temp: 45.4, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 104.1, temp: 44.8, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 104.0, temp: 44.9, status: 'NORMAL' }
        ],
        batteryVoltage: 26.2,
        batteryCurrent: 8.4,
        batterySoc: 78,
        batterySoh: 82,
        batteryTemp: 34.0,
        batteryStatus: 'CHARGING',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 74,
        components: {
          engine: { score: 82, risk: 'Medium', status: 'High Load', predictedMaint: '8,000 km' },
          battery: { score: 82, risk: 'Low', status: 'Healthy', predictedMaint: '12,000 km' },
          tyres: { score: 62, risk: 'High', status: 'Low Pressure FL', predictedMaint: '1,200 km' },
          braking: { score: 75, risk: 'Medium', status: 'Brake Wear', predictedMaint: '6,000 km' },
          fuelSystem: { score: 90, risk: 'Low', status: 'Healthy', predictedMaint: '25,000 km' },
          cooling: { score: 80, risk: 'Medium', status: 'Warm Temp', predictedMaint: '10,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [60, 62, 64, 63, 65, 66, 65.2],
          acceleration: [0.1, 0.2, -0.1, 0.2, -0.2, -0.4, -0.4],
          rawFuel: [252, 250, 248, 246, 244, 242, 240],
          correctedFuel: [257, 255, 253, 251, 249, 247, 245],
          fuelConsumption: [35, 36, 37, 39, 38, 38, 38.5],
          tyrePressures: [
            [98, 96, 95, 94, 93, 92.5, 92.1],
            [104, 104, 104, 104, 104, 104, 104],
            [103.5, 103.5, 103.5, 103.5, 103.5, 103.5, 103.5],
            [103.8, 103.8, 103.8, 103.8, 103.8, 103.8, 103.8],
            [104.1, 104.1, 104.1, 104.1, 104.1, 104.1, 104.1],
            [104, 104, 104, 104, 104, 104, 104]
          ],
          tyreTemps: [
            [48, 50, 52, 54, 56, 57.5, 58.5],
            [43, 43.2, 43.5, 43.8, 44, 44, 44],
            [44, 44.2, 44.5, 44.8, 45, 45, 45.1],
            [44, 44.3, 44.6, 44.9, 45.2, 45.3, 45.4],
            [43.5, 43.8, 44.1, 44.4, 44.6, 44.7, 44.8],
            [43.5, 43.9, 44.2, 44.5, 44.7, 44.8, 44.9]
          ]
        }
      },

      'VOLVO-FH-004': {
        vehicleId: 'VOLVO-FH-004',
        model: 'Volvo FH Electric 6x2',
        driver: 'Johan Berg',
        status: 'Offline',
        engineStatus: 'OFF',
        totalDistance: 48920.0,
        tripDistance: 0.0,
        locationName: 'Norrköping Depot Gate 4',
        startLocation: 'Norrköping Logistics Depot',
        destination: 'Norrköping Logistics Depot',
        currentLat: 58.58770,
        currentLng: 16.18240,
        distanceRemaining: 0.0,
        eta: '0h 0m',
        routeCompliance: 'Compliant',
        geofenceStatus: 'Inside Depot Base',
        speed: 0.0,
        maxSpeed: 90.0,
        avgSpeed: 0.0,
        acceleration: 0.0,
        deceleration: 0.0,
        brakingIntensity: 0.0,
        harshAccelEvents: 0,
        harshBrakingEvents: 0,
        corneringEvents: 0,
        overspeedEvents: 0,
        drivingScore: 100,
        drivingStatus: 'Parked',
        tankCapacity: 450.0,
        rawFuelHeight: 405.0,
        rawFuelVolume: 405.0,
        correctedFuelHeight: 405.0,
        correctedFuelVolume: 405.0,
        fuelPercent: 90.0,
        estimatedRange: 1250.0,
        instantConsumption: 0.0,
        avgConsumption: 0.0,
        tripFuelConsumed: 0.0,
        totalFuelConsumed: 14200.0,
        fuelEconomy: 3.44,
        isLowFuel: false,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: 0.0,
        roll: 0.0,
        yaw: 0.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 105.0, temp: 22.0, status: 'NORMAL' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 105.0, temp: 22.0, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 105.0, temp: 22.0, status: 'NORMAL' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 105.0, temp: 22.0, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 105.0, temp: 22.0, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 105.0, temp: 22.0, status: 'NORMAL' }
        ],
        batteryVoltage: 28.2,
        batteryCurrent: 0.0,
        batterySoc: 100,
        batterySoh: 99,
        batteryTemp: 21.0,
        batteryStatus: 'CHARGED',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 100,
        components: {
          engine: { score: 100, risk: 'Low', status: 'Healthy', predictedMaint: '50,000 km' },
          battery: { score: 99, risk: 'Low', status: 'Healthy', predictedMaint: '45,000 km' },
          tyres: { score: 100, risk: 'Low', status: 'Healthy', predictedMaint: '40,000 km' },
          braking: { score: 100, risk: 'Low', status: 'Healthy', predictedMaint: '50,000 km' },
          fuelSystem: { score: 100, risk: 'Low', status: 'Healthy', predictedMaint: '60,000 km' },
          cooling: { score: 100, risk: 'Low', status: 'Healthy', predictedMaint: '55,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [0, 0, 0, 0, 0, 0, 0],
          acceleration: [0, 0, 0, 0, 0, 0, 0],
          rawFuel: [405, 405, 405, 405, 405, 405, 405],
          correctedFuel: [405, 405, 405, 405, 405, 405, 405],
          fuelConsumption: [0, 0, 0, 0, 0, 0, 0],
          tyrePressures: [
            [105, 105, 105, 105, 105, 105, 105],
            [105, 105, 105, 105, 105, 105, 105],
            [105, 105, 105, 105, 105, 105, 105],
            [105, 105, 105, 105, 105, 105, 105],
            [105, 105, 105, 105, 105, 105, 105],
            [105, 105, 105, 105, 105, 105, 105]
          ],
          tyreTemps: [
            [22, 22, 22, 22, 22, 22, 22],
            [22, 22, 22, 22, 22, 22, 22],
            [22, 22, 22, 22, 22, 22, 22],
            [22, 22, 22, 22, 22, 22, 22],
            [22, 22, 22, 22, 22, 22, 22],
            [22, 22, 22, 22, 22, 22, 22]
          ]
        }
      }
    };

    // Fleet Table Summary Overview
    this.updateFleetArray();

    // Start Simulation Telemetry Timer Loop (100Hz tick, UI update 1Hz)
    this.startSimulationLoop();
  }

  get telemetry() {
    return this.vehiclesData[this.activeVehicleId] || this.vehiclesData['VOLVO-FH-001'];
  }

  get plannedRoute() {
    return this.plannedRoutes[this.activeVehicleId] || this.plannedRoutes['VOLVO-FH-001'];
  }

  updateFleetArray() {
    this.fleet = Object.keys(this.vehiclesData).map(id => {
      const v = this.vehiclesData[id];
      const lowestTyre = v.tpms.reduce((min, t) => t.press < min ? t.press : min, 999);
      let tyreText = 'NORMAL (105 PSI)';
      if (lowestTyre < 95.0) tyreText = `CRITICAL (${lowestTyre.toFixed(1)} PSI)`;
      else if (lowestTyre < 100.0) tyreText = `WARNING (${lowestTyre.toFixed(1)} PSI)`;

      return {
        id: v.vehicleId,
        driver: v.driver,
        location: v.locationName,
        speed: `${v.speed.toFixed(1)} km/h`,
        fuel: `${v.fuelPercent.toFixed(1)}%`,
        tyre: tyreText,
        health: `${v.overallHealthScore}/100`,
        route: v.routeCompliance
      };
    });
  }

  selectVehicle(vehicleId) {
    if (this.vehiclesData[vehicleId]) {
      this.activeVehicleId = vehicleId;
      this.notify();
    }
  }

  addNewVehicle(vehData) {
    const id = vehData.vehicleId.toUpperCase();
    this.vehiclesData[id] = {
      vehicleId: id,
      model: vehData.model || 'Volvo FH 750 Diesel',
      driver: vehData.driver || 'New Driver',
      status: vehData.status || 'Running',
      engineStatus: 'ON',
      totalDistance: 50000.0,
      tripDistance: 120.0,
      locationName: vehData.location || 'Regional Depot Hub',
      startLocation: 'Regional Depot Hub',
      destination: 'Terminal Express',
      currentLat: 57.7000,
      currentLng: 11.9700,
      distanceRemaining: 250.0,
      eta: '2h 30m',
      routeCompliance: vehData.route || 'Compliant',
      geofenceStatus: 'Inside Zone',
      speed: parseFloat(vehData.speed) || 75.0,
      maxSpeed: 90.0,
      avgSpeed: 70.0,
      acceleration: 0.1,
      deceleration: 0.0,
      brakingIntensity: 0.05,
      harshAccelEvents: 0,
      harshBrakingEvents: 0,
      corneringEvents: 0,
      overspeedEvents: 0,
      drivingScore: 90,
      drivingStatus: 'Good',
      tankCapacity: 450.0,
      rawFuelHeight: 350.0,
      rawFuelVolume: 350.0,
      correctedFuelHeight: 350.0,
      correctedFuelVolume: 350.0,
      fuelPercent: parseFloat(vehData.fuel) || 80.0,
      estimatedRange: 1000.0,
      instantConsumption: 27.5,
      avgConsumption: 31.0,
      tripFuelConsumed: 40.0,
      totalFuelConsumed: 15000.0,
      fuelEconomy: 3.2,
      isLowFuel: false,
      isFuelTheftDetected: false,
      isFuelLeakDetected: false,
      pitch: 0.5,
      roll: 0.0,
      yaw: 5.0,
      tpms: [
        { id: 'TPMS-FL', pos: 'Front Left', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-FR', pos: 'Front Right', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 105.0, temp: 40.0, status: 'NORMAL' }
      ],
      batteryVoltage: 27.5,
      batteryCurrent: 12.0,
      batterySoc: 95,
      batterySoh: 95,
      batteryTemp: 25.0,
      batteryStatus: 'CHARGING',
      adasStatus: 'SAFE',
      driverDrowsiness: false,
      driverDistraction: false,
      overallHealthScore: parseInt(vehData.health) || 95,
      components: {
        engine: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '30,000 km' },
        battery: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '25,000 km' },
        tyres: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '20,000 km' },
        braking: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '30,000 km' },
        fuelSystem: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '40,000 km' },
        cooling: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '35,000 km' }
      },
      history: {
        timestamps: ['10:00', '10:05', '10:10'],
        speed: [70, 72, 75],
        acceleration: [0.1, 0.1, 0.1],
        rawFuel: [350, 350, 350],
        correctedFuel: [350, 350, 350],
        fuelConsumption: [27, 27, 27.5],
        tyrePressures: [[105, 105], [105, 105], [105, 105], [105, 105], [105, 105], [105, 105]],
        tyreTemps: [[40, 40], [40, 40], [40, 40], [40, 40], [40, 40], [40, 40]]
      }
    };

    this.plannedRoutes[id] = [
      [57.7000, 11.9700], [57.7100, 11.9800], [57.7200, 11.9900]
    ];

    this.updateFleetArray();
    this.selectVehicle(id);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.telemetry, this.fleet, this.generateAlerts());
  }

  notify() {
    this.updateFleetArray();
    const alerts = this.generateAlerts();
    this.listeners.forEach(cb => cb(this.telemetry, this.fleet, alerts));
  }

  toggleFuelTheft() {
    this.flags.fuelTheftActive = !this.flags.fuelTheftActive;
    const active = this.vehiclesData[this.activeVehicleId];
    if (active) {
      active.isFuelTheftDetected = this.flags.fuelTheftActive;
      if (this.flags.fuelTheftActive) {
        active.correctedFuelVolume -= 35.0;
        active.fuelPercent = (active.correctedFuelVolume / active.tankCapacity) * 100;
        active.engineStatus = 'OFF';
        active.status = 'Idle';
      }
    }
    this.notify();
  }

  toggleSteepIncline() {
    this.flags.steepInclineActive = !this.flags.steepInclineActive;
    const active = this.vehiclesData[this.activeVehicleId];
    if (active) {
      if (this.flags.steepInclineActive) {
        active.pitch = 6.8;
        active.roll = -3.2;
        active.rawFuelVolume -= 18.5;
      } else {
        active.pitch = 0.8;
        active.roll = -0.4;
        active.rawFuelVolume = active.correctedFuelVolume;
      }
    }
    this.notify();
  }

  toggleTyreLeak() {
    this.flags.tyreLeakActive = !this.flags.tyreLeakActive;
    const active = this.vehiclesData[this.activeVehicleId];
    if (active) {
      if (this.flags.tyreLeakActive) {
        active.tpms[2].press = 88.5; // Drops below 95.0 PSI threshold!
        active.tpms[2].temp = 74.2;
        active.tpms[2].status = 'CRITICAL';
      } else {
        active.tpms[2].press = 105.0;
        active.tpms[2].temp = 42.0;
        active.tpms[2].status = 'NORMAL';
      }
    }
    this.notify();
  }

  toggleFatigue() {
    this.flags.drowsinessActive = !this.flags.drowsinessActive;
    const active = this.vehiclesData[this.activeVehicleId];
    if (active) {
      active.driverDrowsiness = this.flags.drowsinessActive;
      active.driverDistraction = this.flags.drowsinessActive;
      active.adasStatus = this.flags.drowsinessActive ? 'CRITICAL DROWSINESS' : 'SAFE';
    }
    this.notify();
  }

  resetAllTriggers() {
    this.flags.fuelTheftActive = false;
    this.flags.steepInclineActive = false;
    this.flags.tyreLeakActive = false;
    this.flags.drowsinessActive = false;

    const active = this.vehiclesData[this.activeVehicleId];
    if (active) {
      active.isFuelTheftDetected = false;
      active.pitch = 0.8;
      active.roll = -0.4;
      active.tpms[2].press = 105.0;
      active.tpms[2].status = 'NORMAL';
      active.driverDrowsiness = false;
      active.adasStatus = 'SAFE';
      active.engineStatus = 'ON';
      active.status = 'Running';
    }
    this.notify();
  }

  generateAlerts() {
    const alerts = [];
    const now = new Date().toLocaleTimeString();

    Object.keys(this.vehiclesData).forEach(id => {
      const v = this.vehiclesData[id];
      if (v.isFuelTheftDetected) {
        alerts.push({
          id: `ALT-FT-${id}`,
          severity: 'Critical',
          time: now,
          vehicle: id,
          location: v.locationName,
          category: 'Fuel Security',
          desc: 'Stationary Fuel Theft (>30L drop with Engine OFF)',
          action: 'Dispatch Security & Immobilize Engine'
        });
      }
      if (v.driverDrowsiness) {
        alerts.push({
          id: `ALT-FAT-${id}`,
          severity: 'Critical',
          time: now,
          vehicle: id,
          location: v.locationName,
          category: 'ADAS Driver Safety',
          desc: 'Driver Eye Closure & Distraction (>3.0s)',
          action: 'Trigger Seat Vibration & Acoustic Alarm'
        });
      }
      const critTyre = v.tpms.find(t => t.press < 95.0);
      if (critTyre) {
        alerts.push({
          id: `ALT-TPMS-${id}`,
          severity: 'Warning',
          time: now,
          vehicle: id,
          location: v.locationName,
          category: 'Tyre Telematics',
          desc: `${critTyre.pos} Pressure below minimum threshold (${critTyre.press.toFixed(1)} PSI < 95 PSI)`,
          action: 'Inspect Tyre at Next Service Depot'
        });
      }
      if (v.routeCompliance === 'Deviated') {
        alerts.push({
          id: `ALT-DEV-${id}`,
          severity: 'Info',
          time: now,
          vehicle: id,
          location: v.locationName,
          category: 'Route Optimization',
          desc: 'Vehicle deviated from designated Geofence corridor',
          action: 'Recalculate GPS Route'
        });
      }
    });

    return alerts;
  }

  startSimulationLoop() {
    setInterval(() => {
      // Dynamic micro-updates across running vehicles
      Object.keys(this.vehiclesData).forEach(id => {
        const v = this.vehiclesData[id];
        if (v.status === 'Running' && v.engineStatus === 'ON') {
          // Dynamic GPS position progression along planned route
          const route = this.plannedRoutes[id];
          if (route && route.length > 1) {
            v.currentLat += (Math.random() - 0.5) * 0.0004;
            v.currentLng += (Math.random() - 0.5) * 0.0004;
          }

          // Micro speed variation
          v.speed = Math.max(40.0, Math.min(88.0, v.speed + (Math.random() - 0.5) * 1.5));
          v.instantConsumption = 25.0 + (v.speed / 80.0) * 8.0;

          // Micro IMU vibration noise
          v.pitch += (Math.random() - 0.5) * 0.1;
          v.roll += (Math.random() - 0.5) * 0.1;

          // Push to historical trend queues
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          if (v.history) {
            v.history.timestamps.push(nowStr);
            if (v.history.timestamps.length > 20) v.history.timestamps.shift();

            v.history.speed.push(v.speed);
            if (v.history.speed.length > 20) v.history.speed.shift();

            v.history.acceleration.push((Math.random() - 0.5) * 0.4);
            if (v.history.acceleration.length > 20) v.history.acceleration.shift();
          }
        }
      });

      this.notify();
    }, 2000);
  }
}

// Global Singleton Instance
window.telemetryEngine = new TelemetrySimulationEngine();
