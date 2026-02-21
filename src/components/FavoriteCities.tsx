import React from 'react';
import { FavoriteCity } from '../types/weather.types';
import { getWeatherDescription } from '../api/weatherApi';
import './FavoriteCities.css';

interface FavoriteCitiesProps {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (cityId: string) => void;
  currentCity?: string;
}

const FavoriteCities: React.FC<FavoriteCitiesProps> = ({ 
  favorites, 
  onSelect, 
  onRemove,
  currentCity 
}) => {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-container">
      <h3 className="favorites-title">⭐ Избранные города</h3>
      <div className="favorites-grid">
        {favorites.map((city) => {
          const isActive = currentCity === city.name;
          const weatherIcon = getWeatherDescription(
            city.lastUpdated ? 0 : 0
          ).icon;

          return (
            <div
              key={city.id}
              className={`favorite-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(city)}
            >
              <button
                className="favorite-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(city.id);
                }}
              >
                ×
              </button>
              <div className="favorite-icon">⭐</div>
              <div className="favorite-info">
                <div className="favorite-city-name">{city.name}</div>
                <div className="favorite-country">{city.country}</div>
              </div>
              <div className="favorite-weather-icon">{weatherIcon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteCities;