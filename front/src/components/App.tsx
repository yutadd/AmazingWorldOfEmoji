import { useState, useEffect, createContext } from "react";
import Header1 from "./log-out/Header1";
import Header2 from "./logged-in/Header2";
import Home from "./Home";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Grid from "@mui/material/Grid";
import Post from "./Post";

import "./App.css";
export type ContextType = [
  right: any,
  setRight: any,
  showL: any,
  setShowL: any,
  showS: any,
  setShowS: any,
  name: string,
  setName: any
];
const shoki: ContextType = [
  null,
  null,
  null,
  null,
  null,
  null,
  "username",
  null,
];
export const Context = createContext(shoki);
function App() {
  const [displayId, setDisplayId] = useState("default");
  const [right, setRight] = useState(
    <>
      <Paper
        style={{ color: "#9C27B0", fontSize: "1.3vw", fontWeight: "500" }}
        sx={{
          mt: "2vh", //margin-y 8px
          mx: 1, //margin-x
          p: 2, //padding 16px
        }}
      >
        検索結果やクリックしたコメント、ユーザーの詳細情報がこちらに表示されます。
      </Paper>
    </>
  );
  const [showL, setShowL] = useState(false);
  const [inputLoginID, setLoginInputID] = useState("");
  const [inputLoginPass, setLoginInputPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [showS, setShowS] = useState(false);
  const [inputSignID, setSignInputID] = useState("");
  const [inputSignPass, setSignInputPass] = useState("");
  const [inputSignName, setSignInputName] = useState("");
  const [inputSignEmail, setSignInputEmail] = useState("");
  const [inputSignBirth, setSignInputBirth] = useState("");

  const [SignError, setSignError] = useState("");
  let init: ContextType = [
    right,
    setRight,
    showL,
    setShowL,
    showS,
    setShowS,
    displayId,
    setDisplayId,
  ];
  const [header, setHeader] = useState(<Header1 />);

  useEffect(() => {
    fetch("/api/user/get/logged", { mode: "cors" }).then((r) => {
      r.text().then((response) => {
        console.log(response);
        let param = response.split(",");
        if (param[1] === "true") {
          setDisplayId(param[0]);
          setHeader(<Header2 />); //ここで引数にユーザーの名前とかつければいい感じ
        } else {
          setHeader(<Header1 />);
        }
      });
    });
  }, []);
  function loginDialog() {
    return (
      <Card
        className="dialog"
        style={{
          right: 0,
          display: showL ? "block" : "none",
          zIndex: 99,
          position: "absolute",
        }}
      >
        <Grid style={{ textAlign: "left" }} sx={{ px: "1vw" }}>
          <TextField
            sx={{ pt: "1vh", pb: "1vh", width: "100%" }}
            autoComplete="username"
            type={"text"}
            placeholder="ID"
            onChange={(e) => {
              setLoginInputID(e.target.value);
            }}
          />
          <br />
          <TextField
            sx={{ pb: "1vh", width: "100%" }}
            autoComplete="password"
            placeholder="password"
            type={"password"}
            onChange={(e) => {
              setLoginInputPass(e.target.value);
            }}
          />

          <br />
          <Button
            sx={{ mb: "1vh" }}
            variant="contained"
            onClick={() => login(inputLoginID, inputLoginPass)}
          >
            Login&gt;&gt;
          </Button>
        </Grid>
        <Typography style={{ color: "red" }}>{loginError}</Typography>
      </Card>
    );
  }
  function signupDialog() {
    return (
      <Card
        className="dialog"
        style={{
          right: 0,
          display: showS ? "block" : "none",
          zIndex: 99,
          position: "absolute",
        }}
      >
        <Grid style={{ textAlign: "left" }} sx={{ px: "1vw" }}>
          <TextField
            sx={{ mt: "1vh", pb: "1vh", width: "100%" }}
            value={inputSignID}
            type={"text"}
            id={"name"}
            autoComplete="username"
            placeholder="userID"
            onChange={(e) => {
              setSignInputID(e.target.value);
            }}
          />
          <br />
          <TextField
            sx={{ pb: "1vh", width: "100%" }}
            value={inputSignPass}
            placeholder="password"
            autoComplete="password"
            type={"password"}
            id={"password"}
            onChange={(e) => {
              setSignInputPass(e.target.value);
            }}
          />
          <br />
          <TextField
            sx={{ pb: "1vh", width: "100%" }}
            value={inputSignName}
            placeholder="display name"
            autoComplete="name"
            type={"text"}
            id={"nickname"}
            onChange={(e) => {
              setSignInputName(e.target.value);
            }}
          />
          <br />
          <TextField
            sx={{ pb: "1vh", width: "100%" }}
            value={inputSignEmail}
            placeholder="email"
            autoComplete="email"
            type={"email"}
            id={"email"}
            onChange={(e) => {
              setSignInputEmail(e.target.value);
            }}
          />
          <br />
          <TextField
            sx={{ pb: "1vh", width: "100%" }}
            autoComplete="birthday"
            value={inputSignBirth}
            placeholder="birth"
            type={"date"}
            id={"birthday"}
            onChange={(e) => {
              setSignInputBirth(e.target.value);
            }}
          />
          <br />
          <Button
            sx={{ mb: "1vh", width: "100%" }}
            variant="contained"
            onClick={() =>
              signup(
                inputSignID,
                inputSignPass,
                inputSignName,
                inputSignEmail,
                inputSignBirth
              )
            } //TODO:　sign up に変更
          >
            SignUp&gt;&gt;
          </Button>
        </Grid>
        <Typography style={{ color: "red" }}>{SignError}</Typography>
      </Card>
    );
  }
  function login(id: string, pass: string) {
    fetch("/api/user/post/login?id=" + id + "&pass=" + pass, {
      method: "POST",
    }).then((e) =>
      e.text().then((t) => {
        if (t == "accepted") {
          setDisplayId(id);
          setShowL(false);
          console.log("login," + id);
          window.location.reload();
        } else {
          setLoginError(t);
        }
      })
    );
  }
  function signup(
    id: string,
    pass: string,
    name: string,
    email: string,
    birth: string
  ) {
    fetch(
      "/api/user/post/registration?id=" +
        id +
        "&pass=" +
        pass +
        "&name=" +
        name +
        "&email=" +
        email +
        "&birth=" +
        birth,
      {
        method: "POST",
      }
    ).then((e) =>
      e.text().then((t) => {
        if (t == "accepted") {
          setDisplayId(id);
          setShowS(false);
          console.log("regist," + id);
          window.location.reload();
        } else {
          setSignError(t);
        }
      })
    );
  }
  function StartPostButton() {
    return (
      <PostAddIcon
        color="secondary"
        onClick={() => {
          setShowPost(true);
        }}
        sx={{ fontSize: "15vh" }}
        style={{
          left: 0,
          bottom: 0,
          position: "fixed",
          //paddingTop: "75vh",
        }}
      ></PostAddIcon>
    );
  }
  console.log("displayid : " + displayId);
  return (
    <>
      <Context.Provider value={init}>
        <header>{header}</header>
        {displayId === "default" && loginDialog()}
        {displayId === "default" && signupDialog()}
        {displayId !== "default" && (
          <Post show={showPost} setShow={setShowPost} />
        )}

        {displayId !== "default" && <StartPostButton />}

        <Home />
      </Context.Provider>
    </>
  );
}

export default App;
