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
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  createTheme,
  LinearProgress,
  Link,
  PaletteMode,
  Paper,
  StyledEngineProvider,
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
          <Typography variant="h1" className={styles.appName}>
            {config.appName}
          </Typography>

          {selectedWord ? (
            <Card className={styles.card}>
              <LinearProgress
                variant="determinate"
                value={(numLivesLeft * 100) / config.maxLives}
              />
              <CardHeader
                title={`Clue: ${selectedWord.clue} `}
                subheader={
                  gameState === "loss" ? (
                    "Out of lives"
                  ) : gameState === "won" ? (
                    "Correct"
                  ) : (
                    <Chip label={`${numLivesLeft} tries remaining`} />
                  )
                }
              />

              <CardContent className={styles.cardContent}>
                <Typography className={styles.displayText}>
                  {selectedWord.word.split("").map((ele, idx) => {
                    if (ele !== " ") {
                      return (
                        <span key={idx} className={styles.displayTextLetter}>
                          {clickedKeys.indexOf(ele.toLowerCase()) !== -1
                            ? ele
                            : "_"}
                        </span>
                      );
                    } else {
                      return (
                        <span key={idx} className={styles.displayTextLetter}>
                          -
                        </span>
                      );
                    }
                  })}
                </Typography>

                <Keyboard
                  clickedKeys={clickedKeys}
                  changeClickedKeys={changeClickedKeys}
                />
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button onClick={selectNewWord}>Different word?</Button>
              </CardActions>
            </Card>
          ) : (
            <CircularProgress />
          )}
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
          <Button onClick={toggleTheme}>toggle theme</Button>
        </Paper>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}
