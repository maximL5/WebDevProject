"use client"

import { useState, useEffect } from 'react';
import promptList from '../prompts.json';
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ref, set, onValue, update } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";



export default function Host() {
    const [allResponded, setAllResponded] = useState(false);
    const [players, setPlayers] = useState<any[]>([]); 
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const gameId = params.id;

    console.log({players,allResponded})

    const checkAllResponses = (players: any[]) => {
        return players.every(player => player.response !== "");
    };

    useEffect(() => {
        const playersRef = ref(realtimeDb, `games/${gameId}/playerList`);

        console.log("Players Ref:", playersRef);

        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Data:", data);
            if (data) {
            
                const playerList = Object.entries(data).map(([id, player]) => {
                    
                    if (player && typeof player === 'object') {
                        return { id, ...player }; 
                    }
                    return { id }; 
                });

                setPlayers(playerList);

                const responsesFilled = checkAllResponses(playerList);

                console.log("responsesFilled:", responsesFilled);
                if (responsesFilled) {
                    setAllResponded(true);
                }
            }
        });

        return () => unsubscribe();
    }, [gameId]);

    useEffect(() => {
        if (allResponded) {
            router.push(`/race?id=${gameId}`);
        }
    }, [allResponded, gameId, router]);
 


    return(
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Waiting for other players...
        </h1>
        <h1 className="text-xl font-bold text-left mb-5 text-white-400">
          Sit back, relax, and enjoy this screen...
        </h1>
      </div>
    </main>

    )
}