import { useState, useEffect } from 'react';
import { City, WeatherData } from '../types/weather.types';
import { getWeather } from '../api/weatherApi';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCity, setLastCity] = useState<City | null>(null);

  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
      try {
        const city = JSON.parse(savedCity);
        setLastCity(city);
        fetchWeather(city);
      } catch (e) {
        console.error('Ошибка загрузки сохраненного города');
      }
    }
  }, []);

  const fetchWeather = async (city: City) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getWeather(city.lat, city.lon);
      if (data) {
        setWeather(data);
        setLastCity(city);
        localStorage.setItem('lastCity', JSON.stringify(city));
      } else {
        setError('Не удалось получить данные о погоде');
      }
    } catch (err) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  return { weather, loading, error, lastCity, fetchWeather };
};