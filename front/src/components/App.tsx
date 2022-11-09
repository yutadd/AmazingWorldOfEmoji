import  { useState,useEffect } from "react";
import Header1 from './log-out/Header1';
import Header2 from './logged-in/Header2';
import Left1 from './log-out/Home1';
import './App.css';



function App(){
  const [home,setHome]=useState(<Header1 />);
  const [left,setLeft]=useState(<></>);
  const [right,setRight]=useState(<><h1 style={{padding:"2vh"}}>検索結果やクリックしたコメントやユーザーの詳細情報が表示されます。</h1></>);
  useEffect(()=>{
    fetch("/api/user/get/logged",{mode:'cors'})
    .then(r=>{
      r.text().then(bool=>{
        console.log(bool);
        if(bool==="true"){
          setHome(<Header2/>);
        }else{
          setHome(<Header1 />);
          setLeft(<Left1 setRight={setRight} right={right} />);
        }
      })
      
    })
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
