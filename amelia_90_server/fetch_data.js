//import {summonerList} from './process_data.js'
import { process_input,summonerList, summonerLevels,mongo,port,matchdata, profileIconIds, currentchampId } from './process_data.js';
import {datadragon} from './final_object.js'
import * as ss from 'simple-statistics';
import { loadmodel } from './predict.js';


let blue_team_levels=[];
let red_team_levels=[];

async function fetchData(summonername){
    var kills=[];
    var damage=[];
    var assist=[];
    var points=[];
    let championIds=[];
    let finalsummonerData=[];   
    let matchinfo = await matchdata.aggregate([{ $match: {"name":summonername, "match_data.info.participants":{ "$elemMatch": { "$and": [{ "summonerName": summonername }] } } } }, { "$project": {"match_data.info.participants": { "$filter": { "input": "$match_data.info.participants", "as": "champion_mastery", "cond": { "$and": [{ "$eq": ["$$champion_mastery.summonerName", summonername] }] } } } } }])
    //console.dir((matchinfo[0].match_data.info.participants[0].kills));
    console.log(summonername);
    for(var t=0;t<matchinfo.length;t++){        
        championIds.push(matchinfo[t].match_data.info.participants[0].championId);
        kills.push((matchinfo[t].match_data.info.participants[0].kills));
        damage.push((matchinfo[t].match_data.info.participants[0].totalDamageDealtToChampions));
        assist.push((matchinfo[t].match_data.info.participants[0].assists));  
      }
        //console.log("docs length",matchinfo.length); 
       //console.log("kda and champids list:", championIds,kills,damage,assist);
    for(var f=0;f<championIds.length;f++){
        let champ_points = await matchdata.aggregate([{ $match: {"name":summonername,"seq":1, "champion_mastery":
        { "$elemMatch": { "$and": [{ "championId": championIds[f] }] } } } },
         { "$project": {"champion_mastery": { "$filter": { "input": "$champion_mastery",
          "as": "champion_mastery","cond":
           { "$and": [{ "$eq": ["$$champion_mastery.championId", championIds[f]]}]}}}} }]);
        
        points.push(champ_points[0].champion_mastery[0].championPoints);
        //console.log(champ_points[0].champion_mastery[0].championPoints);        
        }
    console.log(points);
    
    blue_team_levels=summonerLevels.slice(0,Math.ceil(summonerLevels.length/2));
    red_team_levels=summonerLevels.slice(Math.ceil(summonerLevels.length/2),(summonerLevels.length));
    console.log("levels arrays:",blue_team_levels,red_team_levels,summonerLevels);
    
    if(points.length==0){
      points.push(100000)
    }
    finalsummonerData=[Math.round(ss.mean(points)),    //get avg champ mastery points
                      Math.round(ss.mean(kills)), 
                      Math.round(ss.mean(damage)), 
                      Math.round(ss.mean(assist))];    
    console.log("processed data for",summonername,"is: ",finalsummonerData);
    return (finalsummonerData)    
}

export async function final_processing(rec){
  let blue_mastery=[];
  let red_mastery=[];
  let blue_k_d_a=[];
  let red_k_d_a=[];
  let blue_k=[];
  let blue_d=[];
  let blue_a=[];
  let red_k=[];let red_d=[];let red_a=[];
  let final_df=[];
  for(var b=0;b<5;b++){    
  blue_mastery.push(rec[b][0]);
  rec[b].splice(0,1);
  red_mastery.push(rec[b+5][0]);
  rec[b+5].splice(0,1);
  }
  let blue_team_half_levels=blue_team_levels.concat([ss.sampleKurtosis(blue_team_levels),ss.sampleSkewness(blue_team_levels),ss.mean(blue_team_levels),
    ss.sampleVariance(blue_team_levels),ss.sampleStandardDeviation(blue_team_levels),ss.median(blue_team_levels)])
  let red_team_half_levels=red_team_levels.concat([ss.sampleKurtosis(red_team_levels),ss.sampleSkewness(red_team_levels),ss.mean(red_team_levels),
    ss.sampleVariance(red_team_levels),ss.sampleStandardDeviation(red_team_levels),ss.median(red_team_levels)])

  let blue_team_half_mastery=blue_mastery.concat([ss.sampleKurtosis(blue_mastery),ss.sampleSkewness(blue_mastery),ss.mean(blue_mastery),
    ss.sampleVariance(blue_mastery),ss.sampleStandardDeviation(blue_mastery),ss.median(blue_mastery)])
  let red_team_half_mastery=red_mastery.concat([ss.sampleKurtosis(red_mastery),ss.sampleSkewness(red_mastery),ss.mean(red_mastery),
    ss.sampleVariance(red_mastery),ss.sampleStandardDeviation(red_mastery),ss.median(red_mastery)])
  
  //console.log("blue and red mastery: ",blue_mastery,red_mastery);
  for(var u=0;u<5;u++){
     blue_k.push(rec[u][0]);
     blue_d.push(rec[u][1]);
     blue_a.push(rec[u][2]);
    red_k.push(rec[u+5][0]);
    red_d.push(rec[u+5][1]);
    red_a.push(rec[u+5][2]);    
  }
  blue_k_d_a=blue_k.concat(blue_d,blue_a);
  red_k_d_a=red_k.concat(red_d,red_a);
  
  final_df=blue_team_half_levels.concat(blue_team_half_mastery,blue_k_d_a,red_team_half_levels,red_team_half_mastery,red_k_d_a);

  console.log("blue and red kda:",blue_k_d_a,red_k_d_a);
  console.dir(final_df,{maxArrayLength:null});
  blue_team_levels=[];
  red_team_levels=[];
    return final_df;
}


export async function start(list=[]){
  let summonerData=[];
  for(var g=0;g<list.length;g++){
    let j=await fetchData(list[g]);
    summonerData.push(j);
  }
  return summonerData;   
}