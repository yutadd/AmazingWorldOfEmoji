import React, { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";

export default function (props: any) {
  const json = props.json;
  const [length, setlength] = useState(0);
  useEffect(() => {
    if ("files" in json) {
      if ("file1" in json["files"]) {
        setlength(1);
        console.log("length:" + 1);
        if (json["files"]["file2"] !== undefined) {
          setlength(2);
          console.log("length:" + 2);
          if (json["files"]["file3"] !== undefined) {
            setlength(3);
            console.log("length:" + 3);
            if (json["files"]["file4"] !== undefined) {
              setlength(4);
              console.log("length:" + 4);
            }
          }
        }
      }
    }
  }, []);
  function ImageComponent(pro: any) {
    return (
      <>
        <Grid
          style={{
            width: "100%",
            height: "100%",
            display: "inline-block",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              overflow: "hidden",
            }}
            src={
              "/api/share/get/image?uid=" +
              json["userid"] +
              "&imageName=" +
              pro.link
            }
          />
        </Grid>
      </>
    );
  }
  return (
    <>
      <Grid
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          maxHeight: "100%",
          maxWidth: "50%",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {length > 0 && <ImageComponent link={json["files"]["file1"]} />}
        {length > 1 && <ImageComponent link={json["files"]["file2"]} />}
        {length > 2 && <ImageComponent link={json["files"]["file3"]} />}
        {length > 3 && <ImageComponent link={json["files"]["file4"]} />}
      </Grid>
    </>
  );
}
