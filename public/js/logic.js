const link = "http://9cca61a4312b.ngrok.io"
let socket = io.connect(link);
let turn = true;
let identity = null;
const quadros = document.getElementsByClassName('square');
for (var i = 0; i < quadros.length; i++) {

    quadros[i].addEventListener('click', change, false);
    quadros[i].innerHTML=""

}
const btn = document.getElementById('rst')
btn.addEventListener('click',reset)
if(identity==null){
    socket.emit('reqID',"kk")
}

socket.on('id',id=>{identity=id})
socket.on('change', (r)=>{render(r)});
socket.on('reliave',d=>turn=true)
socket.on('popcorn',r=>location.reload())
socket.on('winner', r=>{
    if(r==identity){r="Você"}
    alert(`${r} Ganhou!`)
})
function change(){
    console.log(this.innerHTML)
    if(turn && identity!=null){
    if(this.innerHTML==""){
    this.innerHTML=identity;
    socket.emit('played', {squareID:this.getAttribute('square-id'), myID:identity});
    turn = false
    }
    }
}
function reset(){
    socket.emit('reset',true), location.reload()
}
function render(r){
    console.log(r)
    for(let i=0; i<r.length; i++){
        if(r[i]){
        if(r[i].state){
            quadros[i].innerHTML=r[i].val;
        }else{
            quadros[i].innerHTML="";
        }
        }
    }
    
}
