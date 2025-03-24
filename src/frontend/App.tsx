import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // STATES
  const [message, setMessage] = useState('Hello World')
  const [isMaximized, setIsMaximized] = useState(false)

  // ELECTRON WINDOW -> Mover a componente
  const electronAPI = window.electronAPI // API
  const windowControls = electronAPI?.windowControls // Window controls

  // EFFECTS
  useEffect(() => { // -> Mover a componente
    if (windowControls) {

      function handleMaximized(isMaximized: boolean) {
        setIsMaximized(isMaximized)
      }

      // When the window 'isMaximized' changes, update the state
      windowControls.onWindowMaximized(handleMaximized)

      return () => {
        windowControls.onWindowMaximized(() => { }) // Remove listener
      }
    }

    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // FUNCTIONS
  function sendMsg(msg: string) {
    // send msg with preload API
    electronAPI.doThing(msg)
    setMessage('')
  }
  async function getPlatform(msg: string) {
    // invoke promise with preload API
    const data = await electronAPI.promiseMsg(msg)
    console.log(data)
  }

  function isElectron() { // Usar para cuado queremos o no que se muestre la barra dragable con los windowControls
    return typeof window !== 'undefined' && window.electronAPI;
  }

  return (
    <>
      {isElectron() &&
        <>
          <div className='drag-region'>Drag Region</div>
          <span>WELCOME</span><hr />
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} /> <br />
          <button onClick={() => sendMsg(message)}>Send</button> <hr />
          <button onClick={() => getPlatform('Invoking platform...')}>Get Platform</button> <hr />

          <button onClick={windowControls?.minimize}>➖</button>
          <button onClick={windowControls?.toggleMaximize}>{isMaximized ? '▣' : '◻'}</button>
          <button onClick={windowControls?.close}>❌</button> <br />
          <div>
            <p>Is Maximized: {isMaximized ? <span style={{ color: 'palegreen' }}>Yes</span> : <span style={{ color: 'palevioletred' }}>No</span>}</p>
          </div>
        </>
      }

      {!isElectron() && <h1>Estas en el navegador.</h1>}

      <div>
        <p>Is Electron: {isElectron() ? <span style={{ color: 'palegreen' }}>Yes</span> : <span style={{ color: 'palevioletred' }}>No</span>}</p>
      </div>
    </>
  )
}

export default App
