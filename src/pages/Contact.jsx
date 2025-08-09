import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.");
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      value: "phuongnhi110204@gmail.com",
      link: "mailto:phuongnhi110204@gmail.com",
      description: "Gửi email trực tiếp cho tôi"
    },
    {
      icon: "💼",
      title: "GitHub",
      value: "Mainhi110204",
      link: "https://github.com/Mainhi110204",
      description: "Xem các dự án của tôi"
    },
    {
      icon: "💬",
      title: "Zalo",
      value: "0393 775 667",
      link: "tel:0393 775 667",
      description: "Liên hệ qua Zalo/Phone"
    },
    
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
      className="contact-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="contact-header" variants={itemVariants}>
        <h1 className="contact-title">Liên Hệ Với Tôi</h1>
        <p className="contact-subtitle">
          Hãy cùng nhau tạo ra những điều tuyệt vời! Tôi luôn sẵn sàng lắng nghe ý tưởng của bạn.
        </p>
      </motion.div>

      <div className="contact-content">
        <motion.div className="contact-methods" variants={itemVariants}>
          <h2 className="section-title">Thông Tin Liên Hệ</h2>
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-content">
                  <h3 className="method-title">{method.title}</h3>
                  <p className="method-value">{method.value}</p>
                  <p className="method-desc">{method.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div className="contact-form-section" variants={itemVariants}>
          <h2 className="section-title">Gửi Tin Nhắn</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Chủ đề</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Chủ đề tin nhắn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Tin nhắn *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Hãy chia sẻ ý tưởng hoặc dự án bạn muốn thực hiện..."
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="btn-submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span></span> Gửi Tin Nhắn
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
