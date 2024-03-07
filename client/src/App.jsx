import React, {useEffect, useState} from 'react'
import Login from './components/Login';
import './App.css';

function App() {

  const [backendData, setBackendData] = useState([]);

  useEffect(() => {
    fetch("/toptracks").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
        console.log(data);
      }
     
    )
  }, []);
  
  /**
   * 
   */
 let tracks = [];

//  backendData.forEach((track, index) => {
//   tracks.push(
//     <div key={index}>
//       <h2>Track: {track.name}</h2>
//       <h4>Album: {track.id}</h4>
//       <a href={track.album.external_urls.spotify} target="new">
//         <img src={track.album.images[0].url} alt=""/>
//       </a>
//       <audio controls>
//         <source  src={track.preview_url}/>
//       </audio>
//     </div>
//   );
//  })

backendData.map((track) =>
  tracks.push(
    <div key={track.id}>
      <h2>Track: {track.name}</h2>
      <h4>Album: {track.album.name}</h4>
      <a href={track.album.external_urls.spotify} target="new">
        <img src={track.album.images[0].url} alt="" />
      </a>
      <audio controls style={{ display: "block", margin: "0 auto" }}>
        <source src={track.preview_url} type="audio/mpeg"/>
      </audio>
    </div>
  )
);




  // console.log(backendData[0].album);
  return (
    <div className="App">
      <header className="App-header">
        <Login />
        {tracks}
      </header>
    </div>
  );
}

export default App;