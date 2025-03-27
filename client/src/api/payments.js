import axios from "axios";

const API_URL = "http://localhost:5000/api/schedules";

const getPaymentSchedules = async (month, year) => {
  const response = await axios.get(`${API_URL}?month=${month}&year=${year}`);
  return response.data;
};

const carryForwardSchedules = async (month, year) => {
  const response = await axios.post(`${API_URL}/carry`, { month, year });
  return response.data;
};

const markScheduleAsPaid = async (scheduleId, paidAmount) => {
  const response = await axios.put(`${API_URL}/${scheduleId}/pay`, {
    paidAmount,
  });
  return response.data;
};

const createPaymentSchedule = async (scheduleData) => {
  const response = await axios.post(API_URL, scheduleData);
  return response.data;
};

export default {
  getPaymentSchedules,
  carryForwardSchedules,
  markScheduleAsPaid,
  createPaymentSchedule,
};
