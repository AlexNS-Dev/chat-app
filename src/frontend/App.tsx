import './App.css'
import WindowBar from './components/WindowBar/WindowBar'

function App() {

    // FUNCTIONS
    function isElectron() { // Usar para cuado queremos o no que se muestre la barra dragable con los windowControls
        return typeof window !== 'undefined' && window.electronAPI;
    }

    return (
        <div className="App">
            {isElectron() && <WindowBar title='Window Title' />}
            Rest of the content
        </div>
    )
}

export default App
