import React, { useState, useEffect } from "react";

export default function COMPOSE({ page }) {

    const [result,setResult] = useState('');
    const [previousComposition,setPreviousComposition] = useState(null);
    const [range,setRange] = useState(null);
    const [axis,setAxis] = useState('length');
    const [direction,setDirection] = useState('maintain');
    const [prompt,setPrompt] = useState('');

    useEffect(() => {

      let selectedText = '';
      let textBeforeSelection = '';

      const textarea = document.getElementById('composition');
      const innerText = textarea.value;
      
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
        
        const textarea = document.getElementById('composition');
        const innerText = textarea.value;
        setPreviousComposition(innerText);

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

        const textarea = document.getElementById('composition');
        const innerText = textarea.value;
        const textBeforeSelection = innerText.substring(0,range[0]);
        const textAfterSelection = innerText.substring(range[1],innerText.length);
        
        const newComposition = textBeforeSelection + result + textAfterSelection;
        textarea.value = newComposition;
        textarea.dispatchEvent(new Event('change'));

        const start = textBeforeSelection.length;
        const end = start + result.length;

        const textareaChanged = document.getElementById('composition');
        textareaChanged.setSelectionRange(start, end);
        textareaChanged.focus();
        setRange([start,end]);

      }

    },[result])

    const getSelectionRange = () => {
  
        const textarea = document.getElementById('composition');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        setRange([start,end]);
  
    }

    const undoSubmission = () => {
      
      const textarea = document.getElementById('composition');
      
      textarea.value = previousComposition;
      textarea.dispatchEvent(new Event('change'));
      
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
        <div id='submitControls'>
          <button title='submit prompt' className='material-icons' onClick={() => submitPrompt()}>send</button>
          <button title='undo submission' id='undo' className='material-icons' onClick={() => undoSubmission()}>undo</button>
          <button title='reword' className={direction==='maintain' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('maintain')}>maximize</button>
          <button title='increase' className={direction==='increase' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('increase')}>call_made</button>
          <button title='decrease' className={direction==='decrease' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('decrease')}>south_east</button>
          <button title='new completion' className={direction==='new' ? 'material-icons active' : 'material-icons'} onClick={() => setDirection('new')}>add</button>
        </div>
        <textarea id='composition' cols='40' rows='14' autoFocus onMouseUp={getSelectionRange}></textarea>
      </div>
    )
  }