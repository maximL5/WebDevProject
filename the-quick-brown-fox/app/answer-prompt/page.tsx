"use client";

//page for prompt giver
export default function Host() {
    const SubmitAnswer = () => {
        console.log('Answer submitted');
        
      };

    return(
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-gray-800 border border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-5 text-amber-400">
          Answer to the best of your ability! Or not!
        </h1>
        <h1 className="text-xl font-bold text-left mb-5 text-white-400">
          Your prompt is: {}
        </h1>
        
        
        <div className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="E.g. 'Describe in detail how bad your feet smell'"
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