"use client";


import { useState, useEffect } from 'react';
import promptList from '../prompts.json';
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ref, set, onValue, update, get } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";

import Typebox  from "../components/typebox";


export default function Host() {

  const playerId = typeof window !== 'undefined' ? localStorage.getItem("me") : null;
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  const [playerResponses, setPlayerResponses] = useState([])



  const RetrieveResponses = async () => {
    console.log(playerId)
    if (!gameId || !playerId) return;
  
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
  
      const targetPlayerRef = ref(realtimeDb, `games/${gameId}/playerList/${index}`);

      let dummyArray = []

      for (let i = 1; i<4; i++) {
        if (i == index) {
          //do nothing
        } else {
          const targetPlayerRef = ref(realtimeDb, `games/${gameId}/playerList/${i}`);
          dummyArray.push(targetPlayerRef)
        }
      }
      
      let secondArray = []

      let firstRes = await get(dummyArray[0], {response})


    }, {
      onlyOnce: true  
    });
  };


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
            <Typebox textToBeTyped={playerResponses[0]}></Typebox>
          </div>        
          
        </div>
      </div>
    </main>

  )
}