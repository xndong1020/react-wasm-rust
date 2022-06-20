import React, { useState, useEffect } from "react";
import init, { add } from "wasm-lib";
import socket from "./_utils/socket";
import "./App.css";

function App() {
  const [numberOne, setNumberOne] = useState(0);
  const [numberaTwo, setNumberTwo] = useState(0);
  const [ans, setAns] = useState(0);

  useEffect(() => {
    init().then(() => {
      socket.on("message", (numbers: string) => {
        const [number1, number2] = JSON.parse(numbers);
        setNumberOne(number1);
        setNumberTwo(number2);
        console.log("message", number1, number2);
        const result = add(number1, number2);
        console.log("result", result);
        setAns(result);
      });
    });
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          A Value: {numberOne} + C Value {numberaTwo} = {ans}
        </p>
      </header>
    </div>
  );
}

export default App;
