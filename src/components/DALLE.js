import React, { useState, useRef, useEffect } from "react";

export default function GPT({ page }) {

    const [promptDALLE,setPromptDALLE] = useState('');
    const [resultDALLE,setResultDALLE] = useState('');
    const [variantDALLE,setVariantDALLE] = useState('');
    const inputRefDALLE = useRef();

    const resetSaveButtonInnerHTML = () => {
      if ( resultDALLE !== '' ) {
        [0,1,2,3,4,5,6,7,8,9].forEach( d => {
          document.getElementById('b'+d).innerHTML = 'save_alt';
        });
      }
    }

    useEffect(() => {

        if ( promptDALLE !== '' ) {
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptDALLE })
            };
        
            fetch('http://127.0.0.1:5000/dalle', requestOptions)
              .then(response => response.json())
              .then(data => setResultDALLE(data))
              .then(() => resetSaveButtonInnerHTML());

            }

          }, [promptDALLE]);

    const saveImage = ( url, prompt, buttonID, getVariant ) => {

      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url, prompt: prompt, buttonID: buttonID })
      };

      let savestr;

      fetch('http://127.0.0.1:5000/dalle/save', requestOptions)
        .then(response => response.json())
        .then(responseObject => {
          if ( responseObject['buttonID'] === 'error' ) {
            alert('Error saving image!');
          } else {
            document.getElementById(responseObject['buttonID']).innerHTML = 'beenhere';
            savestr = responseObject['savestr'];
          }
        })
        .then(() => {
          if ( getVariant ) {
            setVariantDALLE(savestr);
          }
        });
    }

    useEffect(() => {

      if ( variantDALLE !== '' ) {
          
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: variantDALLE })
        };
  
        fetch('http://127.0.0.1:5000/dalle/variants', requestOptions)
            .then(response => response.json())
            .then(data => setResultDALLE(data))
            .then(() => resetSaveButtonInnerHTML());

          }

        }, [variantDALLE]);

    return (
      <div id='DALLE' style={{display: page==='DALLE' ? 'block' : 'none' }}>
        <div className='field'>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptDALLE(inputRefDALLE.current.value)}}><input ref={inputRefDALLE} type="text" className='inputField' /><input type="submit" value="TO DALL-E" className="inputButton"/></form>
            </div>
            {resultDALLE!=='' && resultDALLE['data'].map((d,i) => <div className="imgContainer" key={'c'+i} onClick={() => saveImage(d['url'],promptDALLE,'b'+i,true)} ><img key={'i'+i} className='outputDALLE' src={d['url']}/><button id={'b'+i} key={'b'+i} onClick={e => {e.stopPropagation();saveImage(d['url'],promptDALLE,'b'+i,false)}} className='saveButton material-icons'>save_alt</button></div> )} 
        </div>
      </div>
    )
  }