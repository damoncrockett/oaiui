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

        // reset saveButton innerHTML on prompt change; otherwise app will remember saveButton innerHTMLs from previously saved images
        if ( resultDALLE !== '' ) {
          [0,1,2,3,4,5,6,7,8,9].forEach( d => {
            document.getElementById('b'+d).innerHTML = 'save_alt';
          });
        }

    }, [promptDALLE]);

    const urlToFlask = ( url, prompt, buttonID ) => {

      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url, prompt: prompt, buttonID: buttonID })
      };

      fetch('http://127.0.0.1:5000/save', requestOptions)
        .then(response => response.text())
        .then(savedID => {
          if ( savedID === 'error' ) {
            alert('Error saving image!');
          } else {
            document.getElementById(savedID).innerHTML = 'beenhere';
          }
        });

    }

    return (
      <div id='DALLE' style={{display: page==='DALLE' ? 'block' : 'none' }}>
        <div className='field'>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptDALLE(inputRefDALLE.current.value)}}><input ref={inputRefDALLE} type="text" className='inputField' /><input type="submit" value="TO DALL-E" className="inputButton"/></form>
            </div>
            {resultDALLE!=='' && resultDALLE['data'].map((d,i) => <div className="imgContainer" key={'c'+i}><img key={'i'+i} className='outputDALLE' src={d['url']}/><button id={'b'+i} key={'b'+i} onClick={() => urlToFlask(d['url'],promptDALLE,'b'+i)} className='saveButton material-icons'>save_alt</button></div> )} 
        </div>
      </div>
    )
  }