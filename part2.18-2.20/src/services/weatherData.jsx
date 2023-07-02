import axios from "axios";

const WEATHER_BASE_URL =
  "https://api.openweathermap.org/data/2.5/";

export const getCurrentWeather = (capital) => {
  const request = axios.get(
    `${WEATHER_BASE_URL}/weather?q=${capital}&appid=${
      import.meta.env.VITE_API_KEY
    }`
  );
  return request.then((res) => res.data);
};

export default {
  getCurrentWeather: getCurrentWeather,
};
