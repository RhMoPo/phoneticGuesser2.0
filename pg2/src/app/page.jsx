"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "./globals.css"
import React, { useState, useEffect } from "react";

export default function Home() {
  const [randomWordData, setRandomWordData] = useState(null); // Initialize with a loading message
  const [phoneticsData, setPhoneticsData] = useState(null);
  const [randomWordError, setRandomWordError] = useState(null);
  const [phoneticsError, setPhoneticsError] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [retryCount, setRetryCount] = useState(0); // Track the number of retries

  
  // Function to fetch a random word and its phonetic data
  const fetchRandomWord = async () => {
    try {
      console.log("Fetching random word..."); // Log message indicating random word fetch process has started
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word"
      ); // Fetch random word data from API
      if (!response.ok) {
        // Check if response is not okay
        throw new Error("Failed to fetch random word");
        // Throw an error if response is not okay
      }
      const data = await response.json(); // Parse response JSON
      const randomWord = data[0]; // Extract the random word

      // Construct the URL for the dictionary API call
      const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`;
      const dictionaryResponse = await fetch(dictionaryUrl); // Fetch the dictionary entry for the random word
      console.log(
        "🚀 ~ fetchRandomWord ~ dictionaryResponse:",
        dictionaryResponse
      );
      if (!dictionaryResponse.ok) {
        // Check if the response is successful
        throw new Error("Failed to fetch dictionary entry"); // Throw an error if response is not okay
      }
      const dictionaryData = await dictionaryResponse.json(); // Parse the JSON response to extract dictionary data
      console.log("🚀 ~ fetchRandomWord ~ dictionaryData:", dictionaryData);

      // Extract word and phonetic information from the dictionary data
      const word = dictionaryData[0]?.word || "N/A";
      const phonetic = dictionaryData[0]?.phonetic;

      // Set the fetched data to the state variables
      setRandomWordData(word); // Set random word data

      // Check if phonetic data is available and not "N/A"
      if (phonetic && phonetic !== "N/A") {
        setPhoneticsData(phonetic); // Set phonetic data
      } else {
        console.log("Phonetic data not available or is N/A. Retrying...");
        fetchRandomWord(); // Retry fetching the random word
      }
      setUserAnswer("");
    } catch (error) {
      console.error(error); // Log the error
      setRandomWordError(error.message); // Set random word error state

      // Retry fetching the random word up to 3 times
      if (retryCount < 3) {
        setRetryCount(retryCount + 1); // Increment retry count
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        fetchRandomWord(); // Retry fetching the random word
      } else {
        console.error("Max retry count reached. Please try again later.");
        // You can display an error message or handle the error as needed
      }
    }
  };

  useEffect(() => {
    fetchRandomWord(); // Fetch random word data when the component mounts
  }, []);

  const handleGuess = ()=>{
    if (userAnswer.toLowerCase()===randomWordData){
      alert("Correct")
      fetchRandomWord();
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
