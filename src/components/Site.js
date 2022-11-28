import React, { useState } from 'react';
import GPT from './GPT';
import DALLE from './DALLE';

export default function Site() {

  const [page, setPage] = useState('GPT');

  return (
    <div id='siteContainer'>
      <div id='nav'>
        <div id='navButtonContainer'>
          <button className={page==='GPT' ? 'navButton active' : 'navButton'} onClick={() => setPage('GPT')}>GPT-3</button>
          <button className={page==='DALLE' ? 'navButton active' : 'navButton'} onClick={() => setPage('DALLE')}>DALL-E</button>
        </div>
      </div>  
      <GPT page={page}/>
      <DALLE page={page}/>
    </div>
  )
}