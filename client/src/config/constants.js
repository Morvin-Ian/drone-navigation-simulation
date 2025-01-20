export const API_ENDPOINTS = {
    FACILITIES: '/api/facilities/',
    DRONES: '/api/drones/',
    ROUTES: '/api/routes/',
  };

  export const WS_CONFIG = {
    BASE_URL: 'ws://localhost:8000',  // or your actual WebSocket server port
    RECONNECT_INTERVAL: 3000,
    MAX_RETRIES: 5
  };
  
  export const MAP_CONFIG = {
    center: [0.3556, 37.5833],
    zoom: 7,
    maxZoom: 18,
    minZoom: 3,
    tileLayer: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    },
  };
  
  export const DRONE_SETTINGS = {
    updateInterval: 1000, // milliseconds
    pathColor: '#3B82F6',
    pathWeight: 3,
    pathOpacity: 0.7,
  };
  
  export const ERROR_MESSAGES = {
    LOCATION_NOT_FOUND: 'Could not find one or both locations',
    SAME_LOCATION: 'Departure and Destination locations cannot be the same',
    DRONE_NOT_FOUND: 'Selected drone not found',
    ROUTE_CREATION_FAILED: 'Failed to create route',
    DATA_FETCH_ERROR: 'Error loading map data',
  };
  
  export const FACILITY_TYPES = {
    HOSPITAL: 'hospital',
    CLINIC: 'clinic',
    PHARMACY: 'pharmacy',
    LABORATORY: 'laboratory',
  };