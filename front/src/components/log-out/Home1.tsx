import React,{useState,useEffect, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import "./Home1.css"
import {RightContext} from "../App"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Box from '@mui/material/Box';



function Home1(){
    const [right,setRight]=useContext(RightContext);
    const [left,setLeft]=useState([<div id="cards"></div>]);
    function json2yaml(detail:JSON):JSX.Element[]{
        const YAML=require('yaml');
        const doc=new YAML.Document();
        doc.contents=detail;
        let ret:JSX.Element[]=[]
  let spl:string[]=doc.toString().split("\n");
  spl.map(e=>{
    ret.push(<React.Fragment key={e}>{e}<br /></React.Fragment>);
  })
        return ret;
      }
    function showDetailRight(name:string,json:any){
        console.log("called showdr\t"+json["any"]);
              setRight(
                <Card sx={{ mt:"1vh"}}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe">
                      {name.charAt(0)}
                    </Avatar>
                  }
                  title={name}
                  subheader={json["uid"]}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={"https://i.pinimg.com/originals/e5/15/ef/e515efa787e87387a6223f103c39913b.jpg"}//将来的にはこのコメントに付属された画像を表示する。
                  alt="Paella dish"
                />
                <CardContent>
                <Grid width={"90%"} sx={{my:"0",mx:"1vw"}} xs>
                <Typography style={{wordBreak:"break-word"}}className='message' sx={{mt:"2vh"}}>
                    {json2yaml(json)}
                </Typography>
                </Grid>
                </CardContent>
                <CardActions disableSpacing>
                </CardActions>
              </Card>
              );
           
    }
    function postLike(cid:string){
        console.log(cid)
        fetch("/api/share/post/like?cid="+cid,{method:'POST'}).then(e=>e.text().then(t=>alert(t)));
    }
    function card(name:string,json:any){
        console.log(name)
        return(
            <Paper
                sx={{
                mt: "0.8vh",//margin-y 8px
                mx: 1,//margin-x
                p: 2,//padding 16px
                }}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid sx={{ml:"1vw",mt:"1vh"}}>
                        <Avatar>{name.charAt(0)}</Avatar>
                        <IconButton onClick={()=>postLike(json["commentID"])} sx={{mt:"1vh",ml:"0.2vw"}}><FavoriteBorderIcon></FavoriteBorderIcon></IconButton>
                    </Grid>
                    <Grid width={"auto"} sx={{my:"0",mx:"1vw"}} xs>
                        <p className='name'>{name}</p>
                        <p className='user-id'>{json["userID"]}</p>
                        <Typography onClick={()=>showDetailRight(name,json)} className='message'style={{wordBreak:"break-word"}} sx={{mt:"1vh"}}>{json["text"]}</Typography>
                    </Grid>
                </Grid>
            </Paper>);
    }
    
    function update(){
        let _cards=[<></>];
        fetch("/api/share/get/comments").then(promise=>{
            promise.json().then((json)=>{
            for(let a=0;a<json.length;a++){
                let uid=json[a]["userID"];
                fetch("/api/share/get/getuser?uid="+uid,{mode:'cors'}).then(prename=>{
                    prename.json().then(user=>{
                        let entity=card(user["name"],json[a]);
                        _cards=[..._cards,entity];
                        setLeft(_cards);//then以降はおそらく非同期実行だから、ここでないとからの配列でcardsが上書きされてしまう。
                    })
                })
            }

        })
         
    })
    }
    useEffect(()=>{
   update();
        
    },[])
    return(
    <>
        <Box sx={{pt:"1vh"}} className="left">
            {left}
        </Box>
        <Box className="left">
            {right}
        </Box>
    </>
);
}
export default Home1;