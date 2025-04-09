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

  const moveToResults = (score: number) => {
    if (!gameId || !playerId) return;
    console.log("Points should be being pushed to the DB!")
    const playerListRef = ref(realtimeDb, `games/${gameId}/playerList`);
  
    onValue(playerListRef, async (snapshot) => {
      const data = snapshot.val();
  
      if (!data || !Array.isArray(data)) {
        console.error("Player list not found or invalid");
        return;
      }
  
      const index = data.findIndex((player: any) => player.id === playerId);
  
      if (index === -1) {
        console.error("Player ID not found in player list");
        return;
      }

      const currentPoints = data[index].points || 0;
      const newPoints = currentPoints + score;
  
      const targetPlayerRef = ref(realtimeDb, `games/${gameId}/playerList/${index}`);
  
      await update(targetPlayerRef, {
        points: newPoints,
      });
  
      router.push(`/waiting-room/${gameId}`);
    }, {
      onlyOnce: true  
    });

    router.push(`/results/${gameId}`)
  }

  const playerId = typeof window !== 'undefined' ? localStorage.getItem("me") : null;
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  const [playerResponses, setPlayerResponses] = useState([''])
  const [playerPrompts, setPlayerPrompts] = useState<string[]>([])



  const RetrieveResponses = async () => {
    console.log(playerId);
    if (!gameId || !playerId) return;

    const playerListRef = ref(realtimeDb, `games/${gameId}/playerList`);

    onValue(playerListRef, async (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        console.error("Player list not found or invalid");
        return;
      }

      let responses: string[] = [];
      let prompts: string[] = [];
      Object.entries(data).forEach(async ([key, player]) => {
        const typedPlayer = player as Player; 

        if (typedPlayer.id !== playerId) { 
          const targetPlayerRef = ref(realtimeDb, `games/${gameId}/playerList/${key}`);
          const playerSnapshot = await get(targetPlayerRef);

          if (playerSnapshot.exists()) {
            const playerData = playerSnapshot.val();
            if (playerData && playerData.response) {
              responses.push(playerData.response); 
            }
            if (playerData && playerData.promptReceived) {
              prompts.push(playerData.promptReceived)
            }
          }
        }
      });
      setPlayerPrompts(prompts);
      setPlayerResponses(responses);
    });
  };

  useEffect(() => {
    RetrieveResponses();
  }, [gameId, playerId]);


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
            <Typebox pushToNextPage={moveToResults} playerPrompt={playerPrompts[0]} textToBeTyped={playerResponses[0]}></Typebox>
          </div>        
          
        </div>
      </div>
    </main>

  )
}