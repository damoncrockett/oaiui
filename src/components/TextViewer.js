export default function TextViewer({ md }) {
    return (
      <div id='field'>
        <div id='panel'>
          {md.map((d, i) => <p key={i}><span className="prompt">{d['prompt']}</span><span className="response">{d['response']}</span></p>)}
        </div>
      </div>
      )
    }



