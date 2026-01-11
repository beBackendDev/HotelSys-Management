import React from "react";
import HomeLayout from "../../core/layout/HomeLayout";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  InstagramOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import Logo from "../../assets/images/Logo.png";

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },

  /* LEFT */
  left: {
    flex: 1,
    background: "linear-gradient(135deg, #8ae2fd, #b9f1ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  bigLogo: {
    maxWidth: 320,
    width: "70%",
    objectFit: "contain",
  },

  /* RIGHT */
  right: {
    flex: 1,
    background: "#ffffff",
    padding: "80px 100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  smallLogo: {
    width: 90,
    marginBottom: 28,
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.6,
    marginBottom: 32,
    maxWidth: 460,
    color: "#1f2937",
  },

  info: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 1.8,
    marginBottom: 24,
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  phone: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 28,
  },

  /* SOCIAL */
  social: {
    display: "flex",
    gap: 14,
    marginTop: 12,
  },

  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

const Contact = () => {
  return (
    <HomeLayout>
      <div style={styles.wrapper}>
        {/* LEFT – LOGO LỚN */}
        <div style={styles.left}>
          <img src={Logo} alt="Logo" style={styles.bigLogo} />
        </div>

        {/* RIGHT – CONTENT */}
        <div style={styles.right}>
          <img src={Logo} alt="Logo small" style={styles.smallLogo} />

          <h2 style={styles.title}>
            Hãy để chúng tôi giúp bạn có một kỳ nghỉ thật tuyệt vời và đáng nhớ!
          </h2>

          <div style={styles.info}>
            <div style={styles.infoItem}>
              <EnvironmentOutlined />
              <span>123 Phạm Viết Chánh, Bình Thạnh, TP.HCM</span>
            </div>

            <div style={styles.infoItem}>
              <MailOutlined />
              <span>quinhontraveling@gmail.com</span>
            </div>

            <div style={styles.infoItem}>
              <PhoneOutlined />
              <span>0912 345 678</span>
            </div>
          </div>

          {/* SOCIAL */}
          <div style={styles.social}>
            <div style={styles.socialIcon}>
              <FacebookFilled />
            </div>
            <div style={styles.socialIcon}>
              <InstagramOutlined />
            </div>
            <div style={styles.socialIcon}>
              <YoutubeFilled />
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Contact;
