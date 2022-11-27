import React, { useState, useRef, useEffect } from "react";

export default function App() {

    const [prompt,setPrompt] = useState('');
    const [result,setResult] = useState('');
    const inputRef = useRef();

    useEffect(() => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        };
    
        fetch('http://127.0.0.1:5000/', requestOptions)
          .then(response => response.text())
          .then(data => setResult(data));

    }, [prompt]);
  
    return (
      <div id='app'>
        <div id='field'>
            <div id='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPrompt(inputRef.current.value)}}><input ref={inputRef} type="text" id='inputField' /><input type="submit" value="TO GPT-3" id="inputButton"/></form>
            </div>
            <div id='outputBox'>
              <span className="prompt">{prompt}</span><span className="result">{result}</span>
            </div>
        </div>
      </div>
    )
  }