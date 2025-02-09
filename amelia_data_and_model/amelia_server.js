const express= require("express");
const app= express();
const https= require("node:https");
const bodyparser= require("body-parser");
var RiotRequest =require("riot-lol-api");
const { response } = require("express");
const { default: mongoose } = require("mongoose");
const {Schema}= mongoose;
var riotRequest= new RiotRequest("RGAPI-0a2c86da-29c8-4c5c-b42f-f95ba9e19d01");
var p="";
app.use(bodyparser.urlencoded({extended:true}));

console.log("this should appear only once");

///////////////////////
const summonerdata =  mongoose.model("summonerdata", summoner_schema);
const matchdata = mongoose.model("matchdata", summoner_schema); 
const summonerdata2 =  mongoose.model("summonerdata2", summoner_schema);
const matchdata2= mongoose.model("matchdata2", summoner_schema); 

  
///////////////////////////////
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ameliaDB', function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to DB success!");
        app.listen(3000, function(){
            console.log("server is up and running");
        });
    }
  });
}
//////////////////////////////



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
                    await firstsummoner.save(); 
}
async function savematchdata(d=[],tempname){    

    for(x=0;x<d.length;x++){
        var e = await grabmatchdata(d[x]);
        var f = await grabmatchtimeline(d[x]);                        
        //match_data1.push(e);
        const matchdata22= new matchdata2({
            seq:x+1,
            tagged_summoner:tempname,
            matchid:d[x],
            match_data: e, 
            match_timeline:f                                            
        });
        await matchdata22.save();
        console.log("matchid save Count:",x+1,"of",d.length)
}}


            app.post("/", function (req, res) {                
                var summoner_name = req.body.sname;  
               
                
                async function order(){         
                    var c= await grabdata(summoner_name); //summoner data           
                    await savesummonerdata(c); 
                    const first_summoner_data_doc= await summonerdata2.findOne({});                  

                    await savematchdata(first_summoner_data_doc.match_id_list,first_summoner_data_doc.name);  
                    const first_summoner_puuid_list_doc= await matchdata2.findOne({});     
                    
                    console.log("first"+first_summoner_data_doc.match_id_list.length+"entries done...Receiving data for all matches's participants");

                    for(i=0;i<10;i++){
                        if(first_summoner_puuid_list_doc.match_timeline.metadata.participants[i]==first_summoner_data_doc.summoner_by_name.puuid){
                            continue;
                        }
                        else{
                            console.log("Batch: "+(i+1)+" of 10 started");
                        let c= await grabdatabypuuid(first_summoner_puuid_list_doc.match_timeline.metadata.participants[i])
                        await savesummonerdata(c);
                        let temp_doc=await summonerdata2.findOne({"summoner_by_name.puuid":first_summoner_puuid_list_doc.match_timeline.metadata.participants[i]});
                        
                        if(matchdata2.findOne({matchid:first_summoner_puuid_list_doc.match_timeline.metadata.participants[i]})){
                           console.log("Duplicate Match ID found");
                           //linking needs to be done
                        }                        
                        
                        await savematchdata(temp_doc.match_id_list,temp_doc.name);
                        console.log("Batch Complete!");

                        }
                    } 
                };                
                order();
            });

        
        
                    
                               
                
                    
                    
                    
                    
            
         
            
    
    

        
