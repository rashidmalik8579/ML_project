import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import {mongo,port,test_start} from './process_data.js'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app= express();
app.use(cors({ origin: true}));
app.use(bodyparser.urlencoded({extended:true}));
app.use('/model',express.static(__dirname+'/amelia_model'));

app.listen(port, function(){
    console.log("server is up and running");
})

app.get("/", function (req, res){
    res.send("<p> Server is Up</p>");
    console.log('page sent')    
})

app.use(bodyparser.json());

mongo(port).catch(err => console.log(err));

app.post("/", async (req, res)=>{
    const summoner=req.body.summonerName;
    const serv=req.body.server;
    const p= req.body.p;
    console.log("request received",summoner,serv);
    async function process(){       
       console.log(summoner,serv);
    }    
    res.json(await test_start(summoner));
    console.log("Query Finished! Server is ready to receive new request!!")
    
});