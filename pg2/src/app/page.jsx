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
    try {
      console.log("Fetching random word...");
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch random word");
      }
      const data = await response.json();
      const randomWord = data[0];

      const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`;
      const dictionaryResponse = await fetch(dictionaryUrl);
      if (!dictionaryResponse.ok) {
        throw new Error("Failed to fetch dictionary entry");
      }
      const dictionaryData = await dictionaryResponse.json();

      const phoneticData = {
        word: dictionaryData[0]?.word || "N/A",
        phonetic: dictionaryData[0]?.phonetic || "N/A",
      };
      setRandomWordData(phoneticData.word); // Set random word data
      setPhoneticsData(phoneticData.phonetic); // Set phonetic data
    } catch (error) {
      console.error(error);
      setRandomWordError(error.message);
    }
  };

  useEffect(() => {
    if (!randomWordData) {
      fetchRandomWord();
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
