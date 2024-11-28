/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion } from "framer-motion";

import Image from "next/image";
// Tipo de datos para los resultados de la votación
type VoteData = {
  name: string;
  votes: number;
  photoUrl: string; // Aquí guardamos la URL de la foto de cada participante
};

const Resultados = () => {
  const [maleVotes, setMaleVotes] = useState<VoteData[]>([]);
  const [femaleVotes, setFemaleVotes] = useState<VoteData[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const votesRef = collection(db, "votes");

        // Escuchamos cambios en tiempo real
        const unsubscribe = onSnapshot(votesRef, (voteSnapshot) => {
          const maleVoters: { [key: string]: number } = {};
          const femaleVoters: { [key: string]: number } = {};

          voteSnapshot.forEach((doc) => {
            const data = doc.data();

            // Votos para hombres
            if (data.votedHe) {
              const name = data.votedHeName;
              maleVoters[name] = (maleVoters[name] || 0) + 1;
            }

            // Votos para mujeres
            if (data.votedShe) {
              const name = data.votedSheName;
              femaleVoters[name] = (femaleVoters[name] || 0) + 1;
            }
          });

          const maleResults: VoteData[] = Object.keys(maleVoters).map(
            (name) => ({
              name,
              votes: maleVoters[name],
              photoUrl: `/assets/images/${name}.png`, // Ajusta para cargar las fotos de los hombres
            })
          );

          const femaleResults: VoteData[] = Object.keys(femaleVoters).map(
            (name) => ({
              name,
              votes: femaleVoters[name],
              photoUrl: `/assets/images/${name}.png`, // Ajusta para cargar las fotos de las mujeres
            })
          );

          const totalVotesCount =
            maleResults.reduce(
              (acc, participant) => acc + participant.votes,
              0
            ) +
            femaleResults.reduce(
              (acc, participant) => acc + participant.votes,
              0
            );

          setMaleVotes(maleResults);
          setFemaleVotes(femaleResults);
          setTotalVotes(totalVotesCount);
          setLoading(false);
        });

        // Esto es para asegurarse de que se puede cancelar la suscripción cuando se desmonte el componente
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching results: ", error);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div>Cargando resultados...</div>;
  }

  // Obtener los nombres con más votos de cada grupo
  const getMaxVoteParticipant = (votes: VoteData[]) => {
    return votes.reduce(
      (max, participant) => (participant.votes > max.votes ? participant : max),
      votes[0]
    );
  };

  const maxMaleVote = getMaxVoteParticipant(maleVotes);
  const maxFemaleVote = getMaxVoteParticipant(femaleVotes);

  return (
    <div className="w-full h-full   flex flex-col items-center justify-center fondo">
      {/* Gradiente animado */}
      <motion.div
        className="gradiente"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      {/* Contenido */}
      <div className="contenidos">
        <h2 className="text-center mb-4 text-3xl font-bold">
          Resultados de la Votación
        </h2>

        {/* Mujeres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {femaleVotes.map((result, index) => (
              <div
                key={index}
                style={{
                  minWidth: "230px",
                  margin: "10px",
                  position: "relative",
                  width: result.name === maxFemaleVote.name ? "150px" : "120px",
                  display: "flex",
                  flexDirection: "column", // Para colocar la imagen y el texto en columna
                  alignItems: "center", // Centra la imagen y el texto
                  justifyContent: "center", // Centra los elementos dentro del contenedor
                  order: result.name === maxFemaleVote.name ? -1 : 0,
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transform:
                      result.name === maxFemaleVote.name
                        ? "scale(1.3)"
                        : "scale(1)", // Asegura que el de más votos esté más grande
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Image
                    src={result.photoUrl}
                    alt={result.name}
                    width={120}
                    height={120}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div
                  className="text-center font-bold text-xl"
                  style={{
                    color: "white",
                    padding: "5px",
                    textAlign: "center",
                    fontSize: "16px",
                    width: "100%",
                    marginTop: "16px", // Espacio entre la imagen y el texto
                  }}
                >
                  {result.name}: {result.votes} votos
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Varones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "50px",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {maleVotes.map((result, index) => (
              <div
                key={index}
                style={{
                  minWidth: "230px",
                  margin: "10px",
                  position: "relative",
                  width: result.name === maxMaleVote.name ? "150px" : "120px",
                  display: "flex",
                  flexDirection: "column", // Para colocar la imagen y el texto en columna
                  alignItems: "center", // Centra la imagen y el texto
                  justifyContent: "center", // Centra los elementos dentro del contenedor
                  order: result.name === maxMaleVote.name ? -1 : 0,
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transform:
                      result.name === maxMaleVote.name
                        ? "scale(1.3)"
                        : "scale(1)", // Asegura que el de más votos esté más grande
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Image
                    src={result.photoUrl}
                    alt={result.name}
                    width={120}
                    height={120}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div
                  className="text-center font-bold text-xl"
                  style={{
                    color: "white",
                    padding: "5px",
                    textAlign: "center",
                    fontSize: "16px",
                    width: "100%",
                    marginTop: "16px", // Espacio entre la imagen y el texto
                  }}
                >
                  {result.name}: {result.votes} votos
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <h3 className="text-center text-white">Total de votos: {totalVotes}</h3>
      </div>
    </div>
  );
};

export default Resultados;
