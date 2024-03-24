"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "./globals.css"
import React, { useState, useEffect } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  const [randomWordData, setRandomWordData] = useState(null); // Initialize with a loading message
  const [phoneticsData, setPhoneticsData] = useState(null);
  const [randomWordError, setRandomWordError] = useState(null);
  const [phoneticsError, setPhoneticsError] = useState(null);

  const fetchRandomWord = async () => {
    console.log("Fetching random word..."); // Log message indicating random word fetch process has started
    const response = await fetch("https://random-word-api.herokuapp.com/word"); // Fetch random word data from API
    if (!response.ok) {
      // Check if response is not okay
      throw new Error("Failed to fetch random word"); // Throw an error if response is not okay
    }
    const data = await response.json(); // Parse response JSON

    const randomWord = data [0]; 
    // Construct the URL for the dictionary API call
    const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`;
    console.log (dictionaryUrl);
    // Fetch the dictionary entry for the random word
    const dictionaryResponse = await fetch(dictionaryUrl);
    console.log (dictionaryResponse);
    // Check if the response is successful
    if (!dictionaryResponse.ok) {
    throw new Error("Failed to fetch dictionary entry");
    }

    // Parse the JSON response to extract dictionary data
    const dictionaryData = await dictionaryResponse.json();

    // Extract only the word and phonetic information
    const phoneticData = {
      word: dictionaryData[0]?.word || "N/A",
      phonetic: dictionaryData[0]?.phonetic || "N/A",
  };
  
  }; 



  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const randomWord = await fetchRandomWord();
        console.log(`inside useEffect, random word = ${randomWord}`);
        setRandomWordData(randomWord);
      } catch (error) {
        console.error(error);
      }
    };
    if (!randomWordData) {
      fetchData();
    }
  }, []);


  // Function to handle form submission
  const handleSubmit = async () => {
    // Re-fetch phonetics when the submit button is pressed
    if (randomWordData) {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWordData}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch phonetics");
        }
        const data = await response.json();
        const phonetic = data[0]?.phonetics[0]?.text;
        setPhoneticsData(phonetic); // Set phonetics data
      } catch (error) {
        console.error("Error fetching phonetics:", error);
        setPhoneticsError(error.message); // Set error if fetching fails
      }
    }
  };

  // Render the component
  return (
    <>
      <Header />
      <img src="example.png" alt="Example" />
      <div className="container">
        <div className="input-section">
          <input
            type="text"
            id="userAnswer"
            placeholder="Use the phonetic to guess the word..."
          />
          <button id="submitBTN" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="phonetics" id="phoneticsOutput">
          <p>Random Word: {randomWordData}</p>
          <p>Phonetics: {phoneticsData}</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
