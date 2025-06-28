import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

let cache: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 600000; // 10 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const lat = req.query.lat || '40.7128';
  const lon = req.query.lon || '-74.0060';

  // Serve from cache if fresh
  if (cache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return res.status(200).json(cache);
  }

  // Fetch weather
  const weatherRes = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m`
  );
  const current = weatherRes.data.current;
  const hourly = weatherRes.data.hourly.temperature_2m;

  // Trend analysis: simple 7-hour moving average
  const avg = hourly.slice(-7).reduce((a: number, b: number) => a + b, 0) / 7;
  const anomaly = Math.abs(current.temperature_2m - avg) > 5; // 5°C deviation

  // Fetch air quality (OpenAQ, fallback if no data)
  let aqi = null;
  try {
    const aqRes = await axios.get(
      `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&parameter=pm25`
    );
    aqi = aqRes.data.results[0]?.measurements[0]?.value ?? null;
  } catch {
    aqi = null;
  }

  const result = {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    hourly,
    aqi,
    anomaly,
    trend: avg,
    lat,
    lon,
  };

  cache = result;
  cacheTimestamp = Date.now();

  res.status(200).json(result);
}
