const express= require("express");
const app= express();
const https= require("node:https");
const bodyparser= require("body-parser");
var RiotRequest =require("riot-lol-api");
const { response } = require("express");
const { default: mongoose } = require("mongoose");
const {Schema}= mongoose;
const axios = require("axios");
const cheerio = require("cheerio");
var riotRequest= new RiotRequest("RGAPI-81eaa2e3-30c2-4875-b916-e99d2427a2ee");
var p="";
app.use(bodyparser.urlencoded({extended:true}));

console.log("this should appear only once");
const summoner_schema = new mongoose.Schema({
    name: String,
    winrate:String,
    seq: Number,
    matchid: String,
    tagged_summoner:[String],
    summoner_by_name: Object,
    match_id_list: Object,
    match_data: Object,
    match_timeline: Object,
    champion_mastery: Object
});
///////////////////////
const summonerdata2=  mongoose.model("summonerdata2", summoner_schema);
const matchdata2 = mongoose.model("matchdata2", summoner_schema); 


  
///////////////////////////////
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ameliaDB', function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to DB success!");
    }
  });
}
//////////////////////////////


app.listen(4000, function(){
    console.log("server is up and running");
});
app.get("/",function(req,res){
    res.sendFile(__dirname +"/index.html");
});
//////////////////////


async function grabdata(summoner_name){    
return new Promise((resolve)=>{
    riotRequest.request('euw1', 'summoner', '/lol/summoner/v4/summoners/by-name/'+ summoner_name, function (err, data) {
        //console.log(data);        
        resolve(data);
        })
})
};

async function grabdatabypuuid(puuid){    
    return new Promise((resolve)=>{
        riotRequest.request('euw1', 'summoner', '/lol/summoner/v4/summoners/by-puuid/'+ puuid, function (err, data) {
            //console.log(data);        
            resolve(data);
            })
    })
    };

async function grabmatchids(puuid){
    return new Promise((resolve)=>{
        riotRequest.request('europe', 'puuid', '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?count=100', function (err, response1) {
        resolve(response1);
    })
    })
}
async function grabmatchdata(matchid){
    return new Promise((resolve)=>{
        riotRequest.request('europe', 'matchid', '/lol/match/v5/matches/' + matchid ,function (err, response1) {
            resolve(response1);
        })
    })
}
async function grabmatchtimeline(matchid){
    return new Promise((resolve)=>{
        riotRequest.request('europe', 'matchid', '/lol/match/v5/matches/'+matchid+'/timeline',function (err, response1) {
            resolve(response1);
        })
    })
}
async function grabchampionmastery(matchid){
    return new Promise((resolve)=>{
        riotRequest.request('euw1', 'matchid', '/lol/champion-mastery/v4/champion-masteries/by-summoner/'+matchid,function (err, response1) {
            resolve(response1);
        })
    })
}
async function savesummonerdatafrompuuid(puuid,first_summoner_puuid_list_doc,){
    
        
        let c= await grabdatabypuuid(first_summoner_puuid_list_doc.match_timeline.metadata.participants[i])
        await savesummonerdata(c);
        let temp_doc=await summonerdata2.findOne({"summoner_by_name.puuid":first_summoner_puuid_list_doc.match_timeline.metadata.participants[i]});
              

        
    
}


async function savesummonerdata(temp=[]){
                        
                    //var tempr= JSON.parse(c);                              
                    var d= await grabmatchids(temp.puuid); //matchids array   
                    var k= await grabchampionmastery(temp.id);                 
                    const firstsummoner = new summonerdata2({
                        name:temp.name,
                        summoner_by_name: temp,
                        match_id_list:d,
                        champion_mastery:k                                           
                    });
                    await firstsummoner.save(function(err){
                        if(err){
                            if(err.name=== 'MongoError' && err.code===11000){
                                console.log("")
                            }
                        }
                    }); 
}


// async function removeduplicate(){
//     let docs =await matchdata.aggregate([{ "$group": { _id: { name: "$name" },
//      dups: { $addToSet: "$_id" }, count: { $sum: 1 } } }]).forEach(function (doc){
//         doc.dups.shift();
//         matchdata.remove({ _id: { $in: doc.dups } }); //duplicateion removed from sommonerdatas collection
//         // return doc;
//         });
// }



app.post("/", function (req, res) {                
    //var summoner_name = req.body.sname;  
 
    async function order(){         
        //var c= await grabdata(summoner_name); //summoner data           
        //await savesummonerdata(c); 
        //const first_summoner_data_doc= await summonerdata.findOne({});
        console.log("order function executed");
        //var matchidcount= await matchdata.countDocuments();
        const matchdata_doc= await matchdata2.find({},"match_data.metadata.participants").exec();
            //const summonerdoc=await summonerdata.find();
        let checklist=[];
        const summonerdoc=await summonerdata2.find({},"summoner_by_name.puuid").exec();
            summonerdoc.forEach(function(element){
                checklist.push(element.summoner_by_name.puuid);
            });
            console.log("checklist length ",checklist.length)
        for(u=0;u<matchdata_doc.length;u++){
            //matchdata_current= matchdata_doc[u];
            console.log("New doc received");       
            
            //const puuidsummonerlist=await summonerdata.find();
            const puuidlist= matchdata_doc[u].match_data.metadata.participants;
            console.log("puuidlist acquired",puuidlist.length); 
            console.log("Doc ",u+1,"of ",matchdata_doc.length);   
            //////////////////////////////////////////////  
            for(x=0;x<10;x++){
                    var flag=  await (summonerdata2.findOne({"summoner_by_name.puuid":puuidlist[x]}))
                    if(Boolean(flag)){
                        console.log("skipping..duplicate name exists");
                        }
                    else
                    {
                        console.log(puuidlist[x])
                        var c= await grabdatabypuuid(puuidlist[x]);
                        var d= await grabmatchids(c.puuid); //matchids array   
                        var k= await grabchampionmastery(c.id);        
                        //console.log(c)         
                        const firstsummoner = new summonerdata2({
                        name:c.name,
                        summoner_by_name: c,
                        match_id_list:d,
                        champion_mastery:k                                           
                        });
                        firstsummoner.save(function(err){
                        if(err){
                            if(err.name=== 'MongoError' && err.code===11000){
                                console.log("duplicate Entry attempt!! skipping..");                                
                            }                            
                        }
                        });
                        console.log("PUUID",x+1,"of 10 added");   
                    }

                  
                        
        }  
    }
}
 
    order();
    //removeduplicate();
});