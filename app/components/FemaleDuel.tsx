import Image from "next/image";
import { motion } from "framer-motion";
import { Persona } from "../interfaces/persona";

interface FemaleDuelProps {
  onVote: (category: "mujeres" | "hombres", candidate: string) => void;
  participants: Persona[];
}

const FemaleDuel: React.FC<FemaleDuelProps> = ({ onVote, participants }) => {
  return (
    <div className="w-full h-full sm:mt-0 mt-[300px]  flex flex-col items-center justify-center">
      <h1 className="text-4xl mt-[100px]  title text-center text-white">
        Duelo Femenino
      </h1>
      <h3 className="text-center text-white text-xl mt-2 mb-[50px] p-3 md:p-0">
        ¿Para vos quién de ellas es la Reina Tiki de Aloha Biolap Fest?
      </h3>
      <div className="flex  justify-around w-full mb-6 flex-wrap max-w-screen-lg">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id + participant.nombre}
            className="flex flex-col items-center mb-4 "
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="rounded-full border-4 border-pink-500 overflow-hidden"
              whileHover={{ scale: 1.1 }}
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
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => onVote("mujeres", participant.nombre)}
            >
              {participant.nombre}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FemaleDuel;
