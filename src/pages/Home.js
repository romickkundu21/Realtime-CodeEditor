import React,{useState}  from 'react';
import {v4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const [roomID,setRoomID]=useState('');
    const [username,setUsername]=useState('');
    const createNewRoom=(e) => {
        e.preventDefault();
        const id=v4();
        setRoomID(id);
        toast.success('Created new room');
    }

    const joinRoom= () => {
        if(!roomID || !username){
            toast.error('Room ID & username is required');
            return;
        }
        navigate(`/editor/${roomID}`,{
            state:{
                username
            }
        });
    }

    const handleKeyEnter = (e) => {
        if(e.code === 'Enter'){
            joinRoom();
        }
    }

  return (
    <div className="homePageWrapper"> 
        <div className="formWrapper">
            <div className="logoWrapper">
                <img src="/editor-logo.png" alt="editor-logo" className="homePageLogo"/>
                <h2>CODE EDITOR</h2>
            </div>
            <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
            <div className="inputGroup">
                <input type="text" className="InputBox" placeholder="Room ID" onChange={(e)=>{setRoomID(e.target.value)}} value={roomID} onKeyUp={handleKeyEnter}/>
                <input type="text" className="InputBox" placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}} value={username} onKeyUp={handleKeyEnter}/>
                <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                <span className="createInfo">If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href="/" className="createNewBtn">new room</a>
                </span> 
            </div>
        </div>
    </div>
  )
}

export default Home