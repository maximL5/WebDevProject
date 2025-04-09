"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";
import { useParams } from "next/navigation";

type Player = {
  id: string;
  nickname: string;
  points: number;
};

export default function Results() {
  const params = useParams<{ id: string }>();
  const gameId = params.id;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const playerRef = ref(realtimeDb, `games/${gameId}/playerList`);
    
    onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerArray: Player[] = Object.entries(data).map(([id, player]: any) => ({
          id,
          nickname: player.nickname,
          points: player.points,
        }));

        playerArray.sort((a, b) => b.points - a.points);
        setPlayers(playerArray);
      }
    });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Results!
        </h1>
        <div className="space-y-4">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-md border border-gray-600 text-gray-200"
            >
              <span>#{index + 1}</span>
              <span>{player.nickname}</span>
              <span>{player.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
