const getApiUrl = () => {
  // EXTREME OVERRIDE: Force all production environments to use the Railway backend
  return 'https://empirelaunchai-backend-production.up.railway.app';
};

export const API_URL = getApiUrl();
