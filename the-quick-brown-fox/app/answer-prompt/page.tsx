"use client";

import { useState } from 'react';
import promptList from '../prompts.json';
import { useParams, useRouter } from "next/navigation";
import { ref, set, onValue, update } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";

function getRandomItem(arr:string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
} 

//page for prompt giver
export default function Host() {

  const [answer, setAnswer] = useState('');

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const gameId = params.id;

  const playerId = typeof window !== 'undefined' ? localStorage.getItem("me") : null;


  const SubmitAnswer = async () => {
    if (!answer || !gameId || !playerId) return;

    const playerRef = ref(realtimeDb, `games/${gameId}/players/${playerId}`);

    await update(playerRef, {
      response: answer,
    });

    console.log('Answer submitted');
    router.push(`/waiting-room?id=${gameId}`)
    };

  return(
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Answer to the best of your ability! Or not!
        </h1>
        <h1 className="text-xl font-bold text-left mb-5 text-white-400">
          Your prompt is: {getRandomItem(promptList)}
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