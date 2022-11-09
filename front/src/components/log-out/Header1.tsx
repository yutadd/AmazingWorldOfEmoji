import {useState,useContext} from "react";
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {RightContext} from "../App"

import { Autocomplete, useControlled} from "@mui/material";




export default function Header1() {
    const [right,setRight]=useContext(RightContext);
    const [text,setText]=useState("");
    const [assist,setAssist]=useState([""]);
    return(<>
        <Toolbar sx={{height:"6vh", borderBottom: 1, borderColor: 'divider' }}>
        <Autocomplete
        id="first"
        style={{width:'17vw'}}
        value={text}
        options={assist}
        renderInput={(params) => (
          <TextField {...params} label="emoji searcher" variant="standard" />
        )}
        onInputChange={(e,value) => {
            setText(value);
           var ar=[""];
            if(value!==""){
                fetch("/api/share/get/searchemoji?path="+value,{mode:'cors'}).then(result=>{ 
                    result.json().then((json)=>{
                        for(var i=0;i<json.length;i++){
                            ar.push(json[i]["path"])
                        }
                        setAssist([""]);
                        setAssist(ar);
                        if(json.length===1){
                          
                        }
                    });
                });
            }
            
        }}
    />
    <IconButton onClick={()=>{console.log("")}}><SearchIcon>search</SearchIcon></IconButton>
            <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{ flex: 1 }}
            >
          TheAmazingWorldOfEmoji
        </Typography><img src="icon.png" height={30}/>
        <Button size="large">log-in</Button>
        <Button variant="outlined" size="large">
          Sign up
        </Button>
      </Toolbar> 
    </>);
}