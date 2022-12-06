import React, { useState, useRef, useEffect, Component } from "react";

function Input({ composition, setComposition }) {

  const [exspanderContent, setExspanderContent] = useState('');
  const [width, setWidth] = useState(0);
  const inputRef = useRef();
  const exspanderRef = useRef();

  useEffect(() => {
    setWidth(exspanderRef.current.offsetWidth);
  }, [exspanderContent]);

  const inputChangeHandler = e => {
    setExspanderContent(e.target.value + '-'.repeat(Math.ceil(e.target.value.length)))
  }

  const formSubmitHandler = e => {
        
    e.preventDefault();
    if ( composition === '' ) {
      setComposition(inputRef.current.value);
    } else {
      setComposition(composition + ' ' + inputRef.current.value);
    }
    inputRef.current.value='';
    setExspanderContent('');
  }

  return (
    
    <form onSubmit={formSubmitHandler}>
      <div id='inputWrap'>
        <span ref={exspanderRef} id='exspander'>{exspanderContent}</span>
        <input ref={inputRef} onChange={inputChangeHandler} type="text" autoFocus style={{ width }} />
      </div>
    </form>

  )
}

export default function COMPOSE({ page }) {

    const [result,setResult] = useState('');
    const [beforeText,setBeforeText] = useState(null);
    const [afterText, setAfterText] = useState(null);
    const [composition,setComposition] = useState('');
    const [previousComposition,setPreviousComposition] = useState(null);
    const [range,setRange] = useState(null);
    const [axis,setAxis] = useState('length');
    const [direction,setDirection] = useState('maintain');
    const [prompt,setPrompt] = useState('');

    useEffect(() => {

      let selectedText = '';
      let textBeforeSelection = '';

      const innerText = document.getElementById('composition').innerText;
      
      if ( range !== null ) {
        
        selectedText = innerText.substring(range[0],range[1]);
        textBeforeSelection = innerText.substring(0,range[0]);

      }

      if ( direction === 'maintain' ) {
        setPrompt("Reword the following passage: " + selectedText)
      } else if ( direction === 'new' ) {
        setPrompt(textBeforeSelection)
      } else if ( direction === 'increase' ) {
        if ( axis === 'length' ) {
          setPrompt("Make the following passage longer: " + selectedText)
        } else if ( axis === 'sentiment' ) {
          setPrompt("Make the following passage happier: " + selectedText)
        } else if ( axis === 'formality' ) {
          setPrompt("Make the following passage more formal: " + selectedText)
        } else if ( axis === 'technicality' ) {
          setPrompt("Make the following passage more technical: " + selectedText)
        } else if ( axis === 'poesy' ) {
          setPrompt("Make the following passage more poetic: " + selectedText)
        }
      } else if ( direction === 'decrease' ) {
        if ( axis === 'length' ) {
          setPrompt("Make the following passage shorter: " + selectedText)
        } else if ( axis === 'sentiment' ) {
          setPrompt("Make the following passage sadder: " + selectedText)
        } else if ( axis === 'formality' ) {
          setPrompt("Make the following passage less formal: " + selectedText)
        } else if ( axis === 'technicality' ) {
          setPrompt("Make the following passage less technical: " + selectedText)
        } else if ( axis === 'poesy' ) {
          setPrompt("Make the following passage less poetic: " + selectedText)
        }
      }
      
    },[axis,direction,range])

    const submitPrompt = () => {

        setPreviousComposition(composition);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        };
    
        fetch('http://127.0.0.1:5000/gpt', requestOptions)
          .then(response => response.text())
          .then(data => setResult(data.trim()));

    };

    useEffect(() => {

      if ( result !== null && range !== null ) {

        const innerText = document.getElementById('composition').innerText;
        const textBeforeSelection = innerText.substring(0,range[0]);
        const textAfterSelection = innerText.substring(range[1],innerText.length);
        
        const newComposition = textBeforeSelection + result + textAfterSelection;
        setComposition(newComposition);
        
        setBeforeText(textBeforeSelection);
        setAfterText(textAfterSelection);
        
      }

    },[result])

    useEffect(() => {

      if ( result !== null && beforeText !== null && afterText !== null ) {
        
        const selectionElement = document.getElementById('composition');
        const newSelection = document.getSelection();
        const newRange = document.createRange();
        const start = beforeText.length;
        const end = start + result.length;
        newRange.setStart(selectionElement.firstChild,start);
        newRange.setEnd(selectionElement.firstChild,end);
        newSelection.removeAllRanges();
        newSelection.addRange(newRange);

        setRange([start,end]);
      }
      
    },[beforeText,afterText,composition])

    const getSelectionRange = () => {
  
          const selection = window.getSelection(); 
          const newRange = selection.getRangeAt(0);
          const start = newRange.startOffset;
          const end = newRange.endOffset;
          setRange([start,end]);
  
    }

    const undoSubmission = () => {
      
      setComposition(previousComposition);
      setPreviousComposition(null);

    }
 
    return (
      <div id='COMPOSE' style={{display: page==='COMPOSE' ? 'block' : 'none' }}>
        <div id="axisButtons">
          <button title='length' className={axis==='length' ? 'material-icons active' : 'material-icons'} onClick={() => setAxis('length')}>straighten</button>
          <button title='sentiment' className={axis==='sentiment' ? 'material-icons active' : 'material-icons'} onClick={() => setAxis('sentiment')}>sentiment_satisfied</button>
          <button title='formality' className={axis==='formality' ? 'material-icons active' : 'material-icons'} onClick={() => setAxis('formality')}>school</button>
          <button title='technicality' className={axis==='technicality' ? 'material-icons active' : 'material-icons'} onClick={() => setAxis('technicality')}>architecture</button>
          <button title='poesy' className={axis==='poesy' ? 'material-icons active' : 'material-icons'} onClick={() => setAxis('poesy')}>palette</button>
        </div>
        <div id='composePage'>
          <div id='submitControls'>
            <button title='submit prompt' className='material-icons' onClick={() => submitPrompt()}>send</button>
            <button title='undo submission' id='undo' className='material-icons' onClick={() => undoSubmission()}>undo</button>
            <button title='reword' className={direction==='maintain' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('maintain')}>maximize</button>
            <button title='increase' className={direction==='increase' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('increase')}>call_made</button>
            <button title='decrease' className={direction==='decrease' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('decrease')}>south_east</button>
            <button title='new completion' className={direction==='new' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('new')}>add</button>
          </div>
          <span id='composition' onMouseUp={getSelectionRange}>{composition}</span>
          <Input composition={composition} setComposition={setComposition} />
        </div>
      </div>
    )
  }