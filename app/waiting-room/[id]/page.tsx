"use client"

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ref, set, onValue, update } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";
import { Ceviche_One } from 'next/font/google';



export default function Host() {
    const [allResponded, setAllResponded] = useState(false);
    const [players, setPlayers] = useState<any[]>([]); 
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const gameId = params.id;

    useEffect(() => {
        const playersRef = ref(realtimeDb, `games/${gameId}/playerList`);

        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                if (data[0].response != "" && data[1].response != "" && data[2].response != "") {
                    console.log(data[1].response, data[2].response, data[0].response)
                    setAllResponded(true);
                }
            }
        });

        return () => unsubscribe();
    }, [gameId]);

    useEffect(() => {
        if (allResponded) {
            router.push(`/race/${gameId}`);
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