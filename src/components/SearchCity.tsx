import React, { useState, useEffect, useRef } from 'react';
import { searchCities } from '../api/weatherApi';
import { City, SearchCityProps } from '../types/weather.types';
import './SearchCity.css';

const SearchCity: React.FC<SearchCityProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const results = await searchCities(query);
        
        const sortedResults = results.sort((a, b) => {
          if (a.country === 'Россия' && b.country !== 'Россия') return -1;
          if (a.country !== 'Россия' && b.country === 'Россия') return 1;
          return 0;
        });
        
        setCities(sortedResults);
        setIsLoading(false);
        setShowResults(true);
      } else {
        setCities([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (city: City) => {
    onCitySelect(city);
    setQuery('');
    setShowResults(false);
  };

  const getCountryName = (countryCode: string): string => {
    const countries: Record<string, string> = {
      'Russia': 'Россия',
      'USA': 'США',
      'United States': 'США',
      'Belarus': 'Беларусь',
      'Ukraine': 'Украина',
      'Kazakhstan': 'Казахстан',
      'China': 'Китай',
      'Germany': 'Германия',
      'France': 'Франция',
      'Italy': 'Италия',
      'Spain': 'Испания',
      'Turkey': 'Турция',
      'Egypt': 'Египет',
      'Thailand': 'Таиланд',
      'Vietnam': 'Вьетнам',
      'India': 'Индия',
      'Japan': 'Япония',
      'South Korea': 'Южная Корея',
      'UK': 'Великобритания',
      'United Kingdom': 'Великобритания'
    };
    
    return countries[countryCode] || countryCode;
  };
  
  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Введите название города (например: Москва)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />
      {showResults && (
        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">Поиск...</div>
          ) : cities.length > 0 ? (
            cities.map((city, index) => (
              <div
                key={`${city.lat}-${city.lon}-${index}`}
                className="search-item"
                onClick={() => handleSelect(city)}
              >
                <span>
                  <strong>{city.name}</strong>
                </span>
                <span style={{ color: '#667eea', fontSize: '14px' }}>
                  {getCountryName(city.country)}
                </span>
              </div>
            ))
          ) : (
            <div className="search-no-results">
              {query.length >= 2 ? 'Города не найдены' : 'Введите минимум 2 символа'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCity;