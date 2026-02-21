import axios from 'axios';
import { City, WeatherData } from '../types/weather.types';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const countryNames: Record<string, string> = {
  'RU': 'Россия',
  'US': 'США',
  'BY': 'Беларусь',
  'UA': 'Украина',
  'KZ': 'Казахстан',
  'CN': 'Китай',
  'DE': 'Германия',
  'FR': 'Франция',
  'IT': 'Италия',
  'ES': 'Испания',
  'TR': 'Турция',
  'EG': 'Египет',
  'TH': 'Таиланд',
  'VN': 'Вьетнам',
  'IN': 'Индия',
  'JP': 'Япония',
  'KR': 'Южная Корея',
  'GB': 'Великобритания'
};

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await axios.get(GEO_API_URL, {
      params: {
        name: query,
        count: 10, // Увеличим количество результатов
        language: 'ru',
        format: 'json'
      }
    });
    
    return response.data.results?.map((city: any) => ({
      name: city.name,
      country: countryNames[city.country_code] || city.country,
      country_code: city.country_code,
      lat: city.latitude,
      lon: city.longitude
    })) || [];
  } catch (error) {
    console.error('Ошибка поиска города:', error);
    return [];
  }
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: ['temperature_2m', 'weathercode', 'relativehumidity_2m', 'apparent_temperature', 'pressure_msl', 'uv_index'],
        daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset'],
        timezone: 'auto',
        forecast_days: 7,
        windspeed_unit: 'kmh'
      }
    });
    
    return {
      current: {
        temperature: response.data.current_weather.temperature,
        windspeed: response.data.current_weather.windspeed,
        weathercode: response.data.current_weather.weathercode,
        time: response.data.current_weather.time,
        apparent_temperature: response.data.hourly.apparent_temperature[0],
        humidity: response.data.hourly.relativehumidity_2m[0],
        pressure: response.data.hourly.pressure_msl[0],
        uv_index: response.data.hourly.uv_index[0]
      },
      daily: response.data.daily,
      hourly: response.data.hourly
    };
  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    return null;
  }
};

export const getWeatherDescription = (code: number): { text: string; icon: string; gradient: string } => {
  const weatherMap: Record<number, { text: string; icon: string; gradient: string }> = {
    0: { text: 'Ясно', icon: '☀️', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    1: { text: 'Преимущественно ясно', icon: '🌤️', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    2: { text: 'Переменная облачность', icon: '⛅', gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' },
    3: { text: 'Пасмурно', icon: '☁️', gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' },
    45: { text: 'Туман', icon: '🌫️', gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' },
    48: { text: 'Изморозь', icon: '🌫️', gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' },
    51: { text: 'Легкая морось', icon: '🌧️', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    53: { text: 'Морось', icon: '🌧️', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    55: { text: 'Сильная морось', icon: '🌧️', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    61: { text: 'Небольшой дождь', icon: '🌦️', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    63: { text: 'Дождь', icon: '🌧️', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    65: { text: 'Сильный дождь', icon: '🌧️', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    71: { text: 'Небольшой снег', icon: '🌨️', gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' },
    73: { text: 'Снег', icon: '🌨️', gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' },
    75: { text: 'Сильный снег', icon: '❄️', gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' },
    95: { text: 'Гроза', icon: '⛈️', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    96: { text: 'Гроза с градом', icon: '⛈️', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    99: { text: 'Сильная гроза', icon: '⛈️', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  };
  
  return weatherMap[code] || { text: 'Неизвестно', icon: '❓', gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' };
};