import  { useState,useEffect, createContext } from "react";
import Header1 from './log-out/Header1';
import Header2 from './logged-in/Header2';
import Home1 from './log-out/Home1';
import Paper from "@mui/material/Paper";
import './App.css';
export type Right=[
  right:any,
  setRight:any
];
const shoki:Right=[null,null];
export const RightContext= createContext(shoki);
function App(){
  const [right,setRight]=useState(<><Paper
    sx={{
    mt: "0.8vh",//margin-y 8px
    mx: 1,//margin-x
    p: 2,//padding 16px
    }}>検索結果やクリックしたコメント、ユーザーの詳細情報がこちらに表示されます。</Paper></>);
  const init:Right=[
    right,setRight
  ]
  const [header,setHeader]=useState(<Header1 />);
  const [home,setHome]=useState(<></>);
  useEffect(()=>{
    fetch("/api/user/get/logged",{mode:'cors'})
    .then(r=>{
      r.text().then(bool=>{
        console.log(bool);
        if(bool==="true"){
          setHeader(<Header2/>);
        }else{
          setHeader(<Header1 />);
          setHome(<Home1/>);
        }
      })
      
    })
    },[])/*
    ログイン別ヘッダー
    
    */

    return (<>
    <RightContext.Provider value={init}>
      <header>
        {header}
      </header>
        {home}
    </RightContext.Provider>
        </>
    );
  }



export default App;
