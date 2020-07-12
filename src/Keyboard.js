import React, { Component } from "react";
import "./stylesheets/Keyboard.css";

class Keyboard extends Component {
  render() {
    const allLetters1 = "ABCDEFGHI";
    const allLetters1Array = allLetters1.split("");
    const allLetters2 = "JKLMNOPQ";
    const allLetters2Array = allLetters2.split("");
    const allLetters3 = "RSTUVWXYZ";
    const allLetters3Array = allLetters3.split("");
    const { toUpdateClickedKeys, clickedKeys } = this.props;

    return (
      <div className="Keyboard">
        <div>
          {allLetters1Array.map((letter) => {
            return (
              <button
                key={letter}
                value={letter}
                onClick={toUpdateClickedKeys}
                disabled={clickedKeys.includes(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <div>
          {allLetters2Array.map((letter) => {
            return (
              <button
                key={letter}
                value={letter}
                onClick={toUpdateClickedKeys}
                disabled={clickedKeys.includes(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <div>
          {allLetters3Array.map((letter) => {
            return (
              <button
                key={letter}
                value={letter}
                onClick={toUpdateClickedKeys}
                disabled={clickedKeys.includes(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Keyboard;
