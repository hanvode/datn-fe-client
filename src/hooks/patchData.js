import axios from "axios";

const patchData = async (url, data) => {
  const res = await axios.patch(url, data);
  return res;
};

export default patchData;
