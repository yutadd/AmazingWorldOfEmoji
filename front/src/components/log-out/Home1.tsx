import {useState,useEffect } from 'react';
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import "./Home1.css"

function card(name:string,message:string,uid:string,cid:string){
    console.log(name)
    console.log(message)
    console.log(uid)
    console.log(cid)
    return(
        <Paper
            sx={{
            my: 1,//margin-y 8px
            mx: 1,//margin-x
            p: 2,//padding 16px
            }}>
            <Grid container wrap="nowrap" spacing={2}>
                <Grid>
                    <Avatar>{name.charAt(0)}</Avatar>
                </Grid>
                <Grid width={"auto"} item xs>
                <p className='name'>{name}</p>
                <p className='user-id'>{uid}</p>
                    <Typography className='message'>{message}</Typography>
                </Grid>
            </Grid>
        </Paper>);
}

function Left1(value:any){
    const [cards,setCards]=useState([<div id="cards"></div>]);
    function update(){
        let _cards=[<></>];
        fetch("/api/share/get/comments").then(promise=>{
            promise.json().then((json)=>{
            for(let a=0;a<json.length;a++){
                let text=json[a]["text"];
                let cid=json[a]["commentID"];
                let uid=json[a]["userID"];
                fetch("/api/share/get/getuser?uid="+uid,{mode:'cors'}).then(prename=>{
                    prename.json().then(user=>{
                        let entity=card(user["name"],text,uid,cid);
                        _cards[a]=entity;
                        setCards(_cards);//then以降はおそらく非同期実行だから、ここでないとからの配列でcardsが上書きされてしまう。
                    })
                })
            }

        })
         
    })
    }
    useEffect(()=>{
   update();
        
    },[])
    return(<>
    <Box className="left">
    {cards}
</Box>
<Box className="left">
{value.right}
</Box>
</>);
}
export default Left1;