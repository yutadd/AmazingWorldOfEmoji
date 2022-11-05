import React, { useState,useEffect } from 'react';
import logo from './logo.svg';
import {Home1} from './logged-in/Home';
import {Home2} from './log-out/Home';
import './App.css';



const App =()=>{
  const [home,setHome]=useState(<Home2 />);
  useEffect(()=>{
    fetch("/api/user/get/logged",{mode:'cors'})
    .then(r=>{
      console.log(r.text);
      if(r.ok){
        if(r.text.toString()==="true"){
          setHome(<Home1 />);
        }else{
          setHome(<Home2 />);
        }
      }else{
        alert('認証用のサーバーへ接続できませんでした。');
        setHome(<Home2 />);
      }
    }).catch(e=>{
      alert('認証用のサーバーへ接続できませんでした。');
        setHome(<Home2 />);
    }
    )
    },[])
    return (
      <div className='App'>
        {home}
      </div>
    );
  }



export default App;
