"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const isHost = searchParams.get('host') === 'true';

  useEffect(() => {
    // Simulate different player perspectives
    const nickname = searchParams.get('nickname') || 'Anonymous';
    const playerId = Math.random().toString(36).substring(2, 9);
    
    const newPlayer: Player = {
      id: playerId,
      nickname,
      isHost
    };

    setCurrentPlayer(newPlayer);

    // Simulate other players joining
    const simulatedPlayers: Player[] = [newPlayer];
    
    if (isHost) {
      // Add two simulated players for host view
      simulatedPlayers.push(
        { id: 'p2', nickname: 'PlayerTwo', isHost: false },
        { id: 'p3', nickname: 'PlayerThree', isHost: false }
      );
    } else {
      // Add host and another player for regular player view
      simulatedPlayers.unshift(
        { id: 'host', nickname: 'GameHost', isHost: true }
      );
      if (players.length < 3) {
        simulatedPlayers.push(
          { id: 'p2', nickname: 'OtherPlayer', isHost: false }
        );
      }
    }

    setPlayers(simulatedPlayers);
  }, [params.id]);

  const startGame = (): void => {
    console.log(`Host ${currentPlayer?.nickname} started the game`);
    // Game starting logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-400">
            Room: {params.id}
          </h2>
          <span className="text-sm text-gray-400">
            {isHost ? '👑 Host' : 'Player'}
          </span>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-300">
            Players ({players.length}/3):
          </h3>
          <ul className="space-y-2">
            {players.map(player => (
              <li 
                key={player.id} 
                className={`px-4 py-2 rounded flex items-center ${
                  player.id === currentPlayer?.id 
                    ? 'bg-amber-400/20 border border-amber-400/30' 
                    : 'bg-gray-700'
                }`}
              >
                <span className="text-gray-200">
                  {player.nickname}
                  {player.isHost && ' 👑'}
                </span>
                {player.id === currentPlayer?.id && (
                  <span className="ml-auto text-xs text-gray-400">(You)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {isHost && (
          <button
            onClick={startGame}
            disabled={players.length < 2}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              players.length < 2
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-amber-400 text-gray-900 hover:bg-amber-500"
            }`}
          >
            {players.length < 2 
              ? `Waiting for ${3 - players.length} more player(s)...` 
              : "Start Game"}
          </button>
        )}
        
        {!isHost && (
          <p className="text-center text-gray-300">
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </div>
  );
}