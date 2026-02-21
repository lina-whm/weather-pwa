export interface City {
  name: string;
  country: string;
  country_code?: string;
  lat: number;
  lon: number;
}

export interface FavoriteCity extends City {
  id: string;
  lastUpdated?: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
    apparent_temperature?: number;
    humidity?: number;
    pressure?: number;
    uv_index?: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise?: string[];
    sunset?: string[];
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
}

export interface WeatherCardProps {
  data: WeatherData;
  cityName: string;
  country: string;
  onRefresh?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export interface SearchCityProps {
  onCitySelect: (city: City) => void;
  favorites?: FavoriteCity[];
  onFavoriteSelect?: (city: FavoriteCity) => void;
  onFavoriteRemove?: (cityId: string) => void;
}