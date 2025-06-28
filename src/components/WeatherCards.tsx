import React from 'react';
import AnimatedNumber from './AnimatedNumber';

interface Props {
  temperature: number;
  humidity: number;
  aqi: number | null;
}

const WeatherCards: React.FC<Props> = ({ temperature, humidity, aqi }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
    <div className="card">
      <h3>Temperature</h3>
      <AnimatedNumber value={temperature} /> °C
    </div>
    <div className="card">
      <h3>Humidity</h3>
      <AnimatedNumber value={humidity} /> %
    </div>
    <div className="card">
      <h3>PM2.5</h3>
      {aqi !== null ? <AnimatedNumber value={aqi} /> : 'N/A'}
    </div>
  </div>
);

export default WeatherCards;
