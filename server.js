const ACTIONS=require('./src/Actions');
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const {Server}=require('socket.io');

const server=http.createServer(app);
const io=new Server(server);

app.use(express.static('build'));

app.use((req,res,next) => {
    res.sendFile(path.join(__dirname,"build","index.html"));
})

const userSocketMap = {};
function getAllConnectedClients(roomID){
    return Array.from(io.sockets.adapter.rooms.get(roomID || [])).map((socketID)=>{
        return{
            socketID,
            username:userSocketMap[socketID],
        }
    });
};

io.on('connection', (socket) =>{
    console.log(socket.id);
    socket.on(ACTIONS.JOIN,({roomID,username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomID);
        const clients=getAllConnectedClients(roomID);
        clients.forEach(({socketID})=>{
            io.to(socketID).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketID:socket.id,
            });
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomID, code }) => {
        socket.in(roomID).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketID, code }) => {
        io.to(socketID).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomID) => {
            socket.in(roomID).emit(ACTIONS.DISCONNECTED, {
                socketID: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
})


const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});