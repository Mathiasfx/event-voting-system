import React from "react";
import { motion } from "framer-motion";

const Thanks = () => {
  return (
    <div className="h-full min-h-screen w-full flex justify-center items-center flex-col flex-1">
      <motion.h3
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{
          duration: 1,
          ease: [0.6, -0.05, 0.01, 0.99],
          bounce: 0.3,
        }}
        className="min-h-screen mt-[400px] sm:mt-0 sm:min-h-fit   text-4xl mb-6 text-center text-white title textobalance"
      >
        Gracias por votar, en breve tendremos a los Reyes elegidos!
      </motion.h3>
    </div>
  );
};

export default Thanks;
