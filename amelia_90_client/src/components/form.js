import { useState,useContext } from "react";
import {createTheme, Paper, TextField,Box, Typography} from '@mui/material';
import {Button} from '@mui/material';
import {InputLabel} from '@mui/material' ;
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import axios from "axios";
import {ThemeProvider } from '@mui/material/styles';
import { lolcontext } from "./contextLol";
import porohd from "../images/porohd.png"
//export var payload=[];
//export var  flag =false;
const font1=createTheme({
    typography: {
        fontFamily: [
          'Chilanka',
          'cursive',
        ].join(','),
      }
});
const theme=createTheme({
    
    palette:{
        action:{
            disabledBackground:'#748eb8',
            disabled:'white'
        },
        primary:{
            main:'#EA213A',
        },
        secondary:{
            main:'#EA213A'
        }
    },
});

export const TEXT_INPUT=()=>{
    const {loader,disable,flag,setFlag,message,
        setPayload,setDisable,summonerName,setSummonername,setLoader}=useContext(lolcontext);
    const [server,setServer] = useState('EUW')
    let poroimage='';
    let p={summonerName,server};
  
    // const handle_server_change=(event)=>{
    //     setServer(event.target.value);
    // }

    const textfunc=()=>{
        return alert("Request Sent!")
    }
    
    const processdata=(event)=>{        
        //event.preventDefault();
       
        
        console.log("axios request sent",p);
       axios.post("https://projectamelia90.herokuapp.com/",p)
       .then(setDisable(true),setFlag(true),setLoader(true))
       .then(console.log("request sent"))
       .catch(err=>console.log(err))
       .then((res)=>{(setPayload(res.data));
        console.log(res.data);setDisable(false);setLoader(false);setFlag(true);})
    }
    if(!loader && !flag){
     poroimage= (<Box sx={{alignText:"center",alignItems:'center',marginTop:"-90%"}}>     
                        <img  alt="poro" src={porohd} width='750px' style={{marginTop:"-21%",zIndex:""}} />    
                          </Box>)}
    return (
        <div id='primary' style={{alignItems:'center',marginTop:50}}>               
        <Stack direction='column' spacing={-1} sx={{display:'flex',alignItems:'center'}}>
        <ThemeProvider theme={font1}>
        <Typography sx={{ fontSize: 35,alignText:"center" }} color="white" fontFamily="" gutterBottom>
                         {message}
        </Typography>
        </ThemeProvider>
          
        <Paper className='paper-root-main' elevation={16} sx={{zIndex:"100",width:750,height:90,borderRadius:50,backgroundColor:'#04EE51'}}>      
        <Stack direction='row' sx={{alignItems:'center', display:'inline-flex'}} spacing={4}>
           <Paper className='paper-main' variation='outlined' elevation={4} sx={{borderRadius:100,
                                display:'inline-flex'
                                ,alignItems:'center',width:595,height:80,margin:0.5,
                                marginLeft:2.5, backgroundColor:'white'}}>
           <Stack direction='row' spacing={3} sx={{margin:5}} >   
             <FormControl sx={{width:90}}>
            <InputLabel id='server-select' >Server</InputLabel>
            <Select 
            labelId='server-select-label-id'
            id='server-select'
            label='Server'
            value={server}
            >
                <MenuItem value={'BR'}>Brazil </MenuItem>
                <MenuItem value={'EUW'}>Europe West </MenuItem>
                <MenuItem value={'NA'}>North America </MenuItem>
                <MenuItem value={'RU'}>Russia </MenuItem>
                <MenuItem value={'JP'}>Japan </MenuItem>
                <MenuItem value={'KR'}>Republic of Korea </MenuItem>
                <MenuItem value={'TR'}>Turkey </MenuItem>
            </Select>
        </FormControl>
        <div className='textfield'>
            <TextField sx={{width:400,margin:0}} id='outlined-basic' label='Who You Wish..summoner?!' value= {summonerName} varient='Outlined' 
            onChange={(event)=>{setSummonername(event.target.value);}}>
            </TextField>  
            </div>       
            </Stack>
      </Paper>  
      <ThemeProvider theme={theme}>
      <Button variant='contained' disabled={disable} sx={{borderRadius:80,height:80,width:80}} 
                                size='large' onClick={(event)=>{textfunc();if(p.summonerName!==''){processdata()};}}>Porodict
            </Button>
        </ThemeProvider>
                </Stack>            
                </Paper>
                 {poroimage}
                </Stack>              
     </div>     
)}
