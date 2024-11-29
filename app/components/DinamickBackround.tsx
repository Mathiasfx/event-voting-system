import { motion } from "framer-motion";

const DynamicBackground = () => {
  const gradientAnimation = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    },
  };

  return (
    <motion.div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(90deg, #ff7e5f, #feb47b, #86a8e7)",
        backgroundSize: "300% 300%",
      }}
      {...gradientAnimation}
    />
  );
};

export default DynamicBackground;
