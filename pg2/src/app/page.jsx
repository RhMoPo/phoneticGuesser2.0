"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "./globals.css"
import React, { useState, useEffect } from "react";

export default function Home() {
  const [randomWordData, setRandomWordData] = useState(null);
  const [phoneticsData, setPhoneticsData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [refinedData, setRefinedData] = useState([]);
  console.log("🚀 ~ Home ~ refinedData:", refinedData)
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isFetching && refinedData.length < 10) {
      getRandomWord();
    } else {
      setIsFetching(false); // Stop fetching
      console.log("Reached the limit of 10 words or stopped manually.");
    }
  }, [refinedData.length, isFetching]); // React to changes in these values

  const getRandomWord = async () => {
    const response = await fetch("https://random-word-api.herokuapp.com/word?length=3");
    if (!response.ok) {
        throw new Error("Failed to fetch random word");
    }
    const data = await response.json();
    const randomWord = data[0];

    await getDictionaryWordAndPhonetic(randomWord);
  };

  const getDictionaryWordAndPhonetic = async (randomWord) => {
    console.log("Navigating the dictionary API...");
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
    if (!response.ok) {
        console.error("Failed to fetch the dictionary API for word:", randomWord);
        if (isFetching) getRandomWord(); // Only retry if still fetching
        return;
    }
    const data = await response.json();
    if (data[0] && data[0].phonetics && data[0].phonetics.length > 0) {
      const phonetic = data[0].phonetics.find(p => p.text)?.text;
      if (phonetic) {
          // Extract definitions
          const definitions = data[0].meanings.map(meaning =>
              meaning.definitions.map(def => def.definition)
          ).flat(); // Flatten the array of arrays into a single array of definitions

          const newEntry = {
              word: randomWord,
              phonetic: phonetic,
              definitions: definitions // Add definitions to the object
          };

          setRefinedData(prevData => [...prevData, newEntry]);
      } else {
          console.log("Phonetic text not found for this word. Fetching another word...");
          if (isFetching) getRandomWord(); // Only retry if still fetching
      }
    } else {
        console.log("Phonetic text not found for this word. Fetching another word...");
        if (isFetching) getRandomWord(); // Only retry if still fetching
    }
  };

  useEffect(() => {
      getRandomWord(); // Fetch random word data when the component mounts
  }, []);


  const handleGuess = ()=>{
    if (userAnswer.toLowerCase()===randomWordData){
      alert("Correct")
      getRandomWord();
    } else {
      alert("Wrong")
    }
  };

  const handleInputChange = (event)=>{setUserAnswer(event.target.value)};

  return (
    <>
      <img src="example.png" alt="Example" />
      <div className="container">
        <div className="input-section">
          <input
            type="text"
            id="userAnswer"
            placeholder="Use the phonetic to guess the word..."
            value={userAnswer}
            onChange={handleInputChange}
          />
          <button id="submitBTN" onClick={handleGuess}>Guess</button>
        </div>
        <div className="phonetics" id="phoneticsOutput">
          <p>{phoneticsData}</p>
        </div>
      </div>
    </>
  );
}
