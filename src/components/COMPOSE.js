import React, { useState, useRef, useEffect } from "react";

export default function COMPOSE({ page }) {

    const [result, setResult] = useState("");
    const [spanList, setSpanList] = useState([]);
    const inputRef = useRef();

    const [exspanderContent, setExspanderContent] = useState('');
    const [width, setWidth] = useState(0);
    const exspanderRef = useRef();

    const [highlightedChunk,setHighlightedChunk] = useState(null);

    const submitPrompt = prompt => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: "Reword the following sentence: '" + prompt + "'" })
        };
    
        fetch('http://127.0.0.1:5000/gpt', requestOptions)
          .then(response => response.text())
          .then(data => setResult(data));

    };

    useEffect(() => {
        
        setWidth(exspanderRef.current.offsetWidth);

      }, [exspanderContent]);

    const formSubmitHandler = e => {
        
        e.preventDefault();
        setSpanList([...spanList,inputRef.current.value]);
        inputRef.current.value='';
        setExspanderContent('');
    }

    const inputChangeHandler = e => {
        
        setExspanderContent(e.target.value + '-'.repeat(Math.ceil(e.target.value.length/2)))

    }

    const chunkClickHandler = (e, chunkID) => { 
        
        setHighlightedChunk(chunkID);
        submitPrompt(e.target.innerText);

    }

    useEffect(() => {
        
        if ( highlightedChunk !== null ) {

            document.getElementById(highlightedChunk).innerText = result.trim();

        } 

      }, [result]);
 
    return (
      <div id='COMPOSE' style={{display: page==='COMPOSE' ? 'block' : 'none' }}>
        <div className='composePage'>
          {spanList.length > 0 && spanList.map((d,i) => <span key={i} id={'c'+i} onClick={e => chunkClickHandler(e,'c'+i)} className={highlightedChunk === 'c'+i ? "composeChunk highlighted" : "composeChunk"}>{d}</span>)}
          <form onSubmit={formSubmitHandler}><div id='inputWrap'><span ref={exspanderRef} id='exspander'>{exspanderContent}</span><input ref={inputRef} onChange={inputChangeHandler} type="text" autoFocus style={{ width }} /></div></form>
        </div>
      </div>
    )
  }