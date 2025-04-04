"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RoomCreationResponse = {
  roomId: string;
  error?: string;
};

export default function Home() {
  const [nickname, setNickname] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const router = useRouter();

  const createGame = async (): Promise<void> => {
    try {
      const res = await fetch("/api/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      
      if (!res.ok) throw new Error("Failed to create room");
      const data: RoomCreationResponse = await res.json();
      router.push(`/lobby/${data.roomId}?host=true&nickname=${encodeURIComponent(nickname)}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create game room");
    }
  };

  const joinGame = (): void => {
    if (!nickname.trim()) return alert("Please enter a nickname");
    if (!roomCode.trim()) return alert("Please enter a room code");
    router.push(`/lobby/${roomCode.trim().toUpperCase()}?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-8 text-amber-400">
          The Quick Brown Fox
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Your Nickname
            </label>
            <input
              type="text"
              placeholder="Enter nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
          
          <button 
            onClick={createGame}
            className="w-full py-2 px-4 font-medium rounded-md transition-colors bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Create Game
          </button>
          
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Room Code
            </label>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-700 text-gray-200 border border-gray-600 uppercase"
            />
          </div>
          
          <button 
            onClick={joinGame}
            className="w-full py-2 px-4 font-medium rounded-md transition-colors bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Join Game
          </button>
        </div>
      </div>
    </main>
  );
}