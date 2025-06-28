import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Props type for the component
interface WeatherCarouselProps {
  hourly: number[];
}

// Type for react-slick settings (optional, but helps with TypeScript)
interface SliderSettings {
  dots: boolean;
  infinite: boolean;
  slidesToShow: number;
  slidesToScroll: number;
  responsive?: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
    };
  }>;
}

const WeatherCarousel: React.FC<WeatherCarouselProps> = ({ hourly }) => {
  // Show the last 24 hours, or as many as available
  const last24 = hourly.slice(-24);

  const settings: SliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {last24.map((temp, idx) => (
        <div key={idx} style={{ padding: '10px', textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{temp.toFixed(1)}°C</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {24 - idx}h ago
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default WeatherCarousel;
