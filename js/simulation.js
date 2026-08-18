/**
 * AI-Powered Truck Fleet Telematics Simulation Engine
 * Supports Multi-Vehicle Telemetry States (VOLVO-FH-001, 002, 003, 004 & custom added vehicles)
 * Version 2: Added Trip Details & Dynamic Preset Location / Driver Selector Arrays
 */

class TelemetrySimulationEngine {
  constructor() {
    this.listeners = [];
    this.activeVehicleId = 'VOLVO-FH-001';

    // Default preset location options
    this.defaultLocations = [
      'Gothenburg Logistics Hub',
      'Stockholm Freight Terminal',
      'Malmö Transport Depot',
      'Jönköping Cargo Hub',
      'Helsingborg Port Logistics',
      'Oslo Central Freight Center',
      'Copenhagen Distribution Park',
      'Hamburg Port Cargo Terminal'
    ];

    // Default preset driver options
    this.defaultDrivers = [
      'Erik Lindqvist',
      'Lars Svensson',
      'Astrid Nilsson',
      'Johan Berg',
      'Karin Olsson',
      'Magnus Wallin'
    ];

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
        tripNo: '#TRIP-026',
        tripDate: '2026-08-18',
        startTime: '08:30 AM',
        endTime: '04:45 PM',
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
        tripNo: '#TRIP-019',
        tripDate: '2026-08-18',
        startTime: '07:15 AM',
        endTime: '02:30 PM',
        status: 'Running',
        engineStatus: 'ON',
        totalDistance: 92410.0,
        tripDistance: 145.2,
        locationName: 'Malmö E22 Logistics Ring',
        startLocation: 'Malmö Transport Depot',
        destination: 'Jönköping Cargo Hub',
        currentLat: 55.61200,
        currentLng: 13.01500,
        distanceRemaining: 210.0,
        eta: '2h 15m',
        routeCompliance: 'Compliant',
        geofenceStatus: 'Inside Zone (MALM-DEP-02)',
        speed: 82.0,
        maxSpeed: 90.0,
        avgSpeed: 78.0,
        acceleration: 0.0,
        deceleration: 0.0,
        brakingIntensity: 0.0,
        harshAccelEvents: 0,
        harshBrakingEvents: 0,
        corneringEvents: 1,
        overspeedEvents: 0,
        drivingScore: 94,
        drivingStatus: 'Excellent',
        tankCapacity: 400.0,
        rawFuelHeight: 280.0,
        rawFuelVolume: 280.0,
        correctedFuelHeight: 280.0,
        correctedFuelVolume: 280.0,
        fuelPercent: 70.0,
        estimatedRange: 820.0,
        instantConsumption: 26.5,
        avgConsumption: 30.2,
        tripFuelConsumed: 44.0,
        totalFuelConsumed: 28000.0,
        fuelEconomy: 3.31,
        isLowFuel: false,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: 0.0,
        roll: 0.0,
        yaw: 45.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 104.5, temp: 40.0, status: 'NORMAL' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 104.2, temp: 40.1, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 105.0, temp: 42.0, status: 'NORMAL' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 105.1, temp: 42.2, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 104.9, temp: 42.1, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 105.0, temp: 42.0, status: 'NORMAL' }
        ],
        batteryVoltage: 27.8,
        batteryCurrent: 12.0,
        batterySoc: 98,
        batterySoh: 95,
        batteryTemp: 26.0,
        batteryStatus: 'CHARGING',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 97,
        components: {
          engine: { score: 98, risk: 'Low', status: 'Healthy', predictedMaint: '35,000 km' },
          battery: { score: 96, risk: 'Low', status: 'Healthy', predictedMaint: '28,000 km' },
          tyres: { score: 94, risk: 'Low', status: 'Nominal', predictedMaint: '20,000 km' },
          braking: { score: 97, risk: 'Low', status: 'Healthy', predictedMaint: '40,000 km' },
          fuelSystem: { score: 99, risk: 'Low', status: 'Healthy', predictedMaint: '45,000 km' },
          cooling: { score: 98, risk: 'Low', status: 'Healthy', predictedMaint: '42,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [80, 81, 82, 82, 81, 82, 82],
          acceleration: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          rawFuel: [285, 284, 283, 282, 281, 280.5, 280],
          correctedFuel: [285, 284, 283, 282, 281, 280.5, 280],
          fuelConsumption: [26, 26.2, 26.5, 26.5, 26.4, 26.5, 26.5],
          tyrePressures: [
            [104.5, 104.5, 104.5, 104.5, 104.5, 104.5, 104.5],
            [104.2, 104.2, 104.2, 104.2, 104.2, 104.2, 104.2],
            [105.0, 105.0, 105.0, 105.0, 105.0, 105.0, 105.0],
            [105.1, 105.1, 105.1, 105.1, 105.1, 105.1, 105.1],
            [104.9, 104.9, 104.9, 104.9, 104.9, 104.9, 104.9],
            [105.0, 105.0, 105.0, 105.0, 105.0, 105.0, 105.0]
          ],
          tyreTemps: [
            [40, 40, 40, 40, 40, 40, 40],
            [40.1, 40.1, 40.1, 40.1, 40.1, 40.1, 40.1],
            [42, 42, 42, 42, 42, 42, 42],
            [42.2, 42.2, 42.2, 42.2, 42.2, 42.2, 42.2],
            [42.1, 42.1, 42.1, 42.1, 42.1, 42.1, 42.1],
            [42, 42, 42, 42, 42, 42, 42]
          ]
        }
      },

      'VOLVO-FH-003': {
        vehicleId: 'VOLVO-FH-003',
        model: 'Volvo FH 460 6x4 Rigid Heavy',
        driver: 'Astrid Nilsson',
        tripNo: '#TRIP-042',
        tripDate: '2026-08-18',
        startTime: '09:00 AM',
        endTime: '06:15 PM',
        status: 'Idle',
        engineStatus: 'OFF',
        totalDistance: 215800.0,
        tripDistance: 0.0,
        locationName: 'Jönköping Cargo Yard',
        startLocation: 'Jönköping Cargo Hub',
        destination: 'Oslo Central Freight Center',
        currentLat: 57.78140,
        currentLng: 14.16100,
        distanceRemaining: 340.0,
        eta: '5h 00m',
        routeCompliance: 'Compliant',
        geofenceStatus: 'Inside Zone (JONK-HUB-03)',
        speed: 0.0,
        maxSpeed: 90.0,
        avgSpeed: 68.0,
        acceleration: 0.0,
        deceleration: 0.0,
        brakingIntensity: 0.0,
        harshAccelEvents: 0,
        harshBrakingEvents: 0,
        corneringEvents: 0,
        overspeedEvents: 0,
        drivingScore: 91,
        drivingStatus: 'Excellent',
        tankCapacity: 500.0,
        rawFuelHeight: 410.0,
        rawFuelVolume: 410.0,
        correctedFuelHeight: 410.0,
        correctedFuelVolume: 410.0,
        fuelPercent: 82.0,
        estimatedRange: 1150.0,
        instantConsumption: 0.0,
        avgConsumption: 33.0,
        tripFuelConsumed: 0.0,
        totalFuelConsumed: 71200.0,
        fuelEconomy: 3.03,
        isLowFuel: false,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: 0.0,
        roll: 0.0,
        yaw: 180.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 105.0, temp: 35.0, status: 'NORMAL' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 105.0, temp: 35.0, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 105.0, temp: 35.0, status: 'NORMAL' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 105.0, temp: 35.0, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 105.0, temp: 35.0, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 105.0, temp: 35.0, status: 'NORMAL' }
        ],
        batteryVoltage: 25.1,
        batteryCurrent: -1.5,
        batterySoc: 88,
        batterySoh: 90,
        batteryTemp: 22.0,
        batteryStatus: 'DISCHARGING',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 94,
        components: {
          engine: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '20,000 km' },
          battery: { score: 88, risk: 'Low', status: 'Healthy', predictedMaint: '15,000 km' },
          tyres: { score: 92, risk: 'Low', status: 'Nominal', predictedMaint: '18,000 km' },
          braking: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '25,000 km' },
          fuelSystem: { score: 96, risk: 'Low', status: 'Healthy', predictedMaint: '30,000 km' },
          cooling: { score: 94, risk: 'Low', status: 'Healthy', predictedMaint: '22,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [0, 0, 0, 0, 0, 0, 0],
          acceleration: [0, 0, 0, 0, 0, 0, 0],
          rawFuel: [410, 410, 410, 410, 410, 410, 410],
          correctedFuel: [410, 410, 410, 410, 410, 410, 410],
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
            [35, 35, 35, 35, 35, 35, 35],
            [35, 35, 35, 35, 35, 35, 35],
            [35, 35, 35, 35, 35, 35, 35],
            [35, 35, 35, 35, 35, 35, 35],
            [35, 35, 35, 35, 35, 35, 35],
            [35, 35, 35, 35, 35, 35, 35]
          ]
        }
      },

      'VOLVO-FH-004': {
        vehicleId: 'VOLVO-FH-004',
        model: 'Volvo FH16 750 Heavy Transporter',
        driver: 'Johan Berg',
        tripNo: '#TRIP-088',
        tripDate: '2026-08-18',
        startTime: '10:00 AM',
        endTime: '08:30 PM',
        status: 'Offline',
        engineStatus: 'OFF',
        totalDistance: 341000.0,
        tripDistance: 0.0,
        locationName: 'Norrköping Service Depot',
        startLocation: 'Helsingborg Port Logistics',
        destination: 'Copenhagen Distribution Park',
        currentLat: 58.58770,
        currentLng: 16.18240,
        distanceRemaining: 0.0,
        eta: '0h 00m',
        routeCompliance: 'Deviated',
        geofenceStatus: 'Outside Geofence',
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
        drivingScore: 74,
        drivingStatus: 'Needs Review',
        tankCapacity: 450.0,
        rawFuelHeight: 110.0,
        rawFuelVolume: 110.0,
        correctedFuelHeight: 110.0,
        correctedFuelVolume: 110.0,
        fuelPercent: 24.4,
        estimatedRange: 320.0,
        instantConsumption: 0.0,
        avgConsumption: 35.0,
        tripFuelConsumed: 0.0,
        totalFuelConsumed: 119300.0,
        fuelEconomy: 2.85,
        isLowFuel: true,
        isFuelTheftDetected: false,
        isFuelLeakDetected: false,
        pitch: 0.0,
        roll: 0.0,
        yaw: 0.0,
        tpms: [
          { id: 'TPMS-FL', pos: 'Front Left', press: 94.0, temp: 30.0, status: 'WARNING' },
          { id: 'TPMS-FR', pos: 'Front Right', press: 104.0, temp: 30.0, status: 'NORMAL' },
          { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 104.0, temp: 30.0, status: 'NORMAL' },
          { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 104.0, temp: 30.0, status: 'NORMAL' },
          { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 104.0, temp: 30.0, status: 'NORMAL' },
          { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 104.0, temp: 30.0, status: 'NORMAL' }
        ],
        batteryVoltage: 24.2,
        batteryCurrent: 0.0,
        batterySoc: 65,
        batterySoh: 82,
        batteryTemp: 20.0,
        batteryStatus: 'STANDBY',
        adasStatus: 'SAFE',
        driverDrowsiness: false,
        driverDistraction: false,
        overallHealthScore: 78,
        components: {
          engine: { score: 85, risk: 'Low', status: 'Healthy', predictedMaint: '10,000 km' },
          battery: { score: 72, risk: 'Medium', status: 'Low Voltage', predictedMaint: '2,000 km' },
          tyres: { score: 68, risk: 'Medium', status: 'Low Pressure FL', predictedMaint: '1,000 km' },
          braking: { score: 88, risk: 'Low', status: 'Healthy', predictedMaint: '12,000 km' },
          fuelSystem: { score: 80, risk: 'Low', status: 'Low Fuel Reserve', predictedMaint: '5,000 km' },
          cooling: { score: 86, risk: 'Low', status: 'Healthy', predictedMaint: '14,000 km' }
        },
        history: {
          timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
          speed: [0, 0, 0, 0, 0, 0, 0],
          acceleration: [0, 0, 0, 0, 0, 0, 0],
          rawFuel: [110, 110, 110, 110, 110, 110, 110],
          correctedFuel: [110, 110, 110, 110, 110, 110, 110],
          fuelConsumption: [0, 0, 0, 0, 0, 0, 0],
          tyrePressures: [
            [94, 94, 94, 94, 94, 94, 94],
            [104, 104, 104, 104, 104, 104, 104],
            [104, 104, 104, 104, 104, 104, 104],
            [104, 104, 104, 104, 104, 104, 104],
            [104, 104, 104, 104, 104, 104, 104],
            [104, 104, 104, 104, 104, 104, 104]
          ],
          tyreTemps: [
            [30, 30, 30, 30, 30, 30, 30],
            [30, 30, 30, 30, 30, 30, 30],
            [30, 30, 30, 30, 30, 30, 30],
            [30, 30, 30, 30, 30, 30, 30],
            [30, 30, 30, 30, 30, 30, 30],
            [30, 30, 30, 30, 30, 30, 30]
          ]
        }
      }
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    const data = this.getActiveVehicleData();
    this.listeners.forEach(fn => fn(data, this.getFleetList()));
  }

  selectVehicle(vehicleId) {
    if (this.vehiclesData[vehicleId]) {
      this.activeVehicleId = vehicleId;
      this.notify();
    }
  }

  getActiveVehicleData() {
    const v = this.vehiclesData[this.activeVehicleId] || this.vehiclesData['VOLVO-FH-001'];
    v.flags = this.flags;
    return v;
  }

  getFleetList() {
    return Object.keys(this.vehiclesData).map(key => {
      const v = this.vehiclesData[key];
      return {
        id: v.vehicleId,
        driver: v.driver,
        model: v.model,
        location: v.locationName,
        speed: `${v.speed.toFixed(1)} km/h`,
        fuel: `${v.fuelPercent.toFixed(1)}%`,
        tyre: v.tpms.some(t => t.press < 95) ? 'CRITICAL (<95 PSI)' : (v.tpms.some(t => t.press < 100) ? 'WARNING' : 'NORMAL'),
        health: `${v.overallHealthScore}%`,
        route: v.routeCompliance
      };
    });
  }

  addNewVehicle(vehData) {
    const newId = vehData.vehicleId || `VOLVO-FH-00${Object.keys(this.vehiclesData).length + 1}`;
    
    // Add driver and start location to default dropdown lists if not present
    if (vehData.driver && !this.defaultDrivers.includes(vehData.driver)) {
      this.defaultDrivers.push(vehData.driver);
    }
    if (vehData.location && !this.defaultLocations.includes(vehData.location)) {
      this.defaultLocations.push(vehData.location);
    }

    this.vehiclesData[newId] = {
      vehicleId: newId,
      model: vehData.model || 'Volvo FH 750 Diesel',
      driver: vehData.driver || 'New Driver',
      tripNo: `#TRIP-0${Math.floor(10 + Math.random() * 89)}`,
      tripDate: '2026-08-18',
      startTime: '08:00 AM',
      endTime: '05:00 PM',
      status: 'Running',
      engineStatus: 'ON',
      totalDistance: 12000.0,
      tripDistance: 45.0,
      locationName: vehData.location || 'Gothenburg Logistics Terminal',
      startLocation: vehData.location || 'Gothenburg Logistics Hub',
      destination: 'Stockholm Freight Terminal',
      currentLat: 57.70887 + (Math.random() * 0.05),
      currentLng: 11.97456 + (Math.random() * 0.05),
      distanceRemaining: 380.0,
      eta: '4h 30m',
      routeCompliance: 'Compliant',
      geofenceStatus: 'Inside Zone',
      speed: parseFloat(vehData.speed) || 76.0,
      maxSpeed: 90.0,
      avgSpeed: 72.0,
      acceleration: 0.1,
      deceleration: 0.0,
      brakingIntensity: 0.0,
      harshAccelEvents: 0,
      harshBrakingEvents: 0,
      corneringEvents: 0,
      overspeedEvents: 0,
      drivingScore: 92,
      drivingStatus: 'Good',
      tankCapacity: 450.0,
      rawFuelHeight: 380.0,
      rawFuelVolume: 380.0,
      correctedFuelHeight: 380.0,
      correctedFuelVolume: 380.0,
      fuelPercent: parseFloat(vehData.fuel) || 85.0,
      estimatedRange: 980.0,
      instantConsumption: 27.5,
      avgConsumption: 31.0,
      tripFuelConsumed: 12.0,
      totalFuelConsumed: 3800.0,
      fuelEconomy: 3.22,
      isLowFuel: false,
      isFuelTheftDetected: false,
      isFuelLeakDetected: false,
      pitch: 0.0,
      roll: 0.0,
      yaw: 10.0,
      tpms: [
        { id: 'TPMS-FL', pos: 'Front Left', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-FR', pos: 'Front Right', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RL1', pos: 'Rear Left (Inner)', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RL2', pos: 'Rear Left (Outer)', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RR1', pos: 'Rear Right (Inner)', press: 105.0, temp: 40.0, status: 'NORMAL' },
        { id: 'TPMS-RR2', pos: 'Rear Right (Outer)', press: 105.0, temp: 40.0, status: 'NORMAL' }
      ],
      batteryVoltage: 27.2,
      batteryCurrent: 10.0,
      batterySoc: 92,
      batterySoh: 94,
      batteryTemp: 25.0,
      batteryStatus: 'CHARGING',
      adasStatus: 'SAFE',
      driverDrowsiness: false,
      driverDistraction: false,
      overallHealthScore: vehData.health || 96,
      components: {
        engine: { score: 96, risk: 'Low', status: 'Healthy', predictedMaint: '30,000 km' },
        battery: { score: 92, risk: 'Low', status: 'Healthy', predictedMaint: '25,000 km' },
        tyres: { score: 95, risk: 'Low', status: 'Nominal', predictedMaint: '20,000 km' },
        braking: { score: 96, risk: 'Low', status: 'Healthy', predictedMaint: '35,000 km' },
        fuelSystem: { score: 98, risk: 'Low', status: 'Healthy', predictedMaint: '40,000 km' },
        cooling: { score: 95, risk: 'Low', status: 'Healthy', predictedMaint: '35,000 km' }
      },
      history: {
        timestamps: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
        speed: [70, 72, 74, 75, 76, 76, 76],
        acceleration: [0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0],
        rawFuel: [385, 384, 383, 382, 381, 380, 380],
        correctedFuel: [385, 384, 383, 382, 381, 380, 380],
        fuelConsumption: [27, 27.2, 27.4, 27.5, 27.5, 27.5, 27.5],
        tyrePressures: [
          [105, 105, 105, 105, 105, 105, 105],
          [105, 105, 105, 105, 105, 105, 105],
          [105, 105, 105, 105, 105, 105, 105],
          [105, 105, 105, 105, 105, 105, 105],
          [105, 105, 105, 105, 105, 105, 105],
          [105, 105, 105, 105, 105, 105, 105]
        ],
        tyreTemps: [
          [40, 40, 40, 40, 40, 40, 40],
          [40, 40, 40, 40, 40, 40, 40],
          [40, 40, 40, 40, 40, 40, 40],
          [40, 40, 40, 40, 40, 40, 40],
          [40, 40, 40, 40, 40, 40, 40],
          [40, 40, 40, 40, 40, 40, 40]
        ]
      }
    };

    this.activeVehicleId = newId;
    this.notify();
  }

  addCustomLocation(locName) {
    if (locName && !this.defaultLocations.includes(locName)) {
      this.defaultLocations.push(locName);
    }
  }

  addCustomDriver(driverName) {
    if (driverName && !this.defaultDrivers.includes(driverName)) {
      this.defaultDrivers.push(driverName);
    }
  }

  toggleFuelTheft() {
    this.flags.fuelTheftActive = !this.flags.fuelTheftActive;
    const v = this.getActiveVehicleData();
    v.isFuelTheftDetected = this.flags.fuelTheftActive;
    if (this.flags.fuelTheftActive) {
      v.rawFuelVolume -= 35.0;
      v.correctedFuelVolume -= 35.0;
      v.fuelPercent = (v.correctedFuelVolume / v.tankCapacity) * 100;
    }
    this.notify();
  }

  toggleSteepIncline() {
    this.flags.steepInclineActive = !this.flags.steepInclineActive;
    const v = this.getActiveVehicleData();
    v.pitch = this.flags.steepInclineActive ? 6.8 : 2.4;
    v.roll = this.flags.steepInclineActive ? -3.2 : -1.2;
    v.rawFuelHeight = this.flags.steepInclineActive ? 285.0 : 318.0;
    v.rawFuelVolume = v.rawFuelHeight;
    v.correctedFuelHeight = 325.0;
    v.correctedFuelVolume = 325.0;
    this.notify();
  }

  toggleTyreLeak() {
    this.flags.tyreLeakActive = !this.flags.tyreLeakActive;
    const v = this.getActiveVehicleData();
    if (this.flags.tyreLeakActive) {
      v.tpms[2].press = 88.5; // Breaches 95 PSI minimum safety threshold
      v.tpms[2].status = 'CRITICAL';
      v.tpms[2].temp = 74.0;
    } else {
      v.tpms[2].press = 96.4;
      v.tpms[2].status = 'WARNING';
      v.tpms[2].temp = 68.2;
    }
    this.notify();
  }

  toggleFatigue() {
    this.flags.drowsinessActive = !this.flags.drowsinessActive;
    const v = this.getActiveVehicleData();
    v.driverDrowsiness = this.flags.drowsinessActive;
    this.notify();
  }

  resetAllTriggers() {
    this.flags.fuelTheftActive = false;
    this.flags.steepInclineActive = false;
    this.flags.tyreLeakActive = false;
    this.flags.drowsinessActive = false;
    const v = this.getActiveVehicleData();
    v.isFuelTheftDetected = false;
    v.pitch = 2.4;
    v.roll = -1.2;
    v.driverDrowsiness = false;
    v.tpms[2].press = 96.4;
    v.tpms[2].status = 'WARNING';
    this.notify();
  }

  updateFleetArray() {
    // Sync array if modified
    this.notify();
  }
}

window.TelemetrySimulationEngine = TelemetrySimulationEngine;
window.telemetryEngine = new TelemetrySimulationEngine();
