import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

type RequestBody = {
  nickname: string;
};

export async function POST(request: Request) {
  try {
    const { nickname }: RequestBody = await request.json();
    
    if (!nickname?.trim()) {
      return NextResponse.json(
        { error: "Nickname is required" },
        { status: 400 }
      );
    }

    const roomId = uuidv4().split('-')[0].toUpperCase(); // Simple 8-char room code
    console.log(`Generated new room ID: ${roomId} for ${nickname}`);
    
    // In a real app, you would store this in a database
    return NextResponse.json({ roomId });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}