/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion } from "framer-motion";
import "../home/home.scss";

import Image from "next/image";

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
              photoUrl: `/assets/images/${name}.png`,
            })
          );

          const femaleResults: VoteData[] = Object.keys(femaleVoters).map(
            (name) => ({
              name,
              votes: femaleVoters[name],
              photoUrl: `/assets/images/${name}.png`,
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

  if (loading) {
    return <div>Cargando resultados...</div>;
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
            height: "8px",
            borderRadius: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              borderRadius: "4px",
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
      <motion.div
        className="gradiente"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <div className="contenidos w-full inset-0 pt-2 sm:pt-0">
        <h2 className="text-center mb-4 text-3xl font-bold">
          Resultados de la Votación
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
          {femaleVotes.map((result) =>
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
          {maleVotes.map((result) => renderParticipant(result, maxMaleVote))}
        </motion.div>
        <h3 className="text-center text-2xl font-bold text-white">
          Total de votos: {totalVotes}
        </h3>
      </div>
    </div>
  );
};

export default Resultados;

// "use client";
// import React, { useEffect, useState } from "react";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../firebaseConfig";
// import { motion } from "framer-motion";
// import "../home/home.scss";

// import Image from "next/image";
// // Tipo de datos para los resultados de la votación
// type VoteData = {
//   name: string;
//   votes: number;
//   photoUrl: string; // Aquí guardamos la URL de la foto de cada participante
// };

// const Resultados = () => {
//   const [maleVotes, setMaleVotes] = useState<VoteData[]>([]);
//   const [femaleVotes, setFemaleVotes] = useState<VoteData[]>([]);
//   const [totalVotes, setTotalVotes] = useState<number>(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const votesRef = collection(db, "votes");

//         // Escuchamos cambios en tiempo real
//         const unsubscribe = onSnapshot(votesRef, (voteSnapshot) => {
//           const maleVoters: { [key: string]: number } = {};
//           const femaleVoters: { [key: string]: number } = {};

//           voteSnapshot.forEach((doc) => {
//             const data = doc.data();

//             // Votos para hombres
//             if (data.votedHe) {
//               const name = data.votedHeName;
//               maleVoters[name] = (maleVoters[name] || 0) + 1;
//             }

//             // Votos para mujeres
//             if (data.votedShe) {
//               const name = data.votedSheName;
//               femaleVoters[name] = (femaleVoters[name] || 0) + 1;
//             }
//           });

//           const maleResults: VoteData[] = Object.keys(maleVoters).map(
//             (name) => ({
//               name,
//               votes: maleVoters[name],
//               photoUrl: `/assets/images/${name}.png`, // Ajusta para cargar las fotos de los hombres
//             })
//           );

//           const femaleResults: VoteData[] = Object.keys(femaleVoters).map(
//             (name) => ({
//               name,
//               votes: femaleVoters[name],
//               photoUrl: `/assets/images/${name}.png`, // Ajusta para cargar las fotos de las mujeres
//             })
//           );

//           const totalVotesCount =
//             maleResults.reduce(
//               (acc, participant) => acc + participant.votes,
//               0
//             ) +
//             femaleResults.reduce(
//               (acc, participant) => acc + participant.votes,
//               0
//             );

//           setMaleVotes(maleResults);
//           setFemaleVotes(femaleResults);
//           setTotalVotes(totalVotesCount);
//           setLoading(false);
//         });

//         // Esto es para asegurarse de que se puede cancelar la suscripción cuando se desmonte el componente
//         return () => unsubscribe();
//       } catch (error) {
//         console.error("Error fetching results: ", error);
//       }
//     };

//     fetchResults();
//   }, []);

//   //#region Spinner
//   if (loading)
//     return (
//       <div className="w-full h-screen sm:h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-700 animate-gradient-y contenido">
//         <div className="w-12 h-12 border-4 border-t-4 border-transparent border-t-white border-l-green-200 rounded-full animate-spin"></div>
//       </div>
//     );
//   //#endregion

//   // Obtener los nombres con más votos de cada grupo
//   const getMaxVoteParticipant = (votes: VoteData[]) => {
//     return votes.reduce(
//       (max, participant) => (participant.votes > max.votes ? participant : max),
//       votes[0]
//     );
//   };

//   const maxMaleVote = getMaxVoteParticipant(maleVotes);
//   const maxFemaleVote = getMaxVoteParticipant(femaleVotes);

//   return (
//     <div className="w-full h-full   flex flex-col items-center justify-center fondo">
//       {/* Gradiente animado */}
//       <motion.div
//         className="gradiente"
//         animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
//         transition={{
//           duration: 10,
//           ease: "linear",
//           repeat: Infinity,
//         }}
//       />
//       {/* Contenido */}
//       <div className="flex flex-col items-center justify-center w-full absolute top-0">
//         <Image
//           src="/assets/images/greenleaftlong.png"
//           alt="background"
//           width={400}
//           height={100}
//           className="reltative top-0  pt-0 sm:pt-0"
//         />
//         <div className="absolute inset-0 flex flex-col items-center justify-center ">
//           <h1 className="text-5xl  text-center text-white title logo">
//             ALOHA <span className="biolap">BIOLAP</span>{" "}
//             <span className="fest">FEST</span>
//           </h1>
//         </div>
//       </div>
//       <div className="contenidos w-full inset-0   pt-2 sm:pt-0 ">
//         <h2 className="text-center mb-4 text-3xl font-bold">
//           Resultados de la Votación
//         </h2>
//         {/* Mujeres */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             flexWrap: "wrap",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "center",
//             }}
//           >
//             {femaleVotes.map((result, index) => (
//               <div
//                 key={index}
//                 style={{
//                   minWidth: "230px",
//                   margin: "10px",
//                   position: "relative",
//                   width: result.name === maxFemaleVote.name ? "150px" : "120px",
//                   display: "flex",
//                   flexDirection: "column", // Para colocar la imagen y el texto en columna
//                   alignItems: "center", // Centra la imagen y el texto
//                   justifyContent: "center", // Centra los elementos dentro del contenedor
//                   order: result.name === maxFemaleVote.name ? -1 : 0,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "120px",
//                     height: "120px",
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                     transform:
//                       result.name === maxFemaleVote.name
//                         ? "scale(1.3)"
//                         : "scale(1)", // Asegura que el de más votos esté más grande
//                     transition: "transform 0.3s ease-in-out",
//                   }}
//                 >
//                   <Image
//                     src={result.photoUrl}
//                     alt={result.name}
//                     width={120}
//                     height={120}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 </div>
//                 <div
//                   className="text-center font-bold text-xl"
//                   style={{
//                     color: "white",
//                     padding: "5px",
//                     textAlign: "center",
//                     fontSize: "16px",
//                     width: "100%",
//                     marginTop: "16px", // Espacio entre la imagen y el texto
//                   }}
//                 >
//                   {result.name}: {result.votes} votos
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Varones */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             flexWrap: "wrap",
//             marginTop: "50px",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "center",
//             }}
//           >
//             {maleVotes.map((result, index) => (
//               <div
//                 key={index}
//                 style={{
//                   minWidth: "230px",
//                   margin: "10px",
//                   position: "relative",
//                   width: result.name === maxMaleVote.name ? "150px" : "120px",
//                   display: "flex",
//                   flexDirection: "column", // Para colocar la imagen y el texto en columna
//                   alignItems: "center", // Centra la imagen y el texto
//                   justifyContent: "center", // Centra los elementos dentro del contenedor
//                   order: result.name === maxMaleVote.name ? -1 : 0,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "120px",
//                     height: "120px",
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                     transform:
//                       result.name === maxMaleVote.name
//                         ? "scale(1.3)"
//                         : "scale(1)", // Asegura que el de más votos esté más grande
//                     transition: "transform 0.3s ease-in-out",
//                   }}
//                 >
//                   <Image
//                     src={result.photoUrl}
//                     alt={result.name}
//                     width={120}
//                     height={120}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 </div>
//                 <div
//                   className="text-center font-bold text-xl"
//                   style={{
//                     color: "white",
//                     padding: "5px",
//                     textAlign: "center",
//                     fontSize: "16px",
//                     width: "100%",
//                     marginTop: "16px", // Espacio entre la imagen y el texto
//                   }}
//                 >
//                   {result.name}: {result.votes} votos
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//         <h3 className="text-center text-2xl font-bold text-white">
//           Total de votos: {totalVotes}
//         </h3>
//       </div>
//     </div>
//   );
// };

// export default Resultados;
