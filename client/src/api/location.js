import axios from "axios";

const API_URL = "http://localhost:5000/api/locations";

// Get all locations
const getLocations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new location
const createLocation = async (locationData) => {
  const response = await axios.post(API_URL, locationData);
  return response.data;
};

// Delete location
const deleteLocation = async (locationId) => {
  const response = await axios.delete(`${API_URL}/${locationId}`);
  return response.data;
};

const locationService = {
  getLocations,
  createLocation,
  deleteLocation,
};

export default locationService;
