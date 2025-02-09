import Particles from "react-tsparticles";
import { loadFull } from "tsparticles"; // loads tsparticles
import { useCallback, } from "react";
import { loadPolygonPath } from "tsparticles-path-polygon";
import { errorpage,hexpage,startpage,resultpage } from "./animationPresets";
import { lolcontext } from "./contextLol";
import { useContext } from "react";
const ParticlesComponent = (props) => {
    const {flag,loader,payload,setMessage}=useContext(lolcontext);
    const particlesInit = useCallback(async(engine) => {
        await loadFull(engine);
        await loadPolygonPath(engine);
      }, []);
 let options={};
    
      if(!flag){
        options=startpage;
      }
      else if(loader){
        options=hexpage;
        setMessage('Porodicting...')
      }
      else if(payload.length===2){
        options=errorpage;
        setMessage('ERROR Occured');
      }
      else if (payload.length>2){
        options=resultpage;
        setMessage('Porodicted!')
      }    
   
    
  
    return <Particles  init={particlesInit} options={options} />;
  };
  
  export default ParticlesComponent;