
import { push } from 'firebase/database';
import { useState, useEffect } from 'react';

type TypeboxProps = {
    textToBeTyped: string;
    playerPrompt: string;
    pushToNextPage: (time: number) => void;
  };


export default function Typebox( { textToBeTyped, playerPrompt, pushToNextPage }: TypeboxProps ) {

    const [inputText, setInputText] = useState('');
    const [storedCorrectText, setStoredCorrectText] = useState('');
    const gameText = textToBeTyped;
    const [finished, setFinished] = useState(false);

    
    //Timer shiz
    const [timer, setTimer] = useState(0);
    const [tInc, setTInc] = useState(0.1);
    useEffect(() => {
        if (finished) {
            const score = gameText.length - (timer * 2)
            pushToNextPage(score)
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
            <h1>The player's prompt: {playerPrompt}</h1>
            <h1>{textToBeTyped}</h1>
            <form>
                <textarea onChange={(e) => displayChar(e.target.value)}
                          value={inputText}
                          className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-700 text-gray-200 border border-gray-600"
                          rows={5}
                          placeholder="Type your response here..."/>
            </form>
            <h1>{timer}</h1>
        </div>
    );
}