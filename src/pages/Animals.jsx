import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Animals.css";

export default function Animals() {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [animalType, setAnimalType] = useState("cat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchRandomAnimal = async (type) => {
    setLoading(true);
    setError(null);
    
    try {
      let url;
      if (type === "cat") {
        url = "https://api.thecatapi.com/v1/images/search";
      } else {
        url = "https://dog.ceo/api/breeds/image/random";
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Không thể tải ảnh");
      }
      
      const data = await response.json();
      
      if (type === "cat") {
        setCurrentAnimal({
          id: data[0].id,
          url: data[0].url,
          type: "cat"
        });
      } else {
        setCurrentAnimal({
          id: Date.now(), // Dog API không có ID
          url: data.message,
          type: "dog"
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAnimal(animalType);
  }, [animalType]);

  const handleAnimalTypeChange = (type) => {
    setAnimalType(type);
  };

  const addToFavorites = () => {
    if (currentAnimal && !favorites.find(fav => fav.id === currentAnimal.id)) {
      setFavorites([...favorites, currentAnimal]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
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

  return (
    <motion.div
      className="animals-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="animals-header" variants={itemVariants}>
        <h1 className="animals-title">🐱🐶 Cute Animals</h1>
        <p className="animals-subtitle">
          Thư giãn với những hình ảnh dễ thương của mèo và chó
        </p>
      </motion.div>

      <motion.div className="animal-controls" variants={itemVariants}>
        <div className="type-selector">
          <button
            className={`type-btn ${animalType === "cat" ? "active" : ""}`}
            onClick={() => handleAnimalTypeChange("cat")}
          >
            🐱 Mèo
          </button>
          <button
            className={`type-btn ${animalType === "dog" ? "active" : ""}`}
            onClick={() => handleAnimalTypeChange("dog")}
          >
            🐶 Chó
          </button>
        </div>

        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => fetchRandomAnimal(animalType)}
            disabled={loading}
          >
            {loading ? "⏳" : "🎲"} {loading ? "Đang tải..." : "Ảnh mới"}
          </button>
          
          <button
            className="action-btn secondary"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            ❤️ Yêu thích ({favorites.length})
          </button>
        </div>
      </motion.div>

      {!showFavorites ? (
        <motion.div className="current-animal-section" variants={itemVariants}>
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => fetchRandomAnimal(animalType)}
              >
                🔄 Thử lại
              </button>
            </div>
          )}

          {currentAnimal && !error && (
            <motion.div
              className="animal-card main"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animal-image-container">
                <img
                  src={currentAnimal.url}
                  alt={`Random ${currentAnimal.type}`}
                  className="animal-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x400/cbddd1/ffffff?text=Lỗi+tải+ảnh";
                  }}
                />
                <div className="image-overlay">
                  <button
                    className="favorite-btn"
                    onClick={addToFavorites}
                    disabled={favorites.find(fav => fav.id === currentAnimal.id)}
                  >
                    {favorites.find(fav => fav.id === currentAnimal.id) ? "💖" : "🤍"}
                  </button>
                </div>
              </div>
              
              <div className="animal-info">
                <h3 className="animal-title">
                  {currentAnimal.type === "cat" ? "🐱 Mèo dễ thương" : "🐶 Chó đáng yêu"}
                </h3>
                <p className="animal-description">
                  {currentAnimal.type === "cat" 
                    ? "Một chú mèo xinh xắn đang chờ bạn yêu thương!" 
                    : "Một chú chó trung thành đang chờ bạn vuốt ve!"
                  }
                </p>
                
                <div className="animal-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => fetchRandomAnimal(animalType)}
                    disabled={loading}
                  >
                    🎲 Ảnh khác
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={addToFavorites}
                    disabled={favorites.find(fav => fav.id === currentAnimal.id)}
                  >
                    {favorites.find(fav => fav.id === currentAnimal.id) ? "💖 Đã thích" : "🤍 Thích"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div className="favorites-section" variants={itemVariants}>
          <div className="favorites-header">
            <h2>❤️ Ảnh yêu thích của bạn</h2>
            <p>Bạn đã lưu {favorites.length} ảnh dễ thương</p>
          </div>

          {favorites.length === 0 ? (
            <div className="empty-favorites">
              <div className="empty-icon">💔</div>
              <h3>Chưa có ảnh yêu thích</h3>
              <p>Hãy thêm một số ảnh dễ thương vào danh sách yêu thích!</p>
              <button
                className="action-btn primary"
                onClick={() => setShowFavorites(false)}
              >
                🎲 Xem ảnh ngẫu nhiên
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((animal) => (
                <motion.div
                  key={animal.id}
                  className="animal-card favorite"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="animal-image-container">
                    <img
                      src={animal.url}
                      alt={`Favorite ${animal.type}`}
                      className="animal-image"
                    />
                    <div className="image-overlay">
                      <button
                        className="remove-btn"
                        onClick={() => removeFromFavorites(animal.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="animal-type-badge">
                    {animal.type === "cat" ? "🐱" : "🐶"}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <motion.div className="fun-facts" variants={itemVariants}>
        <h3>🎉 Bạn có biết?</h3>
        <div className="facts-grid">
          <div className="fact-item">
            <span className="fact-icon">🐱</span>
            <p>Mèo có thể tạo ra hơn 100 âm thanh khác nhau!</p>
          </div>
          <div className="fact-item">
            <span className="fact-icon">🐶</span>
            <p>Chó có thể học được hơn 150 từ và có thể đếm đến 4 hoặc 5!</p>
          </div>
          <div className="fact-item">
            <span className="fact-icon">❤️</span>
            <p>Vuốt ve động vật có thể giảm stress và huyết áp!</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
