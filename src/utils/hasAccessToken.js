import axios from 'axios';

const hasAccessToken = async () => {
  try {
    const res = await axios.get('/api/auth/check', { withCredentials: true });
    return res.data.valid;
  } catch {
    return false;
  }
};

export default hasAccessToken;