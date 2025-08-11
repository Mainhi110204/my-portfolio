import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        if (!res.ok) {
          throw new Error("Lỗi khi gọi API");
        }
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading) {
    return (
      <div className="userlist-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">⏳ Đang tải dữ liệu người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userlist-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Oops! Có lỗi xảy ra</h2>
          <p className="error-message">{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="userlist-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="userlist-header" variants={cardVariants}>
        <h1 className="userlist-title">👥 Danh Sách Người Dùng</h1>
        <p className="userlist-subtitle">
          Khám phá thông tin người dùng từ JSONPlaceholder API
        </p>

        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </motion.div>

      <motion.div className="users-stats" variants={cardVariants}>
        <div className="stat-item">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Tổng người dùng</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredUsers.length}</span>
          <span className="stat-label">Kết quả tìm kiếm</span>
        </div>
      </motion.div>

      <motion.div className="users-grid" variants={containerVariants}>
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            className="user-card"
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="user-avatar">
              <div className="avatar-circle">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-status online"></div>
            </div>

            <div className="user-info">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-username">@{user.username}</p>

              <div className="user-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <span className="detail-text">{user.email}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📱</span>
                  <span className="detail-text">{user.phone}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🌐</span>
                  <span className="detail-text">{user.website}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🏢</span>
                  <span className="detail-text">{user.company.name}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span className="detail-text">{user.address.city}</span>
                </div>
              </div>
            </div>

            <div className="user-actions">
              <button className="action-btn primary">
                <span>💬</span> Liên hệ
              </button>
              <button className="action-btn secondary">
                <span>👁️</span> Xem chi tiết
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredUsers.length === 0 && searchTerm && (
        <motion.div className="no-results" variants={cardVariants}>
          <div className="no-results-icon">🔍</div>
          <h3>Không tìm thấy kết quả</h3>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </motion.div>
      )}
    </motion.div>
  );
}
