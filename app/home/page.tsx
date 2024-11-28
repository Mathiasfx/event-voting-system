"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import Welcome from "../components/Welcome";
import FemaleDuel from "../components/FemaleDuel";
import MaleDuel from "../components/MaleDuel";
import Thanks from "../components/Thanks";
import "./home.scss";
import Image from "next/image";
import { Persona } from "../interfaces/persona";

export default function HomePage() {
  //#region States
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasVotedShe, setHasVotedShe] = useState<boolean>(false);
  const [hasVotedHe, setHasVotedHe] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [participants, setParticipants] = useState<{
    mujeres: Persona[];
    hombres: Persona[];
  }>({
    mujeres: [],
    hombres: [],
  });
  //#endregion

  //#region Obtener dirección IP del usuario
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error obteniendo la IP:", error);
      }
    };
    setParticipants({
      mujeres: [
        {
          id: 1,
          nombre: "Maria Angeles",
          img: "/assets/images/personam1.png",
        },
        {
          id: 2,
          nombre: "Carolina Sanchez",
          img: "/assets/images/personam2.png",
        },
        {
          id: 3,
          nombre: "Monica Aguilar",
          img: "/assets/images/personam3.png",
        },
      ],
      hombres: [
        {
          id: 1,
          nombre: "Damina Fernandez",
          img: "/assets/images/persona1.png",
        },
        {
          id: 2,
          nombre: "Franco Perez",
          img: "/assets/images/persona2.png",
        },
        {
          id: 3,
          nombre: "Elias Gomez",
          img: "/assets/images/persona3.png",
        },
      ],
    });

    fetchIP();
  }, []);
  //#endregion

  //#region Verificar Voto
  useEffect(() => {
    if (!ipAddress) return;

    const checkVotes = async () => {
      const votesRef = collection(db, "votes");
      const voteDoc = await getDoc(doc(votesRef, ipAddress));

      if (voteDoc.exists()) {
        const data = voteDoc.data();
        setHasVotedShe(data.votedShe || false);
        setHasVotedHe(data.votedHe || false);
        if (data.votedShe && data.votedHe) {
          setStep(4);
        } else if (data.votedShe) {
          setStep(2);
        }
      }
      setLoading(false);
    };

    checkVotes();
  }, [ipAddress]);
  //#endregion

  //#region Funcion Voto Femenino
  const handleFemaleVote = async (candidate: string) => {
    if (!ipAddress) return;

    const voteDocRef = doc(db, "votes", ipAddress); // Referencia a documento por IP

    // Guardamos el voto con el nombre del candidato seleccionado
    await setDoc(
      voteDocRef,
      { votedShe: true, femaleVote: candidate },
      { merge: true }
    );

    setStep(2); // Avanzamos al siguiente paso
    setHasVotedShe(true); // Marcamos que ya votó
  };
  //#endregion

  //#region Funcion Voto Masculino
  const handleMaleVote = async (candidate: string) => {
    if (!ipAddress) return;

    const voteDocRef = doc(db, "votes", ipAddress); // Referencia a documento por IP

    // Guardamos el voto con el nombre del candidato seleccionado
    await setDoc(
      voteDocRef,
      { votedHe: true, maleVote: candidate },
      { merge: true }
    );

    setStep(3); // Avanzamos al siguiente paso
    setHasVotedHe(true); // Marcamos que ya votó
  };
  //#endregion

  //#region Spinner
  if (loading)
    return (
      <div className="w-full h-screen sm:h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-700 animate-gradient-y contenido">
        <div className="w-12 h-12 border-4 border-t-4 border-transparent border-t-white border-l-green-200 rounded-full animate-spin"></div>
      </div>
    );
  //#endregion

  return (
    <div className="w-full h-full sm:h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-700 animate-gradient-y contenido">
      <div className="flex flex-col items-center justify-center w-full">
        <Image
          src="/assets/images/greenleaftlong.png"
          alt="background"
          width={320}
          height={320}
          className="leaft"
        />
        <h1 className="text-5xl mt-14 text-center text-white title logo">
          ALHOA <span className="biolap">BIOLAP</span>{" "}
          <span className="fest">FEST</span>
        </h1>
      </div>

      {hasVotedShe && hasVotedHe && step === 4 ? (
        <div className="h-full min-h-screen w-full flex justify-center items-center flex-col flex-1">
          <h1 className="text-4xl mb-6 text-center text-white title">
            ¡Ya tenemos registrado tu voto! Muchas gracias.
          </h1>
        </div>
      ) : (
        <>
          {step === 0 && <Welcome setStep={setStep} />}
          {step === 1 && (
            <FemaleDuel
              onVote={handleFemaleVote}
              participants={participants.mujeres}
            />
          )}
          {step === 2 && (
            <MaleDuel
              onVote={handleMaleVote}
              participants={participants.hombres}
            />
          )}
          {step === 3 && <Thanks />}
        </>
      )}
    </div>
  );
}
