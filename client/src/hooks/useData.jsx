import useSWR from 'swr';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/constants';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const useFacilities = () => {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.FACILITIES, fetcher);

  return {
    facilities: data,
    isLoading,
    error,
  };
};

export const useDrones = () => {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.DRONES, fetcher);

  return {
    drones: data,
    isLoading,
    error,
  };
};

export const useUpdateDroneRoute = () => {
  const updateRoute = async (droneId, routeData) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.DRONES}/${droneId}/set_route/`,
        routeData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update route');
    }
  };

  return { updateRoute };
};