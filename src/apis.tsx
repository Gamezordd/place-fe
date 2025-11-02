const getBaseUrl = () => {
   return import.meta.env.VITE_API_URL;
}

export default {
  checkHealth: async () => {
    const response = await fetch(`${getBaseUrl()}/health`);
    return response.ok;
  },
};