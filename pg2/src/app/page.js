import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <img src="example.png" alt="Example" />
      <div className="container">
        <div className="input-section">
          <input type="text" id="userAnswer" placeholder="Use the phonetic to guess the word..." />
          <button id="submitBTN">Submit</button>
        </div>
        <div className="phonetics" id="phoneticsOutput"></div>
      </div>
    </>
  );
}