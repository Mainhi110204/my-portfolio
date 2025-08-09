import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Projects.css";
import apptmdtUrl from "../assets/apptmdt.png";
import avatarUrl from "../assets/avatar.jpg";
import tienganhUrl from "../assets/daytienganh.png";

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "E-Commerce App",
      description: "Ứng dụng thương mại điện tử với Flutter, tích hợp thanh toán và quản lý sản phẩm",
      image: apptmdtUrl,
      technologies: ["Flutter", "Node.js", "SQlife", "Stripe"],
      category: "app",
      demoUrl: "#",
      githubUrl: "https://github.com/qtuan0343/flutter-ecommerce-app.git",
      status: "Hoàn thành"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "Website portfolio cá nhân với animation mượt mà và responsive design",
      image: avatarUrl,
      technologies: ["ReactJS", "Framer Motion", "CSS3"],
      category: "web",
      demoUrl: "#",
      githubUrl: "#",
      status: "Đang phát triển"
    },
    {
      id: 3,
      title: "Website quản lý trung tâm dạy tiếng anh ",
      description: "Xây dựng một trang web cho trung tâm dạy tiếng anh với ReactJS, .Net core, SQL Server",
      image: tienganhUrl,
      technologies: ["Figma", "ReactJS", ".Net Core", "SQL Server"],
      category: "web",
      demoUrl: "#",
      githubUrl: "#",
      status: "Hoàn thành"
    }
  ];

  const categories = [
    { key: "all", label: "Tất cả" },
    { key: "web", label: "Web Development" },
    { key: "app", label: "Applications" }
  ];

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(project => project.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      className="projects-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="projects-header">
        <h1 className="projects-title">Dự Án Của Tôi</h1>
        <p className="projects-subtitle">
          Khám phá những dự án tôi đã thực hiện với đam mê và sự sáng tạo
        </p>
      </div>

      <div className="projects-filter">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`filter-btn ${filter === category.key ? "active" : ""}`}
            onClick={() => setFilter(category.key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <motion.div
        className="projects-grid"
        layout
      >
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            className="project-card"
            variants={projectVariants}
            layout
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="project-image">
              <img src={project.image} alt={project.title} />
              <div className="project-overlay">
                <div className="project-links">
                  <a href={project.demoUrl} className="btn-demo">
                    <span>👁️</span> Demo
                  </a>
                  <a href={project.githubUrl} className="btn-github">
                    <span>📁</span> Code
                  </a>
                </div>
              </div>
            </div>

            <div className="project-content">
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className={`project-status ${project.status === 'Hoàn thành' ? 'completed' : 'in-progress'}`}>
                  {project.status}
                </span>
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-technologies">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
