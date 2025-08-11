import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Weather.css";

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Ho Chi Minh City");
  const [searchCity, setSearchCity] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // 🔑 API key từ OpenWeatherMap - THAY BẰNG API KEY CỦA BẠN!
  // 📝 Lấy tại: https://openweathermap.org/api
  const API_KEY = "4c13180ea3a30143566f574ff9b9efc7"; // ✅ API key đã kích hoạt

  // 🌍 Lấy vị trí hiện tại của người dùng
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ Geolocation");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Vị trí hiện tại:", { latitude, longitude });

        try {
          // Lấy thời tiết theo tọa độ
          const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=en`;
          const response = await fetch(currentUrl);

          if (response.ok) {
            const data = await response.json();
            setCity(data.name + ", " + data.sys.country);
            await fetchWeatherData(data.name);
          } else {
            setError("Không thể lấy thời tiết từ vị trí hiện tại");
          }
        } catch (err) {
          setError("Lỗi khi lấy thời tiết từ vị trí: " + err.message);
        }

        setGettingLocation(false);
      },
      (error) => {
        console.error("❌ Lỗi Geolocation:", error);
        let errorMessage = "Không thể lấy vị trí hiện tại";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng";
            break;
          case error.TIMEOUT:
            errorMessage = "Hết thời gian chờ lấy vị trí";
            break;
        }

        setError(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 phút
      }
    );
  };

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching weather for:", cityName);
      console.log("Using API key:", API_KEY.substring(0, 8) + "...");

      // Fetch current weather
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=en`;
      console.log("Current weather URL:", currentUrl);

      const currentResponse = await fetch(currentUrl);
      console.log("Current response status:", currentResponse.status);

      if (!currentResponse.ok) {
        const errorText = await currentResponse.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error ${currentResponse.status}: ${errorText}`);
      }

      const currentData = await currentResponse.json();
      console.log("Current weather data:", currentData);
      setCurrentWeather(currentData);

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=en`;
      const forecastResponse = await fetch(forecastUrl);

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        console.log("Forecast data:", forecastData);
        // Lấy dự báo cho 5 ngày (mỗi 24h)
        const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
        setForecast(dailyForecast);
      }

    } catch (err) {
      console.error("Weather API Error:", err);

      // Kiểm tra các loại lỗi khác nhau
      if (err.message.includes('404')) {
        setError(`❌ Không tìm thấy thành phố "${cityName}"`);
      } else if (err.message.includes('401')) {
        setError("🔑 API key không hợp lệ hoặc đã hết hạn");
      } else if (err.message.includes('429')) {
        setError("⏰ Đã vượt quá giới hạn API. Thử lại sau vài phút");
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("🌐 Lỗi kết nối mạng. Kiểm tra internet");
      } else {
        setError(`⚠️ ${err.message}`);
      }

      // Fallback data khi có lỗi
      setCurrentWeather({
        name: cityName,
        main: { temp: 28, feels_like: 32, humidity: 75, pressure: 1013 },
        weather: [{ main: "Clear", description: "trời quang (demo data)", icon: "01d" }],
        wind: { speed: 3.5 },
        visibility: 10000,
        sys: { country: "VN" },
        isDemo: true // Flag để biết đây là demo data
      });
      setForecast([
        { dt: Date.now()/1000, main: { temp: 29 }, weather: [{ main: "Sunny", icon: "01d" }] },
        { dt: Date.now()/1000 + 86400, main: { temp: 27 }, weather: [{ main: "Clouds", icon: "02d" }] },
        { dt: Date.now()/1000 + 172800, main: { temp: 26 }, weather: [{ main: "Rain", icon: "10d" }] },
        { dt: Date.now()/1000 + 259200, main: { temp: 30 }, weather: [{ main: "Clear", icon: "01d" }] },
        { dt: Date.now()/1000 + 345600, main: { temp: 28 }, weather: [{ main: "Clouds", icon: "03d" }] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      setSearchCity("");
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return '#ef4444'; // Rất nóng - đỏ
    if (temp >= 30) return '#f97316'; // Nóng - cam
    if (temp >= 25) return '#eab308'; // Ấm - vàng
    if (temp >= 20) return '#22c55e'; // Mát - xanh lá
    if (temp >= 15) return '#3b82f6'; // Lạnh - xanh dương
    return '#8b5cf6'; // Rất lạnh - tím
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">🌤️ Đang tải dữ liệu thời tiết...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`weather-container ${darkMode ? 'dark-mode' : ''}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="weather-header" variants={itemVariants}>
        {/* Theme Toggle & Location Button */}
        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="location-btn"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            title="Lấy vị trí hiện tại"
          >
            {gettingLocation ? "📍⏳" : "📍"}
          </button>
        </div>

        <h1 className="weather-title">🌤️ Weather Dashboard</h1>
        <p className="weather-subtitle">
          Theo dõi thời tiết hiện tại và dự báo 5 ngày tới
        </p>

        <form className="search-container" onSubmit={handleSearch}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Nhập tên thành phố..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Tìm kiếm
            </button>
          </div>
        </form>
      </motion.div>

      {currentWeather && (
        <motion.div className="current-weather" variants={itemVariants}>
          <div className="weather-main">
            <div className="weather-location">
              <h2>{currentWeather.name}, {currentWeather.sys?.country}</h2>
              <p className="weather-date">{new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>

            <div className="weather-current">
              <div className="weather-icon-large">
                {getWeatherIcon(currentWeather.weather[0]?.icon)}
              </div>
              <div className="weather-temp">
                <span
                  className="temp-value"
                  style={{ color: getTemperatureColor(currentWeather.main.temp) }}
                >
                  {Math.round(currentWeather.main.temp)}°C
                </span>
                <p className="weather-desc">{currentWeather.weather[0]?.description}</p>
                <p className="feels-like">Cảm giác như {Math.round(currentWeather.main.feels_like)}°C</p>
              </div>
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <div className="detail-info">
                <span className="detail-label">Độ ẩm</span>
                <span className="detail-value">{currentWeather.main.humidity}%</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🌪️</span>
              <div className="detail-info">
                <span className="detail-label">Gió</span>
                <span className="detail-value">{currentWeather.wind?.speed || 0} m/s</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🔽</span>
              <div className="detail-info">
                <span className="detail-label">Áp suất</span>
                <span className="detail-value">{currentWeather.main.pressure} hPa</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">👁️</span>
              <div className="detail-info">
                <span className="detail-label">Tầm nhìn</span>
                <span className="detail-value">{(currentWeather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {forecast.length > 0 && (
        <motion.div className="forecast-section" variants={itemVariants}>
          <h3 className="forecast-title">📅 Dự báo 5 ngày tới</h3>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <motion.div
                key={index}
                className="forecast-card"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="forecast-date">
                  {index === 0 ? 'Hôm nay' :
                   new Date(day.dt * 1000).toLocaleDateString('vi-VN', {
                     weekday: 'short',
                     day: 'numeric'
                   })
                  }
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(day.weather[0]?.icon)}
                </div>
                <div className="forecast-temp">
                  <span
                    className="temp-high"
                    style={{ color: getTemperatureColor(day.main.temp) }}
                  >
                    {Math.round(day.main.temp)}°
                  </span>
                </div>
                <div className="forecast-desc">
                  {day.weather[0]?.main}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div className="weather-tips" variants={itemVariants}>
        <h3 className="tips-title">💡 Mẹo thời tiết</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">☀️</span>
            <div className="tip-content">
              <h4>Ngày nắng</h4>
              <p>Nhớ thoa kem chống nắng và mang theo nước uống!</p>
            </div>
          </div>

          <div className="tip-item">
            <span className="tip-icon">🌧️</span>
            <div className="tip-content">
              <h4>Ngày mưa</h4>
              <p>Mang theo ô và mặc áo mưa khi ra ngoài.</p>
            </div>
          </div>

          <div className="tip-item">
            <span className="tip-icon">🌪️</span>
            <div className="tip-content">
              <h4>Gió mạnh</h4>
              <p>Tránh đi gần cây cao và biển báo quảng cáo.</p>
            </div>
          </div>

          <div className="tip-item">
            <span className="tip-icon">❄️</span>
            <div className="tip-content">
              <h4>Trời lạnh</h4>
              <p>Mặc ấm và giữ gìn sức khỏe trong mùa lạnh.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div className="error-message" variants={itemVariants}>
          <div className="error-icon">⚠️</div>
          <h3>🔧 Thông tin Debug</h3>
          <p><strong>API Key:</strong> {API_KEY ? `${API_KEY.substring(0, 8)}...` : "❌ Chưa có"}</p>
          <p><strong>Error:</strong> {error}</p>
          <p><strong>Thành phố:</strong> {city}</p>

          <div className="debug-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                console.clear();
                console.log("🔄 Retesting API...");
                fetchWeatherData(city);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Test lại
            </button>

            <button
              onClick={() => {
                const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}&units=metric`;
                console.log("🧪 Testing API with London...");
                console.log("URL:", testUrl);
                fetch(testUrl)
                  .then(res => {
                    console.log("✅ Response status:", res.status);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                  })
                  .then(data => {
                    console.log("✅ API hoạt động tốt! Data:", data);
                    alert("✅ API hoạt động bình thường! Kiểm tra console để xem chi tiết.");
                  })
                  .catch(err => {
                    console.error("❌ API test failed:", err);
                    alert(`❌ API test thất bại: ${err.message}`);
                  });
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🧪 Test API
            </button>
          </div>

          {currentWeather?.isDemo && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255,193,7,0.1)', borderRadius: '5px' }}>
              <p><strong>📊 Status:</strong> Đang hiển thị dữ liệu demo</p>
              <p><small>💡 Mở Console (F12) để xem log chi tiết về lỗi API</small></p>
            </div>
          )}
        </motion.div>
      )}

      {!error && currentWeather && !currentWeather.isDemo && (
        <motion.div className="success-message" variants={itemVariants}>
          <div className="success-icon">✅</div>
          <p><strong>Thành công!</strong> Đang sử dụng dữ liệu thời tiết thực từ OpenWeatherMap API</p>
        </motion.div>
      )}
    </motion.div>
  );
}
