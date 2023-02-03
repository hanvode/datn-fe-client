import axios from "axios";
import { API_URL } from "./config";
axios.defaults.withCredentials = true;


const patchData = async (url, data) => {
  const res = await axios.patch(`${API_URL}/${url}`, data);
  return res;
};

export default patchData;
