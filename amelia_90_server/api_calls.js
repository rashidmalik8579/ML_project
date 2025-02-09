import RiotRequest from "riot-lol-api";
import dotenv from 'dotenv';
dotenv.config();
var riotRequest= new RiotRequest(process.env.KEY);


export async function grabdata(summoner_name){    
    return new Promise((resolve)=>{
        let encName = encodeURI(summoner_name);
        riotRequest.request('euw1', 'summoner', '/lol/summoner/v4/summoners/by-name/'+encName, function (err, data) {
            if(!err){        
            resolve(data);
            }
            else{
                resolve(err.statusCode);
            }            
            })
    })
    };


export async function grabspectatordata(enc_id){
    return new Promise((resolve)=>{
        riotRequest.request('euw1', 'summoner', '/lol/spectator/v4/active-games/by-summoner/'+ enc_id, function (err, data) {
            if(!err){        
            resolve(data);
            }
            else{
                resolve(err.statusCode);
            }            
            })
    })

}
export async function grabdatabypuuid(puuid){    
        return new Promise((resolve)=>{
            riotRequest.request('euw1', 'summoner', '/lol/summoner/v4/summoners/by-puuid/'+ puuid, function (err, data) {
            if(!err){    
                resolve(data);
            }
            else{resolve(err.statusCode);
                }
            })
        })
        };

export async function grabmatchids(puuid){
            return new Promise((resolve)=>{
            riotRequest.request('europe', 'puuid', '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?count=9', function (err, response1) {
                if(!err){
                    resolve(response1);
            }
            else{
                resolve(err.statusCode)
            }
            })
        })
        };

export async function grabchampionmastery(matchid){
            return new Promise((resolve)=>{
                riotRequest.request('euw1', 'matchid', '/lol/champion-mastery/v4/champion-masteries/by-summoner/'+matchid,function (err, response1) {
                    if(!err){
                        resolve(response1);
                }
                else{
                    resolve(err.statusCode)
                  }})
            })
        };

export async function grabmatchdata(matchid){
    return new Promise((resolve)=>{
        riotRequest.request('europe', 'matchid', '/lol/match/v5/matches/' + matchid ,function (err, response1) {
            if(!err){
                resolve(response1);
        }
        else{
            resolve(err.statusCode);
        }
    })
    })
};




