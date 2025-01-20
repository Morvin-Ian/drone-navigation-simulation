import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';

export const searchLocation = async (query) => {
  const provider = new OpenStreetMapProvider();
  const results = await provider.search({ query });

  if (!results.length) {
    throw new Error(`Location not found: ${query}`);
  }

  return results;
};

export const createBounds = (...coordinates) => {
  return L.latLngBounds(coordinates);
};

export const calculateDistance = (coord1, coord2) => {
  const lat1 = coord1[0];
  const lon1 = coord1[1];
  const lat2 = coord2[0];
  const lon2 = coord2[1];

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatCoordinates = (coords) => {
  if (!Array.isArray(coords)) return null;
  return [coords[1], coords[0]]; // Convert [lng, lat] to [lat, lng]
};

const toRad = (value) => (value * Math.PI) / 180;