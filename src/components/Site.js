import React, { useState } from 'react';
import GPT from './GPT';
import DALLE from './DALLE';
import COMPOSE from './COMPOSE';

export default function Site() {

  const [page, setPage] = useState('COMPOSE');

  return (
    <div id='siteContainer'>
      <div id='nav'>
        <div id='navButtonContainer'>
          <button className={page==='GPT' ? 'navButton material-icons active' : 'navButton material-icons'} onClick={() => setPage('GPT')}>question_answer</button>
          <button className={page==='COMPOSE' ? 'navButton material-icons active' : 'navButton material-icons'} onClick={() => setPage('COMPOSE')}>create</button>
          <button className={page==='DALLE' ? 'navButton material-icons active' : 'navButton material-icons'} onClick={() => setPage('DALLE')}>image</button>
        </div>
      </div>  
      <GPT page={page}/>
      <COMPOSE page={page}/>
      <DALLE page={page}/>
    </div>
  )
}