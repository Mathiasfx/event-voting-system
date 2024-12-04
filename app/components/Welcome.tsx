import React from "react";
import { motion } from "framer-motion";

interface WelcomeProps {
  setStep: (step: number) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ setStep }) => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <motion.h1
        className="md:text-4xl text-2xl font-semibold text-white text-center mb-10"
        initial="hidden"
        animate="visible"
        variants={textVariants}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        ¡Biolap te invita a elegir a los Reyes de la Aloha Biolap Fest!
      </motion.h1>
      <motion.button
        onClick={() => setStep(1)}
        className="bg-gray-700 hover:bg-blue-700 text-white text-xl font-semibold uppercase py-2 px-4 rounded-lg"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        Comenzar
      </motion.button>
    </div>
  );
};

export default Welcome;
