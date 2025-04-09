"use client";

import { useState } from 'react';
import promptList from '../../prompts.json';
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ref, set, onValue, update } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";

function getRandomItem(arr:string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
} 

export default function Host() {
  const [answer, setAnswer] = useState('');
  const [myPrompt] = useState(getRandomItem(promptList));
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;

  const playerId = typeof window !== 'undefined' ? localStorage.getItem("me") : null;

  const SubmitAnswer = async () => {
    if (!answer || !gameId || !playerId) return;
  
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
  
      await update(targetPlayerRef, {
        promptReceived: myPrompt,
        response: answer,
        points: answer.length,
      });
  
      router.push(`/waiting-room/${gameId}`);
    }, {
      onlyOnce: true  
    });
  };

  return(
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Answer to the best of your ability! Or not!
        </h1>
        <h1 className="text-xl font-bold text-left mb-5 text-white-400">
          Your prompt is: {myPrompt}
        </h1>
        
        
        <div className="space-y-6">
          <div>
            <input
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              type="text"
              placeholder="Enter your best answer here..."
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
          
          <button 
            className="w-full py-2 px-4 font-medium rounded-md transition-colors bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={SubmitAnswer}
          >
            Submit
          </button>
          
          
        </div>
      </div>
    </main>

  )
}