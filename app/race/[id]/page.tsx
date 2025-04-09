"use client";


import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ref, set, onValue, update, get } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";

import Typebox  from "../../components/typebox";

interface Player {
  id: string;
  response: string; 
}

export default function Host() {

  const router = useRouter();

  const moveToResults = (time: number) => {
    router.push(`/results?time=${time}`)
  }

  // const playerId = typeof window !== 'undefined' ? localStorage.getItem("me") : null;
  // const searchParams = useSearchParams();
  // const gameId = searchParams.get("id");

  // const [playerResponses, setPlayerResponses] = useState([''])



  // const RetrieveResponses = async () => {
  //   console.log(playerId);
  //   if (!gameId || !playerId) return;

  //   const playerListRef = ref(realtimeDb, `games/${gameId}/playerList`);

  //   onValue(playerListRef, async (snapshot) => {
  //     const data = snapshot.val();

  //     if (!data) {
  //       console.error("Player list not found or invalid");
  //       return;
  //     }

  //     let responses: string[] = [];
  //     Object.entries(data).forEach(async ([key, player]) => {
  //       const typedPlayer = player as Player; 

  //       if (typedPlayer.id !== playerId) { 
  //         const targetPlayerRef = ref(realtimeDb, `games/${gameId}/playerList/${key}`);
  //         const playerSnapshot = await get(targetPlayerRef);

  //         if (playerSnapshot.exists()) {
  //           const playerData = playerSnapshot.val();
  //           if (playerData && playerData.response) {
  //             responses.push(playerData.response); 
  //           }
  //         }
  //       }
  //     });

  //     setPlayerResponses(responses);
  //   });
  // };

  // useEffect(() => {
  //   RetrieveResponses();
  // }, [gameId, playerId]);


  return(
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Quick! Type this out as fast as you can! 
        </h1>

        <div className="text-white text-right text-lg mb-4">
        </div>
        
        <div className="space-y-6">
          <div>
            <Typebox pushToNextPage={moveToResults} textToBeTyped="if I were a potato in a kitchen I would probably try and turn myself into a hashbrown by jumping through a cheese grater. It's more fun than dealing with firebase anyway"></Typebox>
          </div>        
          
        </div>
      </div>
    </main>

  )
}