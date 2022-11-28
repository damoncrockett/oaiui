import React, { useState, useRef, useEffect } from "react";

export default function GPT({ page }) {

    const [promptDALLE,setPromptDALLE] = useState('');
    const [resultDALLE,setResultDALLE] = useState('');
    const inputRefDALLE = useRef();

    useEffect(() => {

        if ( promptDALLE !== '' ) {
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptDALLE })
            };
        
            fetch('http://127.0.0.1:5000/dalle', requestOptions)
              .then(response => response.json())
              .then(data => setResultDALLE(data));

        }

    }, [promptDALLE]);
  
    return (
      <div id='DALLE' style={{display: page==='DALLE' ? 'block' : 'none' }}>
        <div className='field'>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptDALLE(inputRefDALLE.current.value)}}><input ref={inputRefDALLE} type="text" className='inputField' /><input type="submit" value="TO DALL-E" className="inputButton"/></form>
            </div>
            {resultDALLE!=='' && resultDALLE['data'].map((d,i) => <img key={i} className='outputDALLE' src={d['url']}></img>)}
        </div>
      </div>
    )
  }