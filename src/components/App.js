import React, { useState, useRef, useEffect } from "react";

export default function App() {

    const [promptGPT,setPromptGPT] = useState('');
    const [resultGPT,setResultGPT] = useState('');
    const [promptDALLE,setPromptDALLE] = useState('');
    const [resultDALLE,setResultDALLE] = useState('');
    const inputRefGPT = useRef();
    const inputRefDALLE = useRef();

    useEffect(() => {

        if ( promptGPT !== '' ) {
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptGPT })
            };
        
            fetch('http://127.0.0.1:5000/gpt', requestOptions)
              .then(response => response.text())
              .then(data => setResultGPT(data));

        }

    }, [promptGPT]);

    useEffect(() => {

        if ( promptDALLE !== '' ) {
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptDALLE })
            };
        
            fetch('http://127.0.0.1:5000/dalle', requestOptions)
              .then(response => response.text())
              .then(data => setResultDALLE(data));

        }

    }, [promptDALLE]);
  
    return (
      <div id='app'>
        <div id='field'>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptGPT(inputRefGPT.current.value)}}><input ref={inputRefGPT} type="text" className='inputField' /><input type="submit" value="TO GPT-3" className="inputButton"/></form>
            </div>
            <div id='outputBox' style={{display: resultGPT === '' ? 'none' : 'inline-block' }}>
              <span className="prompt">{promptGPT}</span><span className="result">{resultGPT}</span>
            </div>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptDALLE(inputRefDALLE.current.value)}}><input ref={inputRefDALLE} type="text" className='inputField' /><input type="submit" value="TO DALLE" className="inputButton"/></form>
            </div>
            <img id='outputDALLE' style={{display: resultDALLE === '' ? 'none' : 'inline-block' }} src={resultDALLE}></img>
        </div>
      </div>
    )
  }