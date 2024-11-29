"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import Welcome from "../components/Welcome";
import FemaleDuel from "../components/FemaleDuel";
import MaleDuel from "../components/MaleDuel";
import Thanks from "../components/Thanks";
import "./home.scss";
import Image from "next/image";
import { Persona } from "../interfaces/persona";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  //#region States
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasVotedShe, setHasVotedShe] = useState<boolean>(false);
  const [hasVotedHe, setHasVotedHe] = useState<boolean>(false);

  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);
  const [participants, setParticipants] = useState<{
    mujeres: Persona[];
    hombres: Persona[];
  }>({
    mujeres: [],
    hombres: [],
  });
  //#endregion

  //#region Obtener UUID del dispositivo
  useEffect(() => {
    // Obtener o generar el UUID local del dispositivo
    const fetchUUID = () => {
      let uuid = localStorage.getItem("device_uuid");
      if (!uuid) {
        uuid = uuidv4();
        localStorage.setItem("device_uuid", uuid);
      }
      setDeviceUUID(uuid);
    };

    fetchUUID();

    // Configurar participantes
    setParticipants({
      mujeres: [
        {
          id: 1,
          nombre: "Gabriela Medina",
          img: "/assets/images/Gabriela Medina.png",
        },
        {
          id: 2,
          nombre: "Micaela Yammetti",
          img: "/assets/images/Micaela Yammetti.png",
        },
        {
          id: 3,
          nombre: "Mónica Cobran",
          img: "/assets/images/Monica Cobran.png",
        },
      ],
      hombres: [
        {
          id: 1,
          nombre: "Aldo Angeletti",
          img: "/assets/images/Aldo Angeletti.png",
        },
        {
          id: 2,
          nombre: "Ignacio Moretti",
          img: "/assets/images/Ignacio Moretti.png",
        },
        {
          id: 3,
          nombre: "Santiago Lloveras",
          img: "/assets/images/Santiago Lloveras.png",
        },
      ],
    });
  }, []);

  //#endregion

  //#region Verificar Voto y Versión de Votación
  useEffect(() => {
    if (!deviceUUID) return;

    // Crear la referencia de Firestore
    const settingsRef = doc(db, "settings", "vote");

    // Función para verificar los votos
    const checkVotes = async () => {
      try {
        // Obtener la versión actual de la votación
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
          const serverVoteVersion = settingsDoc.data().voteVersion;
          const localVoteVersion = localStorage.getItem("vote_version");

          // Convertir ambos a números para comparar correctamente
          if (Number(serverVoteVersion) !== Number(localVoteVersion)) {
            localStorage.setItem("vote_version", serverVoteVersion);
            setHasVotedShe(false);
            setHasVotedHe(false);
            setStep(0); // Reinicia el flujo de votación
            return; // Detiene el flujo de ejecución si las versiones no coinciden
          }
        }

        // Verificar si el dispositivo ya votó
        const votesRef = collection(db, "votes");
        const voteDoc = await getDoc(doc(votesRef, deviceUUID));

        if (voteDoc.exists()) {
          const data = voteDoc.data();
          setHasVotedShe(data.votedShe || false);
          setHasVotedHe(data.votedHe || false);
          if (data.votedShe && data.votedHe) {
            setStep(4); // Ambos votos registrados
          } else if (data.votedShe) {
            setStep(2); // Solo votó en mujeres
          }
        }
      } catch (error) {
        console.error("Error verificando votos:", error);
      } finally {
        setLoading(false);
      }
    };

    // Llamada inicial para verificar los votos
    checkVotes();

    // Crear el listener para las actualizaciones en tiempo real de la versión de votación
    const unsubscribe = onSnapshot(settingsRef, (settingsDoc) => {
      if (settingsDoc.exists()) {
        const serverVoteVersion = settingsDoc.data().voteVersion;
        const localVoteVersion = localStorage.getItem("vote_version");

        // Convertir ambos a números para comparar correctamente
        if (Number(serverVoteVersion) !== Number(localVoteVersion)) {
          localStorage.setItem("vote_version", serverVoteVersion);
          setHasVotedShe(false);
          setHasVotedHe(false);
          setStep(0); // Reinicia el flujo de votación
        }
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, [deviceUUID]);

  //#endregion

  // Función para reiniciar la votación
  const resetVotes = async () => {
    try {
      // Borra todos los votos de la colección 'votes'
      const votesRef = collection(db, "votes");
      const querySnapshot = await getDocs(votesRef);

      // Elimina cada documento (voto) en la colección
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(votesRef, docSnap.id));
      });

      // Aquí configuramos una nueva "versión" del sistema de votación en la colección 'settings'
      const settingsRef = doc(db, "settings", "vote"); // Documento 'vote' para la versión

      const newVersion = {
        voteVersion: new Date().getTime(), // Usamos el timestamp como nueva versión
        lastReset: new Date(), // Fecha de último reinicio
      };

      await setDoc(settingsRef, newVersion, { merge: true }); // Guardamos la nueva configuración

      console.log("La configuración de la votación ha sido actualizada.");
    } catch (error) {
      console.error(
        "Error al resetear los votos y configurar la nueva versión:",
        error
      );
    }
  };

  //#region Función para votar
  const handleVote = async (category: "mujeres" | "hombres", name: string) => {
    try {
      // Asegúrate de que `deviceUUID` no sea null
      if (!deviceUUID) {
        console.error("Error: deviceUUID no está definido");
        return;
      }

      const votesRef = collection(db, "votes");
      const voteDocRef = doc(votesRef, deviceUUID);

      // Verifica si el voto es para mujeres
      if (category === "mujeres") {
        // Solo guarda el campo `votedSheName` si el voto es para una mujer
        await setDoc(
          voteDocRef,
          {
            votedShe: true,
            votedHe: hasVotedHe ? hasVotedHe : false, // No modificar `votedHe` si no se votó un hombre
            votedSheName: name, // El nombre de la mujer que fue votada
          },
          { merge: true }
        );
        setHasVotedShe(true);
        setStep(2); // Avanza al siguiente paso
      } else {
        // Solo guarda el campo `votedHeName` si el voto es para un hombre
        await setDoc(
          voteDocRef,
          {
            votedHe: true,
            votedShe: hasVotedShe ? hasVotedShe : false, // No modificar `votedShe` si no se votó una mujer
            votedHeName: name, // El nombre del hombre que fue votado
          },
          { merge: true }
        );
        setHasVotedHe(true);
        setStep(3); // Finaliza la votación
      }
    } catch (error) {
      console.error("Error al registrar el voto:", error);
    }
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
    <>
      <div className="corner-images">
        <Image
          src="/assets/images/greenleaftshort.png"
          alt="Imagen"
          width={200}
          height={200}
          className="top-left palma"
        />
        <Image
          src="/assets/images/greenleaftshort.png"
          alt="Imagen"
          width={150}
          height={150}
          className="top-right palma"
        />
      </div>
      {/* Separacion */}
      <div className="w-full h-full sm:h-[100vh] flex flex-col items-center justify-center   ">
        <div className="flex flex-col items-center justify-center w-full relative">
          <Image
            src="/assets/images/greenleaftlong.png"
            alt="background"
            width={400}
            height={100}
            className="leaft pt-10 sm:pt-0"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h1 className="text-5xl mt-14 text-center text-white title logo">
              ALOHA <span className="biolap">BIOLAP</span>{" "}
              <span className="fest">FEST</span>
            </h1>
          </div>
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
                onVote={handleVote}
                participants={participants.mujeres}
              />
            )}
            {step === 2 && (
              <MaleDuel
                onVote={handleVote}
                participants={participants.hombres}
              />
            )}
            {step === 3 && <Thanks />}
          </>
        )}
        {/* <button
          onClick={resetVotes}
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Reiniciar Votación
        </button> */}
      </div>
    </>
  );
}
