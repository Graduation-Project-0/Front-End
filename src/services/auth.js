import api from "../api/axios";
import { ENDPOINTS } from "../config/endpoints";

export const logout = async () => {
  return api.post(ENDPOINTS.LOGOUT);
};
