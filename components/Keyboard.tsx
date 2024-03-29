import { Dispatch, SetStateAction } from "react";

import styles from "@/components/stylesheets/Keyboard.module.css";
import ClickedKeys from "@/types/ClickedKeys";
import { Button } from "@mui/material";

export default function Keyboard(props: {
  clickedKeys: ClickedKeys;
  changeClickedKeys: Dispatch<SetStateAction<ClickedKeys>>;
}) {
  const layout = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const customChangeClickedKeys = (letter: string) => {
    const newClickedKeys = JSON.parse(JSON.stringify(props.clickedKeys));
    newClickedKeys.push(letter);
    props.changeClickedKeys(newClickedKeys);
  };
  return (
    <div className={styles.Keyboard}>
      {layout.map((row, idx) => {
        return (
          <div key={idx}>
            {row.split("").map((letter) => {
              return (
                <Button
                  key={letter}
                  disabled={props.clickedKeys.indexOf(letter) !== -1}
                  onClick={() => {
                    customChangeClickedKeys(letter);
                  }}
                >
                  {letter}
                </Button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
