import React, { useState, useEffect } from 'react';
import { WeatherCardProps } from '../types/weather.types';
import { getWeatherDescription } from '../api/weatherApi';
import './WeatherCard.css';

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  data, 
  cityName, 
  country,
  onRefresh,
  isFavorite,
  onToggleFavorite 
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentWeather = getWeatherDescription(data.current.weathercode);
  
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
    
    return date.toLocaleDateString('ru-RU', { weekday: 'long' });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getHourlyForecast = () => {
    if (!data.hourly) return [];
    const now = new Date();
    const currentHour = now.getHours();
    
    return data.hourly.time
      .map((time, index) => ({
        hour: new Date(time).getHours(),
        temp: Math.round(data.hourly!.temperature_2m[index]),
        weathercode: data.hourly!.weathercode[index]
      }))
      .filter(item => item.hour >= currentHour && item.hour <= currentHour + 8)
      .slice(0, 8);
  };

  const hourlyForecast = getHourlyForecast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (onRefresh) onRefresh();
    }, 300000);
    
    return () => clearInterval(interval);
  }, [onRefresh]);

  return (
    <div 
      className="weather-container"
      style={{ background: currentWeather.gradient }}
    >
      <div className="weather-header">
        <div className="city-info">
          <h1 className="city-name">{cityName}</h1>
          <span className="country">{country}</span>
        </div>
        <div className="header-actions">
          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            aria-label="Обновить"
          >
            ↻
          </button>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Сегодня
        </button>
        <button 
          className={`tab ${activeTab === 'week' ? 'active' : ''}`}
          onClick={() => setActiveTab('week')}
        >
          Неделя
        </button>
      </div>

      {activeTab === 'today' ? (
        <>
          <div className="current-weather">
            <div className="weather-icon-large animate-float">
              {currentWeather.icon}
            </div>
            <div className="temperature-large animate-temperature">
              {Math.round(data.current.temperature)}°
            </div>
            <div className="weather-description">{currentWeather.text}</div>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">💨 Ветер</span>
                <span className="detail-value">{data.current.windspeed} км/ч</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">💧 Влажность</span>
                <span className="detail-value">{data.current.humidity || 0}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🌡️ Ощущается</span>
                <span className="detail-value">
                  {Math.round(data.current.apparent_temperature || data.current.temperature)}°
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">☀️ UV индекс</span>
                <span className="detail-value">{data.current.uv_index || 0}</span>
              </div>
            </div>
          </div>

          {hourlyForecast.length > 0 && (
            <div className="hourly-forecast">
              <h3>Почасовой прогноз</h3>
              <div className="hourly-list">
                {hourlyForecast.map((hour, index) => {
                  const weather = getWeatherDescription(hour.weathercode);
                  return (
                    <div key={index} className="hour-item">
                      <div className="hour-time">{hour.hour}:00</div>
                      <div className="hour-icon">{weather.icon}</div>
                      <div className="hour-temp">{hour.temp}°</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="forecast">
          <div className="forecast-list">
            {data.daily.time.map((date, index) => {
              const weather = getWeatherDescription(data.daily.weathercode[index]);
              const dayName = getDayName(date);
              const isToday = dayName === 'Сегодня';
              const isTomorrow = dayName === 'Завтра';
              
              return (
                <div 
                  key={date} 
                  className={`forecast-item ${isToday ? 'today' : ''} ${isTomorrow ? 'tomorrow' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="forecast-day">{dayName}</div>
                  <div className="forecast-icon">{weather.icon}</div>
                  <div className="forecast-temp">
                    <span className="temp-max">
                      {Math.round(data.daily.temperature_2m_max[index])}°
                    </span>
                    <span className="temp-min">
                      {Math.round(data.daily.temperature_2m_min[index])}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;