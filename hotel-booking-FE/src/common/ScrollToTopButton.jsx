import { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50
                   bg-primary text-black
                   p-3 rounded-full shadow-lg
                   hover:scale-110 transition-all"
        aria-label="Scroll to top"
      >
        <ArrowUpOutlined />
      </button>
    )
  );
};

export default ScrollToTopButton;
