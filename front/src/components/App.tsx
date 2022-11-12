import  { useState,useEffect, createContext } from "react";
import Header1 from './log-out/Header1';
import Header2 from './logged-in/Header2';
import Home1 from './log-out/Home1';
import Home2 from './logged-in/Home2';
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography"
import Card from '@mui/material/Card';
import './App.css';
export type ContextType=[
  right:any,
  setRight:any,
  showL:any,
  setShowL:any,
  name:string,
  setName:any
];
const shoki:ContextType=[null,null,null,null,"",null];
export const Context= createContext(shoki);
function App(){
  const [name,setName]=useState("");
  const [right,setRight]=useState(<><Paper
    sx={{
    pt: "1vh",//margin-y 8px
    mx: 1,//margin-x
    p: 2,//padding 16px
    }}>検索結果やクリックしたコメント、ユーザーの詳細情報がこちらに表示されます。</Paper></>);
    const [showL,setShowL]=useState(false);
    const [inputName,setInputName]=useState("");
    const [inputPass,setInputPass]=useState("");
    const [loginError,setLoginError]=useState("");
    let init:ContextType=[
    right,setRight,showL,setShowL,name,setName
  ]
  const [header,setHeader]=useState(<Header1 />);
  const [home,setHome]=useState(<></>);

  useEffect(()=>{
    fetch("/api/user/get/logged",{mode:'cors'})
    .then(r=>{
      r.text().then(response=>{
        console.log(response);
        let param=response.split(",");
        if(param[1]==="true"){
          console.log(param[0])
          setName(param[0])
          setHeader(<Header2/>);//ここで引数にユーザーの名前とかつければいい感じ
          setHome(<Home2 />);
        }else{
          setHeader(<Header1 />);
          setHome(<Home1/>);
        }
      })
    })
    },[])/*
    ログイン別ヘッダー
    
    */
   function loginDialog(){
    return(<Card style={{display:(showL)?"block":"none",zIndex:99,position:"absolute"}} sx={{ml:"80vw",pr:"1vw",pt:"2vh",pl:"2vw",pb:"2vh"}}>
              <TextField sx={{pb:"1vh"}}
              value={inputName}
              placeholder="userID"
              onChange={(e)=>{
                setInputName(e.target.value);
              }}></TextField>
              <TextField sx={{pb:"1vh"}}
              value={inputPass}
              placeholder="password"
              type={"password"}
              onChange={(e)=>{
                setInputPass(e.target.value);
              }}></TextField>
              <br />
              <Button variant="contained" onClick={()=>login(inputName,inputPass)}>Login</Button>
              <Typography style={{color:"red"}}>{loginError}</Typography>
          </Card>);
   }
function login(name:string,pass:string){
  fetch("/api/user/post/login?id="+name+"&pass="+pass,{method:'POST'})
  .then(e=>e.text()
  .then(t=>{
    if(t=="accepted"){
      window.location.reload()
    }else{
      setLoginError("IDかパスワードが間違っています。")
    }
  }));
}
    return (<>
    <Context.Provider value={init}>
      <header>
        {header}
      </header>
        {name==""&&loginDialog()}
              {home}
    </Context.Provider>
        </>
    );
  }



export default App;
