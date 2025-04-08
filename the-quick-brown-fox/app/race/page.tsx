"use client";

import { useEffect, useState } from "react";

//page for player
export default function Host() {
    const SubmitAnswer = () => {
        console.log('Answer submitted');
        // update to save the time/points of each player
      };

    return(
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Quick! Type this out as fast as you can! 
        </h1>
        <h1 className="text-xl font-medium text-left mb-2 text-white-400">
          "p1/p2's answer"
        </h1>

        <div className="text-white text-right text-lg mb-4">
        </div>
        
        <div className="space-y-6">
          <div>
            <textarea
              id="response"
              rows={5}
              placeholder="Type your response here..."
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