import React, { useState, useRef, useEffect } from "react";

export default function GPT({ page }) {

    const [promptList,setPromptList] = useState([]);
    const [resultList,setResultList] = useState([]);
    const [listMode,setListMode] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
      
      if ( promptList.length > 0 ) {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptList[promptList.length-1] })
      };

      fetch('http://127.0.0.1:5000/gpt', requestOptions)
        .then(response => response.text())
        .then(data => {
          setResultList([...resultList,data]);
        });

      }}, [promptList]);

    useEffect(() => {

      if ( resultList.length > 0 )  {

        document.getElementById("outputBox").scrollTop = document.getElementById("outputBox").scrollHeight;

      }

    },[resultList])
        
    return (
      <div id='GPT' style={{display: page==='GPT' ? 'block' : 'none' }}>
        <div className='field'>
            <button id='listMode' onClick={() => setListMode(!listMode)} className={listMode ? 'toggle material-icons active' : 'toggle material-icons'} >speaker_notes</button>
            <div className='inputBox'>
              <form onSubmit={e => {e.preventDefault();setPromptList([...promptList,inputRef.current.value])}}><input ref={inputRef} type="text" className='inputField' /><input type="submit" value="SUBMIT" className="inputButton"/></form>
            </div>
            {resultList.length > 0 && <div id='outputBox'>
              {!listMode && <div className="outputCell"><span className="prompt">{promptList[promptList.length-1].split("|")[0]}</span><span className="result">{resultList[resultList.length-1]}</span></div>}
              {listMode && resultList.map((d,i) => <div className="outputCell"><span className="prompt">{promptList[i].split("|")[0]}</span><span className="result">{d}</span></div>)}
            </div>}
        </div>
      </div>
    )
  }