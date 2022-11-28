import React, { useState, useRef, useEffect } from "react";

export default function GPT({ page }) {

    const [promptGPT,setPromptGPT] = useState('');
    const [resultGPT,setResultGPT] = useState('');
    const inputRefGPT = useRef();

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

    return (
      <div id='GPT' style={{display: page==='GPT' ? 'block' : 'none' }}>
        <div className='field'>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptGPT(inputRefGPT.current.value)}}><input ref={inputRefGPT} type="text" className='inputField' /><input type="submit" value="TO GPT-3" className="inputButton"/></form>
            </div>
            <div id='outputBox' style={{display: resultGPT === '' ? 'none' : 'inline-block' }}>
              <span className="prompt">{promptGPT}</span><span className="result">{resultGPT}</span>
            </div>
        </div>
      </div>
    )
  }