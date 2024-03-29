"use client";
import { useEffect, useState } from "react";

import Keyboard from "@/components/Keyboard";
import categories from "@/config/categories";
import config from "@/config/config";
import ClickedKeys from "@/types/ClickedKeys";
import GameState from "@/types/GameState";
import SelectedWord from "@/types/SelectedWord";
import {
  Button,
  CircularProgress,
  createTheme,
  LinearProgress,
  Link,
  PaletteMode,
  Paper,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import styles from "./page.module.css";

export default function Home() {
  // state
  const [selectedWord, changeSelectedWord] = useState<SelectedWord | null>(
    null
  );
  const [numLivesLeft, changeNumLivesLeft] = useState(config.maxLives);
  const [clickedKeys, changeClickedKeys] = useState<ClickedKeys>([]);
  const [gameState, changeGameState] = useState<GameState>("normal");
  const [score, changeScore] = useState(0);
  const [theme, changeTheme] = useState<PaletteMode>(config.defaultTheme);

  // functions
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
    changeGameState("normal");
  };

  const loadStuffFromLocalStorage = () => {
    // score
    let localStorageScore = window.localStorage.getItem(
      config.localStorageVariableNames.score
    );
    if (localStorageScore) {
      changeScore(parseInt(localStorageScore));
    } else {
      window.localStorage.setItem(config.localStorageVariableNames.score, "0");
    }

    // theme
    let localStorageTheme = window.localStorage.getItem(
      config.localStorageVariableNames.theme
    );
    if (localStorageTheme) {
      changeTheme(localStorageTheme as PaletteMode);
    } else {
      window.localStorage.setItem(
        config.localStorageVariableNames.theme,
        config.defaultTheme
      );
    }
  };

  const toggleTheme = () => {
    let newTheme: PaletteMode = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(
      config.localStorageVariableNames.theme,
      newTheme
    );
    changeTheme(newTheme);
  };

  // use Effects
  useEffect(() => {
    loadStuffFromLocalStorage();
    selectNewWord();
  }, []);

  useEffect(() => {
    if (selectedWord && clickedKeys.length > 0 && gameState === "normal") {
      if (
        selectedWord.word.indexOf(
          clickedKeys[clickedKeys.length - 1].toUpperCase()
        ) === -1
      ) {
        if (numLivesLeft === 1) {
          // game over
          changeNumLivesLeft(config.maxLives);
          changeGameState("loss");
          changeClickedKeys("abcdefghijklmnopqrstuvwxyz".split(""));
        } else {
          changeNumLivesLeft((oldNumLives) => oldNumLives - 1);
        }
      }
      const neededKeys = [
        ...new Set(selectedWord.word.split(" ").join("").split("")),
      ];
      const remainingKeys = neededKeys.filter(
        (ele) => clickedKeys.indexOf(ele.toLowerCase()) === -1
      );
      if (remainingKeys.length === 0) {
        changeGameState("won");
        changeNumLivesLeft(config.maxLives);
        changeClickedKeys("abcdefghijklmnopqrstuvwxyz".split(""));
        changeScore((oldScore) => {
          window.localStorage.setItem(
            config.localStorageVariableNames.score,
            (oldScore + 1).toString()
          );
          return oldScore + 1;
        });
      }
    } else {
      // pass
    }
  }, [clickedKeys]);
  // misc
  let currentTheme = createTheme({
    palette: {
      // PaletteMode and Theme are same types here
      mode: theme,
    },
  });
  return (
    <ThemeProvider theme={currentTheme}>
      <StyledEngineProvider injectFirst>
        <Paper className={styles.main} square>
          <Typography variant="h1">{config.appName}</Typography>
          {selectedWord ? (
            <>
              <Typography variant="h2">Clue: {selectedWord.clue}</Typography>
              <Typography variant="h3">Score: {score}</Typography>
              {gameState === "loss" && (
                <Typography variant="h3" color="error">
                  Loss
                </Typography>
              )}
              {gameState === "won" && (
                <Typography variant="h3" color="primary">
                  Correct
                </Typography>
              )}
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
              <LinearProgress
                variant="determinate"
                value={(numLivesLeft * 100) / config.maxLives}
              />
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
          <Button onClick={toggleTheme}>toggle theme</Button>
        </Paper>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}
