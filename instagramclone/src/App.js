import React, { useState, useEffect } from 'react'
import './App.css'
import Post from './Post'
import { db, auth } from "./firebase"
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import ImageUpload from './imageUpload';
import axios from './axios';
import Pusher from 'pusher-js';




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, username]);

  const fetchPosts = async () => 
      await axios.get('/sync').then(response => {
      console.log(response);
      setPosts(response.data)
    });

  useEffect(() => {
    const pusher = new Pusher('a4ffa2f417a27b053fcc', {
      cluster: 'us2'
    });
    
    const channel = pusher.subscribe('posts');
    channel.bind('inserted', (data) =>  {
      console.log("data recieved", data);
      fetchPosts();     
    });
  }, []) 

  useEffect(() => {
      

      fetchPosts();
  }, []);

  console.log('posts are >>>', posts)

  const signUp = (event) => {
    event.preventDefault();
    
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">       
      <Modal
       open={open}
       onClose={() => setOpen(false)}
       >

        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            />
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="Submit" onClick={signUp}>Sign Up</Button>
            </form>
        </div>
      </Modal>
      
      <Modal
       open={openSignIn}
       onClose={() => setOpen(false)}
       >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            />
            </center>            
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="Submit" onClick={signIn}>Sign In</Button>
            </form>
        </div>
      </Modal>
         
      <div className="app">
        <div className ="app__header">
          <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          />         
          
          {user ? (
        <Button className="upload__logout" onClick={() => auth.signOut()}>Logout</Button> 
            
        ): (
          <div className="app__loginContainer">
           <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
           <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>    
        )}
      </div>
      <div className="upload__container">
          {user?.displayName ? (
          <ImageUpload username={user.displayName} />
           ) : (
          <h3>Sorry you need to login to upload</h3>       
           )}
      </div>

      <div className="app__posts"> {
        posts.map((post) => (
          <Post 
          key={post._id} 
          postId={post._id} 
          user={user} 
          username={post.user} 
          caption={post.caption} 
          imageUrl={post.image}
          />
        ))
       }
      </div>
    </div>      
   </div>
  )
}

export default App
