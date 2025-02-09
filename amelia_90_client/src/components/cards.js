import * as React from "react";
import {useContext} from 'react';
import List from "@mui/material/List";
import { Box, Card,Zoom, CardContent, Typography } from "@mui/material";
import {Stack } from "@mui/system";
import { createListItem } from "./itemslist";
import {lolcontext} from './contextLol';

export const Cards = () => {
        const {flag,payload,summonerName}=useContext(lolcontext)
        //payload.pop();
        let obj={p:payload};
        let checkpayload=obj.p;
          let boxsx = {
            display:'block',
            width:'auto',            
            marginTop:'5%',
            alignContents:'center',
           textAlignLast:'center',
            p:2,
            alignItems:'center'
            };

          let cardSx = {
            width:'20%',
            borderRadius:'50%',
            height:200,
            margin:0,
            backgroundColor:'white'
          };

        
          

          let blueCardSx = {
            borderRadius:8,
            width: '23.5%',
            height:'auto',
            backgroundColor: "#5DA7DB",    
          };

          let redCardSx = {
            borderRadius:8,
            width: '23.5%',
            height:'auto',
            backgroundColor: "#FF5858",
            
          };
          let stackSx = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };
          let errorsx={
            width:500,
            alignItems:'center',
            borderRadius:200,
            display:'inline-block',
            textAlign:'center',
            backgroundColor:'#ed2839'
        

          };
          var percentage=(checkpayload[10]*100).toFixed(2);

        const result=(<React.Fragment>
                        <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Our Porodiction is:
                      </Typography>            
                      <Typography variant="h5" component="div">
                        
                        {percentage}% VICTORY!!!
                      </Typography>
                    </CardContent>            
                      </React.Fragment>);

        const cardsss=  (<Box className="boxCard" sx={boxsx}>
                      <Stack sx={stackSx} direction={"row"} spacing={2}>
                        <Card className="blueTeam" elevation={16} sx={blueCardSx}>
                          <List>
                          {obj.p.slice(0,5).map(createListItem)}
                          </List>
                        </Card>
                        {/* <Box  sx={cardSx}> */}
                        <Card className="result" elevation={16} sx={cardSx}>
                            {result}                                  
                        </Card>
                        {/* </Box>                   */}
                        <Card className="redTeam" elevation={16} sx={redCardSx}>
                          <List>
                          {obj.p.slice(5,10).map(createListItem)}
                        </List>
                        </Card>
                      </Stack>
                      </Box>)
        const error =(<React.Fragment >
                        <CardContent >
                      <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
                        Error Occured:
                      </Typography>            
                      <Typography variant="h5" component="div">
                        {checkpayload[0]} : {checkpayload[1]}
                      </Typography>
                      </CardContent>            
                      </React.Fragment>);

        console.log(checkpayload,summonerName,checkpayload.length)

          if(flag && checkpayload.length>2){            
            for(var x=0;x<5;x++){                         //querying team color for searched summoner
              if(checkpayload[x].name===summonerName){
              console.log(checkpayload[x].name)
              cardSx.backgroundColor='#5DA7DB'
              break;
              }
              else{ 
              cardSx.backgroundColor='#FF5858';
              percentage=1-percentage;
            }
            };
              return (    
                  <div className="blue-red" style={{alignItems:'center',width:'100%',margin:5}}>
                      
                  <Zoom in={flag} style={{ transitionDelay: flag ? '500ms' : '0ms' }}>
                  {cardsss}
                  </Zoom>
                  </div>             
                  )
                  }
            else if(flag && checkpayload.length===2){
              return (    
                <div className="blue-red" style={{alignItems:'center',width:'100%',margin:5}}>
                <Box className="boxCard" sx={boxsx}>  
                  <Card className="error" elevation={14} sx={errorsx} >
                    {error}          
                  </Card>
                  </Box>
                    
                      
                
                </div>             
                )
            }           
                    
}
