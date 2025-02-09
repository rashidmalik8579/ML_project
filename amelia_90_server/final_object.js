import axios from 'axios';
import {profileIconIds,summonerLevels,summonerList,currentchampId} from './process_data.js';

function getchampname(champlist,currentchampId,i){
        for(const k in champlist){
            if(champlist[k].key==currentchampId[i]){
                let champname=champlist[k].id;
                return champname;
            }
        }
}



export async function datadragon(names=[],levels=[],iconlist=[],currentchampids=[],win){
    let version=await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    
    version=version.data[0];
    console.log(version);
    let champlist= await axios.get('http://ddragon.leagueoflegends.com/cdn/'+version+'/data/en_US/champion.json');
    champlist=champlist.data.data;
    let summoner=[];
    for(var i=0;i<10;i++){
        var c=getchampname(champlist,currentchampids,i);
        let summonerobj={
                name:names[i],
                profileicon:'http://ddragon.leagueoflegends.com/cdn/12.20.1/img/profileicon/'+iconlist[i]+'.png',
                champicon:'http://ddragon.leagueoflegends.com/cdn/'+version+'/img/champion/'+c+'.png',
                champ:c,
                level:levels[i],                
            }
            summoner.push(summonerobj);
           
        }
    summoner.push(win);
    profileIconIds.length=0;summonerLevels.length=0;summonerList.length=0;currentchampId.length=0;

    return summoner;

}