import React from "react";
import { Persona } from "../interfaces/persona";
import { motion } from "framer-motion";
import Image from "next/image";

interface MaleDuelProps {
  onVote: (candidate: string) => void;
  participants: Persona[];
}

const MaleDuel: React.FC<MaleDuelProps> = ({ onVote, participants }) => {
  return (
    <div className="w-full h-full sm:mt-0 mt-[300px]  flex flex-col items-center justify-center">
      <h1 className="text-4xl mt-[100px]  title text-center text-white">
        Duelo Masculino
      </h1>
      <h3 className="text-center text-white text-xl mt-2 mb-[50px] p-3 md:p-0">
        ¿Para vos quién de ellos es el Rey Tiki de Aloha Biolap Fest?
      </h3>
      <div className="flex justify-around w-full mb-6 flex-wrap max-w-screen-lg">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id + participant.nombre}
            className="flex flex-col items-center mb-4 cursor-pointer"
            initial={{ opacity: 0, scale: 0.5 }} // Estado inicial
            animate={{ opacity: 1, scale: 1 }} // Estado final
            transition={{
              duration: 0.5,
              delay: index * 0.2, // Animación escalonada
              ease: "easeOut",
            }}
          >
            <motion.div
              className="rounded-full border-4 border-blue-800 overflow-hidden"
              whileHover={{ scale: 1.1 }} // Escala al pasar el mouse
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={participant.img}
                alt={participant.nombre}
                width={200}
                height={200}
                className="rounded-full"
              />
            </motion.div>
            <button
              onClick={() => onVote(participant.nombre)}
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              {participant.nombre}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default MaleDuel;
