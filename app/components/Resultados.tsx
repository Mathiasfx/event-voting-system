/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion } from "framer-motion";
import "../home/home.scss";
import Confetti from "react-confetti";
import Image from "next/image";
import { removeAccents } from "../utils/Remove";

type VoteData = {
  name: string;
  votes: number;
  photoUrl: string;
};

const Resultados = () => {
  const [maleVotes, setMaleVotes] = useState<VoteData[]>([]);
  const [femaleVotes, setFemaleVotes] = useState<VoteData[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showWinners, setShowWinners] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const votesRef = collection(db, "votes");

        const unsubscribe = onSnapshot(votesRef, (voteSnapshot) => {
          const maleVoters: { [key: string]: number } = {};
          const femaleVoters: { [key: string]: number } = {};

          voteSnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.votedHe) {
              const name = data.votedHeName;
              maleVoters[name] = (maleVoters[name] || 0) + 1;
            }

            if (data.votedShe) {
              const name = data.votedSheName;
              femaleVoters[name] = (femaleVoters[name] || 0) + 1;
            }
          });

          const maleResults: VoteData[] = Object.keys(maleVoters).map(
            (name) => ({
              name,
              votes: maleVoters[name],
              photoUrl: `/assets/images/${removeAccents(name)}.png`,
            })
          );

          const femaleResults: VoteData[] = Object.keys(femaleVoters).map(
            (name) => ({
              name,
              votes: femaleVoters[name],
              photoUrl: `/assets/images/${removeAccents(name)}.png`,
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

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching results: ", error);
      }
    };

    fetchResults();
  }, []);

  // Efecto para el temporizador
  useEffect(() => {
    if (femaleVotes.length > 0 && maleVotes.length > 0) {
      const timer = setTimeout(() => {
        setShowWinners(true);
      }, 8000);

      return () => clearTimeout(timer); // Limpia el temporizador
    }
  }, [femaleVotes, maleVotes]); // Se ejecuta cuando los votos cambian

  // Obtener los nombres con más votos de cada grupo
  const getMaxVoteParticipant = (votes: VoteData[]) => {
    return votes.reduce(
      (max, participant) => (participant.votes > max.votes ? participant : max),
      votes[0]
    );
  };

  const rey = getMaxVoteParticipant(maleVotes);
  const reina = getMaxVoteParticipant(femaleVotes);

  // Filtrar las listas según si se deben mostrar solo ganadores
  const filteredMaleVotes = showWinners
    ? maleVotes.filter((vote) => vote.name === rey.name)
    : maleVotes;

  const filteredFemaleVotes = showWinners
    ? femaleVotes.filter((vote) => vote.name === reina.name)
    : femaleVotes;

  if (loading) {
    return (
      <div className="w-full h-screen sm:h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-700 animate-gradient-y contenido">
        <div className="w-12 h-12 border-4 border-t-4 border-transparent border-t-white border-l-green-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderParticipant = (result: VoteData, maxVotes: number) => {
    const percentage = totalVotes
      ? Math.round((result.votes / totalVotes) * 100)
      : 0;

    return (
      <div
        key={result.name}
        style={{
          minWidth: "230px",
          margin: "10px",
          position: "relative",
          width: result.votes === maxVotes ? "150px" : "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          order: result.votes === maxVotes ? -1 : 0,
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transform: result.votes === maxVotes ? "scale(1.3)" : "scale(1)",
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
        <motion.div
          style={{
            width: "100%",
            height: "20px",
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
            marginTop: "22px",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              borderRadius: "16px",
              backgroundColor: "limegreen",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        <div
          className="text-center font-bold"
          style={{
            color: "white",
            marginTop: "8px",
            fontSize: "14px",
          }}
        >
          {result.name} ({percentage}%)
        </div>
      </div>
    );
  };

  const maxMaleVote = Math.max(...maleVotes.map((v) => v.votes));
  const maxFemaleVote = Math.max(...femaleVotes.map((v) => v.votes));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center fondo">
      {showWinners && <Confetti />}
      <motion.div
        className="gradiente"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="contenidos w-full inset-0 pt-2 sm:pt-0">
          <h2 className="text-center mb-4 text-3xl font-bold">
            {showWinners ? "Ganadores" : "Resultados de la Votación"}
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {filteredFemaleVotes.map((result) =>
              renderParticipant(result, maxFemaleVote)
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            {filteredMaleVotes.map((result) =>
              renderParticipant(result, maxMaleVote)
            )}
          </motion.div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default Resultados;
