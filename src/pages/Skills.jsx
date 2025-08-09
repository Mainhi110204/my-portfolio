import React from "react";
import { motion } from "framer-motion";
import "./Skills.css";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "ReactJS", level: 85, icon: "⚛️" },
        { name: "HTML5", level: 90, icon: "🌐" },
        { name: "CSS3", level: 85, icon: "🎨" },
        { name: "JavaScript", level: 80, icon: "📜" },
        { name: "Responsive Design", level: 85, icon: "📱" }
      ]
    },
    {
      title: "Design & Tools",
      skills: [
        { name: "Figma", level: 75, icon: "✏️" },
        { name: "Photoshop", level: 70, icon: "🖼️" },
        { name: "UI/UX Design", level: 75, icon: "✨" }
      ]
    },
    {
      title: "Development Tools",
      skills: [
        { name: "Git/GitHub", level: 80, icon: "🔧" },
        { name: "VS Code", level: 90, icon: "💻" },
        { name: "SQL Server", level: 65, icon: "🗄️" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="skills-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="skills-header">
        <h1 className="skills-title">Kỹ Năng Của Tôi</h1>
        <p className="skills-subtitle">
          Những công nghệ và công cụ tôi sử dụng để tạo ra những sản phẩm tuyệt vời
        </p>
      </motion.div>

      <div className="skills-grid">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            className="skill-category"
            variants={categoryVariants}
          >
            <h2 className="category-title">{category.title}</h2>
            <div className="skills-list">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  className="skill-item"
                  variants={skillVariants}
                >
                  <div className="skill-header">
                    <span className="skill-icon">{skill.icon}</span>
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
