import axios from 'axios';
import { Device, Agent, Session, Incident, ConsolidatedLog, PaginatedResponse, FilterParams } from '../types';

const API_BASE_URL = 'https://kiosk-anvex-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Devices
export const getDevices = async (params: FilterParams): Promise<PaginatedResponse<Device>> => {
  const response = await api.get('/devices', { params });
  return response.data;
};

export const getDevice = async (id: string): Promise<Device> => {
  const response = await api.get(`/devices/${id}`);
  return response.data.data;
};

export const createDevice = async (device: Partial<Device>): Promise<Device> => {
  const response = await api.post('/devices', device);
  return response.data.data;
};

export const updateDevice = async (id: string, device: Partial<Device>): Promise<Device> => {
  const response = await api.put(`/devices/${id}`, device);
  return response.data.data;
};

export const deleteDevice = async (id: string): Promise<void> => {
  await api.delete(`/devices/${id}`);
};

// Agents
export const getAgents = async (params: FilterParams): Promise<PaginatedResponse<Agent>> => {
  const response = await api.get('/agents', { params });
  return response.data;
};

export const getAgent = async (id: string): Promise<Agent> => {
  const response = await api.get(`/agents/${id}`);
  return response.data.data;
};

export const createAgent = async (agent: Partial<Agent>): Promise<Agent> => {
  const response = await api.post('/agents', agent);
  return response.data.data;
};

export const updateAgent = async (id: string, agent: Partial<Agent>): Promise<Agent> => {
  const response = await api.put(`/agents/${id}`, agent);
  return response.data.data;
};

export const deleteAgent = async (id: string): Promise<void> => {
  await api.delete(`/agents/${id}`);
};

// Sessions
export const getSessions = async (params: FilterParams): Promise<PaginatedResponse<Session>> => {
  const response = await api.get('/sessions', { params });
  return response.data;
};

export const getSession = async (id: string): Promise<Session> => {
  const response = await api.get(`/sessions/${id}`);
  return response.data.data;
};

export const getDeviceSessions = async (deviceId: string, params: FilterParams): Promise<PaginatedResponse<Session>> => {
  const response = await api.get(`/sessions/device/${deviceId}`, { params });
  return response.data;
};

export const createSession = async (session: Partial<Session>): Promise<Session> => {
  const response = await api.post('/sessions', session);
  return response.data.data;
};

export const addMessageToSession = async (sessionId: string, message: { sender: string; message: string }): Promise<Session> => {
  const response = await api.post(`/sessions/${sessionId}/messages`, message);
  return response.data.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/sessions/${id}`);
};

// Incidents
export const getIncidents = async (params: FilterParams): Promise<PaginatedResponse<Incident>> => {
  const response = await api.get('/incidents', { params });
  return response.data;
};

export const getIncident = async (id: string): Promise<Incident> => {
  const response = await api.get(`/incidents/${id}`);
  return response.data.data;
};

export const getDeviceIncidents = async (deviceId: string, params: FilterParams): Promise<PaginatedResponse<Incident>> => {
  const response = await api.get(`/incidents/device/${deviceId}`, { params });
  return response.data;
};

export const createIncident = async (incident: Partial<Incident>): Promise<Incident> => {
  const response = await api.post('/incidents', incident);
  return response.data.data;
};

export const deleteIncident = async (id: string): Promise<void> => {
  await api.delete(`/incidents/${id}`);
};

// Consolidated Logs
export const getConsolidatedLogs = async (params: FilterParams): Promise<PaginatedResponse<ConsolidatedLog>> => {
  const response = await api.get('/consolidated-logs', { params });
  return response.data;
};

export const getConsolidatedLog = async (id: string): Promise<ConsolidatedLog> => {
  const response = await api.get(`/consolidated-logs/${id}`);
  return response.data.data;
};

export const generateConsolidatedLog = async (params: { from_timestamp: string; to_timestamp: string }): Promise<ConsolidatedLog> => {
  const response = await api.post('/consolidated-logs', params);
  return response.data.data;
};

export const deleteConsolidatedLog = async (id: string): Promise<void> => {
  await api.delete(`/consolidated-logs/${id}`);
};

export default api; 