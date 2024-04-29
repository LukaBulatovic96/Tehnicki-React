import {useState,useEffect,useRef} from "react";

import './App.css'
import axios from "axios";

function App() {
  const [avgAge, setAvgAge] = useState(0);
  const [loaderInterval, setLoaderInterval] = useState();
  const [lastLoaded, setLastLoaded] = useState(Date.now());
  const [timeStopped, setTimeStopped] = useState(Date.now());

  async function  loadData(){
    console.log("initialize load");
    
    await axios.get('https://randomuser.me/api/?results=10').then(async result=>{
      console.log(result.data.results);

      setAvgAge(() => {
        let total=0;
        result.data.results.forEach((element:any)  => {
          total+= element.dob.age;
        });
        return total/10;
      })
    })
    console.log("finish load");
    setLastLoaded(Date.now())
  }

  useEffect(() => {   
    setupF();
  },[]);

  function setupF() {
    loadData();
    setLoaderInterval( setInterval(loadData, 5000));
  }

  function stopTimer(){
    clearInterval(loaderInterval);
    setLoaderInterval(null)
    // loaderInterval.current = null;
    console.log(loaderInterval);
    setTimeStopped(Date.now());
    console.log("diff: ",timeStopped - lastLoaded);
    
  } 
  function resumeTimer(){
    setTimeout(setupF, 5000 - (timeStopped - lastLoaded));
  }
  

  return (
    <>
    <h1 className=''>Prosek: {avgAge}</h1>
    <button onClick={loadData}>Load</button>
    <p>{lastLoaded}</p>
    <p>{timeStopped}</p>
    <p></p>
    {loaderInterval? 
    <button onClick={stopTimer}>Stop</button>:
    <button onClick={resumeTimer}>Resume</button>
  }
    </>
  )
}

export default App
