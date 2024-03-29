"use client";
import { useEffect, useState } from "react";

import Keyboard from "@/components/Keyboard";
import categories from "@/config/categories";
import config from "@/config/config";
import ClickedKeys from "@/types/ClickedKeys";
import SelectedWord from "@/types/SelectedWord";
import {
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import styles from "./page.module.css";

export default function Home() {
  const [selectedWord, changeSelectedWord] = useState<SelectedWord | null>(
    null
  );
  const [numLivesLeft, changeNumLivesLeft] = useState(config.maxLives);
  const [clickedKeys, changeClickedKeys] = useState<ClickedKeys>([]);

  const selectNewWord = () => {
    let category = categories[Math.floor(Math.random() * categories.length)];
    let clue = category.clue;
    let word =
      category.choices[
        Math.floor(Math.random() * category.choices.length)
      ].toUpperCase();
    let selectedWord = { clue, word };
    changeSelectedWord(selectedWord);
    changeClickedKeys([]);
  };

  useEffect(() => {
    selectNewWord();
  }, []);

  return (
    <main className={styles.main}>
      <Typography variant="h1">{config.appName}</Typography>
      {selectedWord ? (
        <>
          <Typography variant="h2">Clue: {selectedWord.clue}</Typography>
          {selectedWord.word.split("").map((ele, idx) => {
            if (ele !== " ") {
              return (
                <TextField
                  key={idx}
                  variant="outlined"
                  disabled
                  value={
                    clickedKeys.indexOf(ele.toLowerCase()) !== -1 ? ele : ""
                  }
                  className={styles.textField}
                />
              );
            } else {
              return "-";
            }
          })}
          <Keyboard
            clickedKeys={clickedKeys}
            changeClickedKeys={changeClickedKeys}
          />
          <Button onClick={selectNewWord}>Different word?</Button>
          <Typography>
            Thanks to{" "}
            <Link
              href="https://github.com/Leviter"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Leviter
            </Link>{" "}
            for contributing words.
          </Typography>
        </>
      ) : (
        <CircularProgress />
      )}
    </main>
  );
}
