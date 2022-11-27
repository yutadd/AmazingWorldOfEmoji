import { useState, useContext, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { orange, purple } from "@mui/material/colors";
import ShowDetailRight from "./ShowDetailRight";
import { Context } from "./App";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageComponent from "./ImageComponent";
import { Card } from "@mui/material";
import { Block } from "@material-ui/icons";
export default function CommentCard(property: any) {
  let name = property.user;
  console.log("commentcard : " + property.user);
  let json = property.json;
  console.log("json:↓");
  console.log(json);
  const [showMe, setShowMe] = useState(true);
  const [right, setRight] = useContext(Context);
  const [liked, setLiked] = useState(false);
  const [likes, setlikes] = useState(parseInt(json["likes"]));
  function postLike(cid: string) {
    console.log(cid);
    fetch("/api/share/post/like?cid=" + cid, { method: "POST" }).then((e) =>
      e.text().then((t) => {
        if (t == "OK") {
          setlikes((plikes) => plikes + 1);
          setLiked(true);
        } else {
          alert("ログインして実行してください。");
        }
      })
    );
  }
  const ignoreOnce = useRef<boolean>(false);
  const analyze = async (originaltxt: string, index: number): Promise<any> => {
    if (originaltxt.charAt(index) !== "'") {
      if (originaltxt.charAt(index) === "§") {
        console.log("there is" + index);
        if (!ignoreOnce.current) {
          let name = "";
          for (let f = index + 1; f < originaltxt.length; f++) {
            if (originaltxt.charAt(f) === "§") {
              const promise = await fetch(
                "/api/share/get/getEmojiDetail?path=" + name
              );
              const emojijson = await promise.json();

              return (
                '<img width="25"src="/api/share/get/emoji?emoji=' +
                name +
                "&type=" +
                emojijson["type"] +
                '" />' +
                (f <= originaltxt.length
                  ? await analyze(originaltxt, f + 1)
                  : "")
              );
            } else {
              name = name + originaltxt.charAt(f);
            }
          }
        } else {
          ignoreOnce.current = false;
        }
      }
    } else {
      ignoreOnce.current = true;
      if (originaltxt.charAt(index + 1) === ":") {
        index += 1;
        return (
          "':" +
          (index < originaltxt.length
            ? await analyze(originaltxt, index + 1)
            : "")
        );
      }
    }
    return (
      originaltxt.charAt(index) +
      (index < originaltxt.length ? await analyze(originaltxt, index + 1) : "")
    );
  };
  const [parsedText, setParsedText] = useState("");
  function update() {
    fetch(
      "/api/share/get/comment?cid=" + json["commentInfo"]["commentid"]
    ).then((e) => {
      e.json().then((newJson) => {
        if (newJson.length == 0) {
          setShowMe(false);
        } else {
          json = newJson;
          if (newJson["liked"] === "true") {
            setLiked(true);
          } else {
            setLiked(false);
          }
          setlikes(parseInt(json["likes"]));
        }
      });
    });
  }
  function sdr() {
    setRight(<ShowDetailRight name={name} json={json} />);
  }
  useEffect(() => {
    const parse = async () => {
      setParsedText(await analyze(json["commentInfo"]["text"], 0));
      console.log("翻訳完了");
    };
    parse();
    if (json["liked"] === "true") {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setInterval(() => {
      update();
    }, 5000);
  }, []);
  return (
    <Paper
      key={json["commentInfo"]["commentid"]}
      style={{
        display: showMe ? "block" : "none",
        maxHeight: "50vh",
        overflowY: "hidden",
      }}
      sx={{
        mt: "0.8vh", //margin-y 8px
        mx: 1, //margin-x
        p: 2, //padding 16px
      }}
    >
      <Grid container wrap="nowrap" spacing={2}>
        <Grid sx={{ ml: "1vw", mt: "1vh" }}>
          <Avatar>{name.charAt(0)}</Avatar>

          {liked ? (
            <IconButton sx={{ color: purple[500], mt: "1vh" }} disabled>
              <FavoriteIcon sx={{ color: purple[500], mt: "1vh" }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={(e) => {
                postLike(json["commentInfo"]["commentid"]);
              }}
              sx={{ color: purple[500], mt: "1vh" }}
            >
              <FavoriteBorderIcon sx={{ color: purple[500], mt: "1vh" }} />
            </IconButton>
          )}
          <Typography
            textAlign={"center"}
            sx={{ mt: "-1vh" }}
            color="common.red"
          >
            {likes}
          </Typography>
        </Grid>
        <Grid width={"100%"} sx={{ my: "0", mx: "1vw" }}>
          <p className="name">{name}</p>
          <p className="user-id">{json["userid"]}</p>
          <Typography
            onClick={() => {
              sdr(); // show detail right
              console.log("clicked :" + json["commentInfo"]["text"]);
            }}
            className="message"
            style={{ wordBreak: "break-word", maxHeight: "5vh" }}
            sx={{ mt: "1vh" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: parsedText,
              }}
            ></div>
          </Typography>
          <Grid
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "5vh",
              textAlign: "center",
              marginTop: "1vh",
            }}
          >
            <Typography
              style={{
                minWidth: "100%",
                display: "block",
                textAlign: "center",
                fontSize: "0.7rem",
                backgroundColor: "white",
              }}
              onClick={() => {
                sdr(); //show detail right
              }}
            >
              Click here to see details
            </Typography>
            <ImageComponent json={json}></ImageComponent>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
