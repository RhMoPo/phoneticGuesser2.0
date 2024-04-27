"use client";
import "./globals.css"
import React, { useState, useEffect } from "react";


export default function Home() {

  const [phoneticsData, setPhoneticsData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [refinedData, setRefinedData] = useState([]);
  console.log("🚀 ~ Home ~ refinedData:", refinedData)
  const [isFetching, setIsFetching] = useState(true);
  const [showHints, setShowHints] = useState(false);

  const toggleHints = () => {
  setShowHints(!showHints);
};
  useEffect(() => {
    if (isFetching && refinedData.length < 3) {
      getRandomWord();
    } else {
      setIsFetching(false); // Stop fetching
      if(refinedData.length > 0) {
        setPhoneticsData(refinedData[0].phonetic);
      }
    }
  }, [refinedData.length, isFetching]); // React to changes in these values

  const getRandomWord = async () => {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    if (!response.ok) {
        throw new Error("Failed to fetch random word");
    }
    const data = await response.json();
    const randomWord = data[0];

    await getDictionaryWordAndPhonetic(randomWord);
  };

const getDictionaryWordAndPhonetic = async (randomWord) => {
    console.log("Navigating the dictionary API...");
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        if (!response.ok) throw new Error(`Failed to fetch the dictionary API for word: ${randomWord}`);

        const data = await response.json();
        if (!data[0] || !data[0].phonetics || !data[0].phonetics.length) {
            throw new Error("Phonetic data is missing or empty.");
        }

        const phonetic = data[0].phonetics.find(p => p.text)?.text;
        if (!phonetic) {
            throw new Error("Phonetic text not found.");
        }

        // Proceed with extracting definitions
        const definitions = data[0].meanings.map(meaning => 
            meaning.definitions.map(def => def.definition)
        ).flat();

        const newEntry = {
            word: randomWord,
            phonetic: phonetic,
            definitions
        };

        setRefinedData(prevData => [...prevData, newEntry]);
    } catch (error) {
        console.log(error.message);
        if (isFetching) getRandomWord();
    }
};


  useEffect(() => {
      getRandomWord(); // Fetch random word data when the component mounts
  }, []);


const handleGuess = () => {
    if (refinedData.length > 0) {
      const currentWord = refinedData[0].word;

      if (userAnswer.trim().toLowerCase() === currentWord.toLowerCase()) {
        alert("Correct!");
        setRefinedData(prevData => prevData.slice(1)); // Remove the first word from the array
        setIsFetching(true); // Trigger fetching if the array length is less than 3
        setShowHints(false); // Hide hints when moving to the next word
      } else {
        alert("Wrong. Try again!");
      }
      // Clear the input field after processing the guess
      setUserAnswer("");
    } else {
      alert("No words left to guess or not fetched yet.");
    }
};
  
  const handleSkip = () => {
    if (refinedData.length > 0) { 
      setRefinedData(prevData => prevData.slice(1));
      setIsFetching(true)
      setUserAnswer("");
      setShowHints(false);
    } else {
      alert("No words left to guess or not fetched yet.");
    }
    }

  const handleInputChange = (event)=>{setUserAnswer(event.target.value)};

  return (
  <div className="container">
    <img src="example.png" alt="Example"></img>
    <div className="inputSection">
      <input
        type="text"
        id="userAnswer"
        placeholder="Use the phonetic to guess the word..."
        value={userAnswer}
        onChange={handleInputChange}
      />
      <button id="submitBTN" onClick={handleGuess}>Guess</button>
      {refinedData.length > 0 && (
        <button id="hintBTN" onClick={toggleHints} style={{ marginLeft: '10px' }}>Hint?</button>
        )}
      {refinedData.length > 0 && (
          <button className="skip" id="skipBTN" onClick={handleSkip} style={{ marginLeft: '10px' }}>Skip</button>
      )}
    </div>
    {phoneticsData && (
      <div className="phonetics" id="phoneticsOutput">
        <p>{phoneticsData}</p>
      </div>                                                            
    )}
    {showHints && refinedData.length > 0 && (
      <div className="hintsContainer">
        {refinedData[0].definitions.slice(0, 3).map((definition, index) => (
          <div key={index} className="hint">
            {definition}
          </div>
        ))}
      </div>
    )}
  </div>
);
}
