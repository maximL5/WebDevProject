
import { useState, useEffect } from 'react';

type TypeboxProps = {
    textToBeTyped: string;
  };


export default function Typebox( { textToBeTyped }: TypeboxProps ) {

    const [inputText, setInputText] = useState('');
    const [storedCorrectText, setStoredCorrectText] = useState('');
    const gameText = textToBeTyped;
    const [finished, setFinished] = useState(false);

    
    //Timer shiz
    const [timer, setTimer] = useState(0);
    const [tInc, setTInc] = useState(0.1);
    useEffect(() => {
        if (finished) {
            return;
        }

    const timerLoop = () => {
      setTimer(prev => Math.round((prev + tInc) * 10) / 10); 
    };
    const intervalId = setInterval(timerLoop, 100); 

    return () => clearInterval(intervalId); 
  }, [finished]);


    const [position, setPosition] = useState(0);


    const displayChar = (text:string) => { 
        const mostRecentCharTyped = text.slice(-1).toLowerCase()
        const compareChar = gameText.slice(position, position + 1).toLowerCase()
        if (mostRecentCharTyped == compareChar) {
            setInputText(text);
            setStoredCorrectText(text);
            setPosition(position + 1);
            if (position + 1>= gameText.length) {
                setInputText("You win!")
                setTInc(0)
                setFinished(true)
            }
        } else {
            if (finished) {
                
            } else {
                setInputText(storedCorrectText);
            }
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