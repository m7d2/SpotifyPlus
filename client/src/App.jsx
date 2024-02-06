import React, {useEffect, useState} from 'react'
import Login from './components/Login';
import './App.css';

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/toptracks").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, []);
  
  return (
    <div className='App'>
      <header className='App-header'>
        <Login />
      </header>
    </div>
  )
}

export default App