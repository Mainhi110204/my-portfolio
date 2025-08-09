import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./About.css";
import avatarUrl from "../assets/avatar.jpg"; 

export default function About() {
  return (
    <motion.main
      className="about-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <section className="about-card">
        <div className="about-avatar">
          <img src={avatarUrl} alt="Ảnh đại diện Nguyễn Mai Phượng Nhi" />
        </div>

        <div className="about-info">
          <h1 className="name">Nguyễn Mai Phượng Nhi</h1>
          <p className="title">Thực tập sinh Frontend</p>

          <p className="bio">
            Mình là lập trình viên frontend đam mê tạo ra những trải nghiệm web mượt mà và đẹp mắt.
          </p>

          <div className="skills-row">
            <span className="skill">ReactJS</span>
            <span className="skill">HTML5 / CSS3</span>
            <span className="skill">GitHub</span>
            <span className="skill">Figma</span>
            <span className="skill">Photoshop</span>
            <span className="skill">SQL Server</span>
          </div>

          <div className="cta-row">
            <Link className="btn-primary" to="/projects">
              <span></span> Xem dự án
            </Link>
            <Link className="btn-outline" to="/contact">
              <span></span> Liên hệ
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
