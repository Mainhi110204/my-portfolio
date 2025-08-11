import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./GitHub.css";

export default function GitHub() {
  const [repos, setRepos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Thay 'Mainhi110204' bằng username GitHub của bạn
  const username = "Mainhi110204";

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error("Không thể tải thông tin GitHub");
        }
        const userData = await userResponse.json();
        setUserInfo(userData);

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
        if (!reposResponse.ok) {
          throw new Error("Không thể tải repositories");
        }
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <div className="github-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">🐙 Đang tải GitHub repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Không thể tải dữ liệu GitHub</h2>
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
      className="github-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="github-header" variants={itemVariants}>
        <h1 className="github-title">🐙 GitHub Repositories</h1>
        <p className="github-subtitle">
          Khám phá các dự án mã nguồn mở của tôi trên GitHub
        </p>
      </motion.div>

      {userInfo && (
        <motion.div className="user-profile" variants={itemVariants}>
          <div className="profile-avatar">
            <img src={userInfo.avatar_url} alt={userInfo.name} />
            <div className="profile-status online"></div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{userInfo.name || userInfo.login}</h2>
            <p className="profile-username">@{userInfo.login}</p>
            {userInfo.bio && <p className="profile-bio">{userInfo.bio}</p>}
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{userInfo.public_repos}</span>
                <span className="stat-label">Repositories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userInfo.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userInfo.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
            
            <div className="profile-links">
              <a href={userInfo.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                <span>🔗</span> GitHub Profile
              </a>
              {userInfo.blog && (
                <a href={userInfo.blog} target="_blank" rel="noopener noreferrer" className="profile-link">
                  <span>🌐</span> Website
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div className="search-section" variants={itemVariants}>
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm repository..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="repos-stats">
          <div className="stat-item">
            <span className="stat-number">{repos.length}</span>
            <span className="stat-label">Tổng repos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredRepos.length}</span>
            <span className="stat-label">Kết quả</span>
          </div>
        </div>
      </motion.div>

      <motion.div className="repos-grid" variants={containerVariants}>
        {filteredRepos.map((repo) => (
          <motion.div
            key={repo.id}
            className="repo-card"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="repo-header">
              <div className="repo-icon">
                {repo.fork ? "🍴" : "📁"}
              </div>
              <div className="repo-info">
                <h3 className="repo-name">{repo.name}</h3>
                {repo.fork && <span className="fork-badge">Forked</span>}
              </div>
            </div>
            
            <p className="repo-description">
              {repo.description || "Không có mô tả"}
            </p>
            
            <div className="repo-stats">
              <div className="stat">
                <span className="stat-icon">⭐</span>
                <span>{repo.stargazers_count}</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🍴</span>
                <span>{repo.forks_count}</span>
              </div>
              {repo.language && (
                <div className="stat">
                  <span className="language-dot" style={{backgroundColor: getLanguageColor(repo.language)}}></span>
                  <span>{repo.language}</span>
                </div>
              )}
            </div>
            
            <div className="repo-meta">
              <span className="updated-date">
                Cập nhật: {new Date(repo.updated_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
            
            <div className="repo-actions">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                <span>👁️</span> Xem code
              </a>
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                  <span>🚀</span> Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredRepos.length === 0 && searchTerm && (
        <motion.div className="no-results" variants={itemVariants}>
          <div className="no-results-icon">🔍</div>
          <h3>Không tìm thấy repository</h3>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper function để lấy màu cho ngôn ngữ lập trình
function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#1572B6',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#239120',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    Ruby: '#701516',
    Vue: '#2c3e50',
    React: '#61DAFB'
  };
  return colors[language] || '#586069';
}
