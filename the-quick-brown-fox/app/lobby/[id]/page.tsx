"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, set, onValue, update } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";

type Player = {
  id: string;
  nickname: string;
  isHost: boolean;
};

export default function Lobby() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const isHost = searchParams.get("host") === "true";
  const router = useRouter();
  const gameId = params.id;

  useEffect(() => {
    // Simulate different player perspectives
    const nickname = searchParams.get("nickname") || "Anonymous";
    const playerId = Math.random().toString(36).substring(2, 9);
    const newPlayer: Player = {
      id: playerId,
      nickname,
      isHost
    };

    setCurrentPlayer(newPlayer);

    const playerRef = ref(realtimeDb, `games/${gameId}/players/${playerId}`);
    set(playerRef, { name: nickname, role: isHost ? "host" : "player", response: "" });

    // Listen for player updates
    const playersRef = ref(realtimeDb, `games/${gameId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerList: Player[] = Object.entries(data).map(([id, value]) => {
          const playerData = value as { name: string; role: string };
          return {
            id,
            nickname: playerData.name,
            isHost: playerData.role === "host",
          };
        });
        setPlayers(playerList);
      }
    });

    const handleUnload = () => {
      set(ref(realtimeDb, `games/${gameId}/players/${playerId}`), null);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
      unsubscribe();
    };
  }, [gameId, isHost, searchParams]);

  useEffect(() => {
    // Listen to game status changes
    const gameRef = ref(realtimeDb, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      if (data.status === "waiting_for_prompt" && !isHost && currentPlayer) {
        router.push(`/player?id=${gameId}`);
      }
    });

    return () => unsubscribe();
  }, [gameId, isHost, currentPlayer]);

  const startGame = async (): Promise<void> => {
    if (!isHost || !currentPlayer) {
      console.log("Only host can start the game");
      return;
    }

    try {
      await update(ref(realtimeDb, `games/${gameId}`), {
        host: currentPlayer.nickname,
        prompt: "",
        responses: {},
        winner: null,
        status: "waiting_for_prompt",
      });

      router.push(`/host?id=${gameId}`);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-8 text-amber-400">
            The Quick Brown Fox
        </h1>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-400">Room: {gameId}</h2>
          <span className="text-sm text-gray-400">{isHost ? "👑 Host" : "Player"}</span>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-300">Players ({players.length}/3):</h3>
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.id}
                className={`px-4 py-2 rounded flex items-center ${
                  player.id === currentPlayer?.id ? "bg-amber-400/20 border border-amber-400/30" : "bg-gray-700"
                }`}
              >
                <span className="text-gray-200">
                  {player.nickname}
                  {player.isHost && " 👑"}
                </span>
                {player.id === currentPlayer?.id && <span className="ml-auto text-xs text-gray-400">(You)</span>}
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <button
            onClick={startGame}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              players.length < 2 ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-amber-400 text-gray-900 hover:bg-amber-500"
            }`}
            disabled={players.length < 2}
          >
            {players.length < 2 ? `Waiting for ${3 - players.length} more player(s)...` : "Start Game"}
          </button>
        )}

        {!isHost && <p className="text-center text-gray-300">Waiting for host to start the game...</p>}
      </div>
    </div>
  );
}
