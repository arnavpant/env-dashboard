import axios from 'axios';

export const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`
  );
  return response.data.current;
};
