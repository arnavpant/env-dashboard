import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define interfaces for type safety
interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
  };
  hourly: {
    temperature_2m: number[];
  };
}

interface AirQualityData {
  results: Array<{
    measurements: Array<{
      value: number;
    }>;
  }>;
}

let cache: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 600000; // 10 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const lat = req.query.lat || '40.7128';
    const lon = req.query.lon || '-74.0060';

    console.log(`Fetching data for lat: ${lat}, lon: ${lon}`);

    // Serve from cache if fresh
    if (cache && Date.now() - cacheTimestamp < CACHE_TTL) {
      console.log('Serving from cache');
      return res.status(200).json(cache);
    }

    // Fetch weather data
    console.log('Fetching weather data...');
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}`);
    }

    const weatherData: WeatherData = await weatherResponse.json();
    const current = weatherData.current;
    const hourly = weatherData.hourly.temperature_2m;

    // Trend analysis: simple 7-hour moving average
    const recentTemps = hourly.slice(-7);
    const avg = recentTemps.reduce((a: number, b: number) => a + b, 0) / recentTemps.length;
    const anomaly = Math.abs(current.temperature_2m - avg) > 5; // 5°C deviation

    // Fetch air quality (OpenAQ, with fallback)
    let aqi = null;
    try {
      console.log('Fetching air quality data...');
      const aqResponse = await fetch(
        `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&parameter=pm25&limit=1`
      );
      
      if (aqResponse.ok) {
        const aqData: AirQualityData = await aqResponse.json();
        aqi = aqData.results[0]?.measurements[0]?.value ?? null;
      }
    } catch (aqError) {
      console.log('Air quality data unavailable:', aqError);
      aqi = null;
    }

    const result = {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      hourly,
      aqi,
      anomaly,
      trend: avg,
      lat: parseFloat(lat as string),
      lon: parseFloat(lon as string),
      timestamp: new Date().toISOString()
    };

    // Cache the result
    cache = result;
    cacheTimestamp = Date.now();

    console.log('Data fetched successfully');
    res.status(200).json(result);

  } catch (error: any) {
    console.error('API Function Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
}
