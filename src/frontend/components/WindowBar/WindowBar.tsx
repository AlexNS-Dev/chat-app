import './WindowBar.css'
import { useEffect, useState } from 'react'
import { TbWindowMaximize, TbWindowMinimize } from 'react-icons/tb'
import { FaWindowMinimize } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

const WindowBar = () => {

    // STATES
    const [isMaximized, setIsMaximized] = useState(false)

    // ELECTRON WINDOW
    const electronAPI = window.electronAPI // API
    const windowControls = electronAPI?.windowControls // Window controls

    // EFFECTS
    // Updates isMaximized state when the window is maximized or restored
    useEffect(() => {
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

    return (
        <div className='WindowBar'>
            <span className='window-title'>Window Title</span>
            <div className="window-controls">
                <button className='btn-minimize' onClick={windowControls.minimize}>
                    <FaWindowMinimize />
                </button>
                <button className='btn-toggle-maximize' onClick={windowControls.toggleMaximize}>
                    {isMaximized ? <TbWindowMinimize /> : <TbWindowMaximize />}
                </button>
                <button className='btn-close' onClick={windowControls.close}>
                    <IoClose />
                </button>
            </div>
        </div>
    )
}

export default WindowBar;
