
import { useState, useEffect } from 'react';

type TypeboxProps = {
    textToBeTyped: string;
  };


export default function Typebox( { textToBeTyped }: TypeboxProps ) {

    const [inputText, setInputText] = useState('');
    const [storedCorrectText, setStoredCorrectText] = useState('');
    const gameText = textToBeTyped;

    //Timer shiz
    const [timer, setTimer] = useState(0)
    useEffect(() => {
    const timerLoop = () => {
      setTimer(prev => Math.round((prev + 0.1) * 10) / 10); 
    };

    const intervalId = setInterval(timerLoop, 100); 

    return () => clearInterval(intervalId); 
  }, []);


    const [position, setPosition] = useState(0);


    const displayChar = (text:string) => {

        if (text.slice(-1).toLowerCase() == gameText.slice(position, position + 1).toLowerCase()) {
            setInputText(text);
            setStoredCorrectText(text);
            setPosition(position + 1);
        } else {
            setInputText(storedCorrectText);
        }
    }




    return(
        <div>
            <h1>{textToBeTyped}</h1>
            <form>
                <textarea onChange={(e) => displayChar(e.target.value)}
                          value={inputText}
                          className="text-blue-600 bg-yellow-100 border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 h-40 resize-none"/>
            </form>
            <h1>{timer}</h1>
        </div>
    );
}