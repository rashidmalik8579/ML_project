//import logo from './logo.svg';
import './amelia_90.css';
import {TEXT_INPUT} from './components/form';
import {Cards} from './components/cards';
import { lolcontext } from './components/contextLol';
import React, {useState } from 'react';
import {Loader, } from './components/loaderComp'
// import Hexbg from './components/backgroundHex'
// import React, { useCallback } from "react";

import ParticlesComponent from './components/backgroundHex';


//export const lolcontext= createContext();
function App() {
  const [flag,setFlag]=useState(false);
  const [disable,setDisable]=useState(false);
  const [animate,setAnimate]=useState(true);
  const [summonerName,setSummonername] = useState('');
  const [payload,setPayload]=useState([]);
  const [loader,setLoader]=useState(false);
  const [message,setMessage]= useState('Porodictor')
  
  return (
    // <div className={divclass}>
     <div className='amelia_root' style={{alignItems:'center'}}>    
    <lolcontext.Provider value={{animate,setAnimate,summonerName,setSummonername,disable,message,setMessage,
      setDisable,loader,setLoader,flag,setFlag,setPayload,payload}}>
    <TEXT_INPUT />
    <ParticlesComponent  />   
    {loader?<Loader />:<Cards />}
    </lolcontext.Provider>  
     </div>
    
  );
}

export default App;
