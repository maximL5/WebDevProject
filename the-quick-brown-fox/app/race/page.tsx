"use client";


import { useState, useEffect } from 'react';
import promptList from '../prompts.json';
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ref, set, onValue, update } from "firebase/database";
import { realtimeDb } from "@/app/lib/firebase";

import Typebox  from "../components/typebox";


export default function Host() {

  const playerId = typeof window !== 'undefined' ? localStorage.getItem("me") : null;


  

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
            <Typebox textToBeTyped="Hello my baby Hello my darlin Hello my ragtime gal"></Typebox>
          </div>        
          
        </div>
      </div>
    </main>

  )
}