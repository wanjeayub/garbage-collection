import axios from "axios";

const API_URL = "http://localhost:5000/api/plots";

// Get all plots
const getPlots = async (locationId) => {
  const params = locationId ? { location: locationId } : {};
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Create new plot
const createPlot = async (plotData) => {
  const response = await axios.post(API_URL, plotData);
  return response.data;
};

// Update plot
const updatePlot = async (plotId, plotData) => {
  const response = await axios.put(`${API_URL}/${plotId}`, plotData);
  return response.data;
};

// Delete plot
const deletePlot = async (plotId) => {
  const response = await axios.delete(`${API_URL}/${plotId}`);
  return response.data;
};

export default {
  getPlots,
  createPlot,
  updatePlot, // Make sure this is exported
  deletePlot,
};
