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

  // Function to fetch a random word and its phonetic data
  const fetchRandomWord = async () => {
    try {
      console.log("Fetching random word..."); // Log message indicating random word fetch process has started
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word"
      ); // Fetch random word data from API
      if (!response.ok) {
        // Check if response is not okay
        throw new Error("Failed to fetch random word"); // Throw an error if response is not okay
      }
      const data = await response.json(); // Parse response JSON
      const randomWord = data[0]; // Extract the random word

      // Construct the URL for the dictionary API call
      const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`;
      const dictionaryResponse = await fetch(dictionaryUrl); // Fetch the dictionary entry for the random word
      if (!dictionaryResponse.ok) {
        // Check if the response is successful
        throw new Error("Failed to fetch dictionary entry"); // Throw an error if response is not okay
      }
      const dictionaryData = await dictionaryResponse.json(); // Parse the JSON response to extract dictionary data

      // Extract word and phonetic information from the dictionary data
      const phoneticData = {
        word: dictionaryData[0]?.word || "N/A",
        phonetic: dictionaryData[0]?.phonetic || "N/A",
      };

      // Set the fetched data to the state variables
      setRandomWordData(phoneticData.word); // Set random word data
      setPhoneticsData(phoneticData.phonetic); // Set phonetic data
    } catch (error) {
      console.error(error); // Log the error
      setRandomWordError(error.message); // Set random word error state
    }
  };

  useEffect(() => {
    if (!randomWordData) {
      fetchRandomWord(); // Fetch random word data when the component mounts
    }
  }, []);

  const handleSubmit = async () => {
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
        setPhoneticsData(phonetic);
      } catch (error) {
        console.error("Error fetching phonetics:", error);
        setPhoneticsError(error.message);
      }
    }
  };

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
