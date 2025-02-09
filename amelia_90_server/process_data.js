import { grabdatabypuuid,grabchampionmastery,grabmatchdata,
    grabspectatordata,grabdata,grabmatchids } from "./api_calls.js";
//import Statistics from 'statistics.js';
import mongoose from 'mongoose';
import express from 'express';

import {final_processing, start} from './fetch_data.js';
import { loadmodel } from "./predict.js";
import { datadragon } from "./final_object.js";
import dotenv from 'dotenv';
dotenv.config();
export const port = process.env.PORT || 5000;

const app=express();
const {Schema}= mongoose;

export var summonerList=[];

export var summonerLevels=[];

export var profileIconIds=[];
export var currentchampId=[];
 
const summoner_schema = new mongoose.Schema({
        name: String,    
        seq: Number,
        matchid: String,        
        match_id_list: Object,
        match_data: Object,    
        champion_mastery: Object
    });
 
 export const matchdata = mongoose.model("matchdata", summoner_schema); 


    export async function mongo(port) {
        mongoose.connect(process.env.MONGOURL, function(err){
          if(err){
              console.log(err);
          }
          else{
              console.log("connected to DB success!");             
              
          }
    });
      }
    
async function savematchdata(d=[],idlist=[],tempname=[]){    
    for (var k=0;k<idlist.length;k++){
        var matchids=''
        matchids=(await grabmatchids(d[k]));
        var f = await grabchampionmastery(idlist[k]);      
            for(var x=0;x<matchids.length;x++){
                var e = await grabmatchdata(matchids[x]);                                     
                //match_data1.push(e);
                const matchdata1= new matchdata({
                    seq:((x+1)),
                    name:tempname[k],
                    matchid:matchids[x],
                    match_data: e,
                    champion_mastery:f,                                                       
                });
                await matchdata1.save();
                console.log("matchid save Count:",10*k+x+1,"of",)
            }
            console.log("matchids are:",matchids);
         console.log('Data entry of summoner',k+1,'Done')       
        }    
    }


async function errorhandle(e){
    if(typeof(e)=='number'){
        console.log(e);
        console.log('Query finished..Error Code Sent to Client!')
        return e;
        
        
    }    
}


export async function process_input(name){
    var puuidList=[];
    var summonerIds=[];
    let c=await grabdata(name);    
    if(typeof(c)=='number'){
        //console.log(c);
        //console.log('Query finished..Error Code Sent to Client!')
        let a=[];
        a.push(c,'Summoner not found! Check summoner Name !');
        return a;      
    }    
    //await errorhandle(c);
    let d=await grabspectatordata(c.id);
    if(typeof(d)=='number'){
        //console.log(d);
        //console.log('Query finished..Error Code Sent to Client!')
        let a=[];
        a.push(d,'Spectator Error! Summoner is not in game right now?!');
        return a;       
    }
    //await errorhandle(d);
    for(var x=0; x<d.participants.length;x++){     
       
        var g=await grabdata(d.participants[x].summonerName)
        var temp=g; //get puuid list ,summonername list and summonerLevels
        summonerList.push(d.participants[x].summonerName)               
        puuidList.push(temp.puuid);
        summonerLevels.push(temp.summonerLevel);
        profileIconIds.push(temp.profileIconId);
        currentchampId.push(d.participants[x].championId)
        summonerIds.push(temp.id);      
    }
    
    console.log("savematchdata called");             
    await savematchdata(puuidList,summonerIds,summonerList);
    console.log("Entries Done..this function should exit",summonerList,summonerLevels);       
    let a=['randomstring']      //return garbage data to avoid error
    return a;
    //get 10 matchids for each summoner and then matchdata
    //console.log(summonerList,puuidList,summonerLevels)
}
await mongo(port).catch(err => console.log(err));

export async function test_start(inputname){     
    let i=await process_input(inputname);
    if(typeof(i[0])=='number'){
        console.log(i);
        console.log('Summoner error..Error Code Sent to the Client!')
        return i;       
    } 
    var unprocessed_data=await start(summonerList);    
    let df=await final_processing(unprocessed_data);
    console.log("Final output: ",unprocessed_data,unprocessed_data.length);       
    console.log("process data completed");    
    let bluewon= await loadmodel(df);
    console.log("Your Prediction: ",bluewon[0][0][0],bluewon);
    let payload=await datadragon(summonerList,summonerLevels,profileIconIds,currentchampId,bluewon);
    console.log("final payload is:",payload);
    await matchdata.deleteMany({});
    console.log("Collection cleared!");
    return payload;
}

    



