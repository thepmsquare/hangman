import React, { Component } from "react";
import "./stylesheets/Hangman.css";
import images from "./images";
import Words from "./Words";
import AllWords from "./AllWords";
import Keyboard from "./Keyboard";
class Hangman extends Component {
  constructor(props) {
    super(props);
    const selectedWord = this.pickAWord();
    this.state = {
      clue: selectedWord.clue,
      numCorrect: selectedWord.word.includes(" ") ? 1 : 0,
      numMistakes: 0,
      clickedKeys: [" "],
      gameOver: false,
      win: false,
      word: selectedWord.word,
    };
  }
  updateClickedKeys = (e) => {
    const newClickedKeys = [
      ...this.state.clickedKeys,
      e.target.getAttribute("value"),
    ];
    this.setState({
      clickedKeys: newClickedKeys,
    });
    this.countScore(e.target.getAttribute("value"));
  };
  countScore = (pressedKey) => {
    const neededKeys = [...new Set(this.state.word.split(""))];
    if (neededKeys.includes(pressedKey)) {
      this.setState(
        (curState) => {
          return {
            numCorrect: curState.numCorrect + 1,
          };
        },
        () => {
          if (this.state.numCorrect === neededKeys.length) {
            this.setState({
              win: true,
              clickedKeys: "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split(""),
            });
          }
        }
      );
    } else {
      this.setState(
        (curState) => {
          return {
            numMistakes: curState.numMistakes + 1,
          };
        },
        () => {
          if (this.state.numMistakes === 6) {
            this.setState({
              gameOver: true,
              clickedKeys: "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split(""),
            });
          }
        }
      );
    }
  };
  tryAgain = () => {
    const selectedWord = this.pickAWord();

    this.setState({
      clue: selectedWord.clue,
      numCorrect: selectedWord.word.includes(" ") ? 1 : 0,
      numMistakes: 0,
      clickedKeys: [],
      gameOver: false,
      win: false,
      word: selectedWord.word,
    });
  };
  pickAWord = () => {
    let category = AllWords[Math.floor(Math.random() * AllWords.length)];
    let clue = category.clue;
    let word =
      category.choices[
        Math.floor(Math.random() * category.choices.length)
      ].toUpperCase();

    return { clue, word };
  };
  render() {
    return (
      <div className="Hangman">
        <h1>Hangman</h1>
        <p className="Hangman-Text">Clue: {this.state.clue}</p>
        <img
          className="Hangman-Image"
          src={images[this.state.numMistakes]}
          alt={this.state.numMistakes + " mistakes."}
        />
        <Words word={this.state.word} clickedKeys={this.state.clickedKeys} />
        <Keyboard
          toUpdateClickedKeys={this.updateClickedKeys}
          clickedKeys={this.state.clickedKeys}
        />
        {this.state.gameOver ? <p className="Hangman-Text">You Lose!</p> : null}
        {this.state.win ? <p className="Hangman-Text">You Win!</p> : null}
        <button className="Hangman-Button" onClick={this.tryAgain}>
          Other word?
        </button>
        <p>
          Thanks to{" "}
          <a
            href="https://github.com/Leviter"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Leviter
          </a>{" "}
          for contributing words.
        </p>
      </div>
    );
  }
}
export default Hangman;
