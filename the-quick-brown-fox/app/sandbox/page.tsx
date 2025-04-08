"use client"
import Typebox from '../sandbox/sandyComponents/typebox'

export default function Game() {


    return(
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-800">
            <Typebox textToBeTyped='Super duper awesome sauceum'></Typebox>
        </div>
        
    );
}