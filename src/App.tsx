import React, { useState, useEffect } from 'react';
import './App.css';
import SearchCity from './components/SearchCity';
import WeatherCard from './components/WeatherCard';
import FavoriteCities from './components/FavoriteCities';
import { useWeather } from './hooks/useWeather';
import { City, FavoriteCity } from './types/weather.types';

function App() {
  const { weather, loading, error, lastCity, fetchWeather } = useWeather();
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCities');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Ошибка загрузки избранного');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);

  const handleCitySelect = (city: City) => {
    fetchWeather(city);
  };

  const handleFavoriteSelect = (city: FavoriteCity) => {
    fetchWeather(city);
  };

  const toggleFavorite = () => {
    if (!lastCity || !weather) return;

    const isFavorite = favorites.some(fav => fav.name === lastCity.name && fav.country === lastCity.country);
    
    if (isFavorite) {
      setFavorites(prev => prev.filter(
        fav => !(fav.name === lastCity.name && fav.country === lastCity.country)
      ));
    } else {
      const newFavorite: FavoriteCity = {
        ...lastCity,
        id: `${lastCity.name}-${lastCity.country}-${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const removeFavorite = (cityId: string) => {
    setFavorites(prev => prev.filter(city => city.id !== cityId));
  };

  const isCurrentCityFavorite = lastCity ? favorites.some(
    fav => fav.name === lastCity.name && fav.country === lastCity.country
  ) : false;

  return (
    <div className="app">
      <header className="app-header glass-effect">
        <h1 className="app-title">
          <span className="title-icon">🌤️</span>
          Прогноз погоды
        </h1>
        <button 
          className="toggle-favorites-btn"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? '▼' : '▶'} Избранное
        </button>
      </header>

      <main className="app-main">
        <div className="search-section glass-effect">
          <SearchCity onCitySelect={handleCitySelect} />
        </div>

        {showFavorites && favorites.length > 0 && (
          <FavoriteCities 
            favorites={favorites}
            onSelect={handleFavoriteSelect}
            onRemove={removeFavorite}
            currentCity={lastCity?.name}
          />
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p className="loading-text">Загружаем данные о погоде...</p>
          </div>
        )}

        {error && (
          <div className="error glass-effect">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => lastCity && fetchWeather(lastCity)} className="retry-btn">
              Попробовать снова
            </button>
          </div>
        )}

        {weather && lastCity && !loading && (
          <div className="weather-section animate-slideUp">
            <WeatherCard 
              data={weather} 
              cityName={lastCity.name}
              country={lastCity.country}
              onRefresh={() => fetchWeather(lastCity)}
              isFavorite={isCurrentCityFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="welcome glass-effect">
            <div className="welcome-icon">🌤️</div>
            <h2>Добро пожаловать!</h2>
            <p>Введите название города, чтобы узнать погоду</p>
            <div className="welcome-hint">
              <span>🔍</span>
              <span>Например: Москва, Санкт-Петербург, Екатеринбург</span>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer glass-effect">
        <p>© 2026 Прогноз погоды. Данные предоставлены Open-Meteo.com. Проект для портфолио </p>
        <div className="footer-links">
          <span>⭐ {favorites.length} избранных городов</span>
        </div>
      </footer>
    </div>
  );
}

export default App;