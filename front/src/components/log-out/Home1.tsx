import React,{useState,useEffect } from 'react';
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import {styled} from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import "./Home1.css"
import Props from "../App"
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
function Left1(value:any){

    const [cards,setCards]=useState([<></>]);
    const update=()=>{
        var _cards=[<></>];
        fetch("/api/share/get/comments").then(promise=>{promise.json().then((json)=>{
            for(var a=0;a<json.length;a++){
                
                _cards.push(card(json[a]["userID"],json[a]["text"]))
            }
            setCards(_cards);
            value.setRight(<><h1>ieeeeei</h1></>)
        })
    })
    }
    useEffect(()=>{
        update();
    },[])
    return(<><Box className="left">
        {cards}
    </Box>
    <Box className="left">
    {value.right}
    </Box>
    </>);
}
export default Left1;