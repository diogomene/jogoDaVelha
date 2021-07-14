const { ENGINE_METHOD_DIGESTS } = require('constants');
const { static } = require('express');
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {
    origin: '*',
  }});
const {PORT=3000}=process.env
app.use('/public', express.static(__dirname+'/public'))
let lastState = [{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""}]
let ids = [{id:'X', state:false},{id:'O', state:false}]
function check(){
    console.log(`ckecking!: ${lastState}`)
    for(let i=0;i<lastState.length;i=i+3){
        if(lastState[i].val!="" && lastState[i].val == lastState[i+1].val && lastState[i].val==lastState[i+2].val){
            return {result: true, winner: lastState[i].val}
        }
    }
    for(let i=0;i<3;i++){

        if(lastState[i].val!="" && lastState[i].val == lastState[i+3].val && lastState[i].val == lastState[i+6].val){
            return {result: true, winner: lastState[i].val}
        }
    }
    if(lastState[0].val!="" && lastState[0].val == lastState[4].val && lastState[0].val == lastState[8].val){
        return {result: true, winner: lastState[0].val}
    }
    if(lastState[6].val!="" && lastState[6].val == lastState[4].val && lastState[6].val== lastState[2].val){
        return {result: true, winner: lastState[6].val}
    }
    return {result:false};
}
let numm=0;
io.on('connection',(socket)=>{
    console.log(socket.id)
    socket.emit('change',lastState)
    socket.on('played',data=>{
        numm++;
        console.log(numm)
        console.log(data)
        lastState[data.squareID]={state:true, val:data.myID}
        socket.broadcast.emit('change',lastState);
        socket.broadcast.emit('reliave',true);
        if(numm>4){
        let resultCheck = check();
        if(resultCheck.result){
            io.emit('winner',resultCheck.winner)
        }
        }
    })

    socket.on('reqID',d=>{
        for(id of ids){
            if(!id.state){
                socket.emit('id',id.id)
                id.state=true;
                break
            }
        }
    })

    socket.on('reset',r=>{
        lastState=[{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""},{state:false, val:""}];
        ids=[{id:'X', state:false},{id:'O', state:false}];
        io.emit('popcorn',true)
        io.emit('change',lastState);
        io.emit('reliave',true);
        numm=0;
    })
    socket.on('disconnet',()=>{
        for(id of ids){
            if(id.id==socket.get('id')){
                id.state=false;
            }
        }
    })
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
    console.log(lastState);
})
server.listen(PORT, ()=>{
    console.log(`Rodando em: ${PORT}`)
})