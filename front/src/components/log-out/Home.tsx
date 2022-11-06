import React,{ReactNode,useState} from "react";
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import  MenuItem  from "@mui/material/MenuItem/";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import zIndex from "@mui/material/styles/zIndex";
import { Autocomplete, List } from "@mui/material";

export default function Home2() {
    const [text,setText]=useState("");
    const [assist,setAssist]=useState([""]);
    return(<>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Autocomplete
        id="first"
        style={{width:'19vh'}}
        value={text}
        options={assist}
        renderInput={(params) => (
          <TextField {...params} label="clearOnEscape" variant="standard" />
        )}
        onInputChange={(e,value) => {
            setAssist([""]);
            setText(value);
            if(value!=""){
                fetch("/api/share/get/searchemoji?path="+value,{mode:'cors'}).then(result=>{
                    result.json().then((json)=>{
                        var ar=[];
                        for(var i=0;i<json.length;i++){
                            ar.push(json[i]["path"])
                        }
                        setAssist(ar);
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