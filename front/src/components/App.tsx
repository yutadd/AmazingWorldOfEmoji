import React, { useState,useEffect } from "react";
import Header1 from './log-out/Header1';
import Header2 from './logged-in/Header2';
import Left1 from './log-out/Home1';
import Grid from "@mui/material/Grid"
import './App.css';



function App(){
  const [home,setHome]=useState(<Header1 />);
  
  const [left,setLeft]=useState(<Left1/>);
  useEffect(()=>{
    fetch("/api/user/get/logged",{mode:'cors'})
    .then(r=>{
      console.log(r.text);
      if(r.ok){
        if(r.text.toString()==="true"){
          setHome(<Header2/>);
        }else{
          setHome(<Header1 />);
          setLeft(<Left1/>);
        }
      }else{
        alert('認証用のサーバーへ接続できませんでした。');
        setHome(<Header1 />);
        setLeft(<Left1 />);
      }
    }).catch(e=>{
      alert('認証用のサーバーへ接続できませんでした。');
        setHome(<Header1 />);
        setLeft(<Left1 />);
    }
    )
    },[])/*
    ログイン別ヘッダー
    
    */

    return (<>
        <header>
          {home}
        </header>
        {left}
        </>
    );
  }



export default App;
