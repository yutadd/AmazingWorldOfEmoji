import React,{useState,useEffect } from 'react';
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import {styled} from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import "./Home1.css"
function card(name:string,message:string){
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
                    <Typography variant="h6">{name}</Typography>
                    <Typography className='message'>{message}</Typography>
                </Grid>
            </Grid>
        </Paper>);
}

function Left1(setTest: (value: React.SetStateAction<JSX.Element>) => void){
    setTest(<></>);
    const [right,setRight]=useState(<><h1 style={{padding:"2vh"}}>検索結果やクリックしたコメントやユーザーの詳細情報が表示されます。</h1></>);
    const [cards,setCards]=useState([<></>]);
    const update=()=>{
        var _cards=[<></>];
        fetch("/api/share/get/comments").then(promise=>promise.json().then((json)=>{
            for(var a=0;a<json.length;a++){
                _cards.push(card(json[a]["userID"],json[a]["text"]))
            }
            //setCards(_cards);
        }))
    }
    useEffect(()=>{
        update();
    },[])
    return(<><Box className="left">
        
    </Box>
    <Box className="left"></Box>
    </>);
}
export default Left1;