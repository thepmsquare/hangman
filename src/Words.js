import React, { Component } from "react";
import "./stylesheets/Words.css";

class Words extends Component {
  render() {
    const { word, clickedKeys } = this.props;
    const letters = word.split("");
    return (
      <div className="Words">
        {letters.map((letter, index) => {
          if (letter === " ") {
            return <span key={index}>&emsp;</span>;
          } else if (letter ==="'") {
            return <span key={index}>&apos;</span>;
          } else if (clickedKeys.includes(letter)) {
            return <span key={index}> {letter} </span>;
          } else {
            return <span key={index}> _ </span>;
          }
        })}
      </div>
    );
  }
}
export default Words;
