import { useState, useEffect, createContext } from "react";
import Header1 from "./log-out/Header1";
import Header2 from "./logged-in/Header2";
import Home from "./Home";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
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
const shoki: ContextType = [null, null, null, null, null, null, "", null];
export const Context = createContext(shoki);
function App() {
  const [id, setName] = useState("");
  const [right, setRight] = useState(
    <>
      <Paper
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
    id,
    setName,
  ];
  const [header, setHeader] = useState(<Header1 />);

  useEffect(() => {
    fetch("/api/user/get/logged", { mode: "cors" }).then((r) => {
      r.text().then((response) => {
        console.log(response);
        let param = response.split(",");
        if (param[1] === "true") {
          console.log(param[0]);
          setName(param[0]);
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
        style={{
          display: showL ? "block" : "none",
          zIndex: 99,
          position: "absolute",
        }}
        sx={{ ml: "80vw", pr: "1vw", pt: "2vh", pl: "2vw", pb: "2vh" }}
      >
        <TextField
          sx={{ pb: "1vh" }}
          value={inputLoginID}
          type={"text"}
          id={"name"}
          placeholder="userID"
          onChange={(e) => {
            setLoginInputID(e.target.value);
          }}
        />
        <TextField
          sx={{ pb: "1vh" }}
          value={inputLoginPass}
          placeholder="password"
          type={"password"}
          id={"password"}
          onChange={(e) => {
            setLoginInputPass(e.target.value);
          }}
        />
        <br />
        <Button
          variant="contained"
          onClick={() => login(inputLoginID, inputLoginPass)}
        >
          Login&gt;&gt;
        </Button>
        <Typography style={{ color: "red" }}>{loginError}</Typography>
      </Card>
    );
  }
  function signupDialog() {
    return (
      <Card
        style={{
          display: showS ? "block" : "none",
          zIndex: 99,
          position: "absolute",
        }}
        sx={{ ml: "80vw", pr: "1vw", pt: "2vh", pl: "2vw", pb: "2vh" }}
      >
        <TextField
          sx={{ pb: "1vh" }}
          value={inputSignID}
          type={"text"}
          id={"name"}
          placeholder="userID"
          onChange={(e) => {
            setSignInputID(e.target.value);
          }}
        />
        <TextField
          sx={{ pb: "1vh" }}
          value={inputSignPass}
          placeholder="password"
          type={"password"}
          id={"password"}
          onChange={(e) => {
            setSignInputPass(e.target.value);
          }}
        />
        <TextField
          sx={{ pb: "1vh" }}
          value={inputSignName}
          placeholder="display name"
          type={"text"}
          id={"nickname"}
          onChange={(e) => {
            setSignInputName(e.target.value);
          }}
        />
        <TextField
          sx={{ pb: "1vh" }}
          value={inputSignEmail}
          placeholder="email"
          type={"email"}
          id={"email"}
          onChange={(e) => {
            setSignInputEmail(e.target.value);
          }}
        />
        <TextField
          sx={{ pb: "1vh" }}
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
          setName(id);
          window.location.reload();
        } else {
          setLoginError("IDかパスワードが間違っています。");
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
          setName(id);
          window.location.reload();
        } else {
          setSignError("パラメータに不正な値が含まれています。");
        }
      })
    );
  }
  return (
    <>
      <Context.Provider value={init}>
        <header>{header}</header>
        {id == "" && loginDialog()}
        {id == "" && signupDialog()}
        <Home />
      </Context.Provider>
    </>
  );
}

export default App;
