import React, { useState, useEffect } from 'react';
import WeatherCards from './components/WeatherCards';
import ProgressTracker from './components/ProgressTrackers';
import MapVisualization from './components/MapVisualization';
import WeatherCarousel from './components/WeatherCarousel';

const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.0060;

const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`/api/aggregate?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
    setData(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Live Environmental Data Dashboard</h1>
      {data && (
        <>
          <MapVisualization latitude={parseFloat(data.lat)} longitude={parseFloat(data.lon)} />
          <WeatherCards temperature={data.temperature} humidity={data.humidity} aqi={data.aqi} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ProgressTracker label="Temperature (°C)" value={data.temperature} max={50} color="#ff9800" />
            <ProgressTracker label="Humidity (%)" value={data.humidity} max={100} color="#2196f3" />
            <ProgressTracker label="PM2.5" value={data.aqi ?? 0} max={500} color="#8bc34a" />
          </div>
          <h3 style={{ marginTop: 32 }}>Last 24h Temperature</h3>
          <WeatherCarousel hourly={data.hourly} />
          {data.anomaly && (
            <div style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: 20 }}>
              ⚠️ Temperature anomaly detected!
            </div>
          )}
        </>
      )}
      {loading && <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>}
    </div>
  );
};

export default App;
