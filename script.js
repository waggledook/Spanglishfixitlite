class SpanglishFixitGame {
    constructor(sentences) {
        this.originalSentences = sentences;
    this.totalSentences       = 15; // Each game has 15 sentences.
    this.sentences            = this.shuffle([...sentences]).slice(0, this.totalSentences);
    this.currentIndex         = 0;
    this.score                = 0;
    this.wrongAnswers         = [];
    this.interval             = null;
        this.gameActive = false;
        this.reviewMode = false;
        this.currentErrorWord = null; // Track the selected error word

        // Define methods before binding them
        this.startGame = () => {
            this.gameActive = true;
            this.currentIndex = 0;
            this.score = 0;
            this.wrongAnswers = [];
            document.getElementById("score").textContent = this.score;
            document.getElementById("feedback").textContent = "";
            document.getElementById("sentence").textContent = "";
            document.getElementById("answer").value = "";
            // Reset the sentence counter:
            document.getElementById("counter").textContent = "Sentence: 0/15";
            document.getElementById("restart").style.display = "none";
            document.getElementById("start").style.display = "none";
            this.updateSentence();
            // No overall timer now.
        };

        this.startReview = () => {
    if (this.wrongAnswers.length === 0) return;
    this.reviewMode = true;
    this.currentIndex = 0;
    
    // Re-show the answer input for review:
    document.getElementById("answer").style.display = "block";
    
    // Hide the Review button when entering review mode:
    document.getElementById("review").style.display = "none";
    this.updateSentence();
};

        this.setupInputListener = () => {
            document.getElementById("answer").addEventListener("keyup", (event) => {
                if (event.key === "Enter") {
                    this.checkAnswer();
                }
            });
        };

        // Bind the arrow function methods
        this.startGame = this.startGame.bind(this);
        this.startReview = this.startReview.bind(this);
        this.setupInputListener = this.setupInputListener.bind(this);

        this.initUI();
    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    initUI() {
        console.log("Game script is running!");
        // Load jsPDF and AutoTable so downloadReport() can use them
function loadScript(url, cb) {
    const s = document.createElement("script");
    s.src = url;
    s.onload = cb;
    document.head.appendChild(s);
  }
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", () => {
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js", () => {
      console.log("jsPDF + AutoTable ready!");
    });
  });
  
        document.title = "Spanglish Fixit Challenge";
        document.body.innerHTML = `
    <style>
        /* General body styles */
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #2E3192, #1BFFFF);
            color: white;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        /* Instructions overlay */
        #instructions-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        #instructions-box {
            background: #333;
            padding: 20px;
            border-radius: 10px;
            max-width: 500px;
            text-align: left;
        }
        #instructions-box h2 {
            margin-top: 0;
        }
        /* Close instructions button */
        #close-instructions {
            margin-top: 15px;
            padding: 5px 10px;
            background: #28a745;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            transition: 0.3s;
        }
        #close-instructions:hover {
            opacity: 0.8;
        }
        /* Game container */
        #game-container {
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        /* Paragraph style */
        p {
            font-size: 18px;
        }
        /* Input styles */
        input {
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            border: none;
            outline: none;
            text-align: center;
            display: block;
            margin: 10px auto;
            width: 80%;
        }
        input.correct {
            border: 2px solid #00FF00;
            background-color: rgba(0, 255, 0, 0.2);
        }
        input.incorrect {
            border: 2px solid #FF0000;
            background-color: rgba(255, 0, 0, 0.2);
        }
        /* Button styles */
        button {
            padding: 10px 20px;
            font-size: 18px;
            margin-top: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
        }
        button:hover {
            opacity: 0.8;
        }
        /* Start Button */
#start {
  background: linear-gradient(135deg, #32CD32, #228B22);
  color: white;
}
#start:hover {
  background: linear-gradient(135deg, #228B22, #32CD32);
  transform: translateY(-2px);
}
#start:active {
  transform: translateY(1px);
}

/* Restart Button */
#restart {
  background: linear-gradient(135deg, #339AF0, #1C7ED6);
  color: white;
  display: none;
}
#restart:hover {
  background: linear-gradient(135deg, #1C7ED6, #339AF0);
  transform: translateY(-2px);
}
#restart:active {
  transform: translateY(1px);
}

/* Review Button */
#review {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: black;
  display: none;
}
#review:hover {
  background: linear-gradient(135deg, #FFA500, #FFD700);
  transform: translateY(-2px);
}
#review:active {
  transform: translateY(1px);
}
  /* Download Report Button */
#downloadReport {
  background: linear-gradient(135deg, #FF857A, #FF5E57);
  color: white;
  display: none;
  margin-top: 20px; /* match your other games */
}
#downloadReport:hover {
  background: linear-gradient(135deg, #FF5E57, #FF857A);
  transform: translateY(-2px);
}
#downloadReport:active {
  transform: translateY(1px);
}
        /* Timer bar (points bar) */
        #timer-bar {
            width: 100%;
            height: 10px;
            background: red;
            transition: width 1s linear;
        }
        /* End-game text styles */
        .game-over {
            font-size: 24px;
            color: #FF4500;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .new-high {
            font-size: 20px;
            color: #FFD700;
            font-weight: bold;
        }
            /* make the sentence text bigger and tappable */
#sentence {
  font-size: 1.5rem;   /* about 24px */
  line-height: 1.4;
}

/* every word becomes a pill-shaped tappable target */
.clickable-word {
  display: inline-block;
  padding: 2px 4px;
  margin: 0;
  font-size: 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.clickable-word:hover {
  background: rgba(255,255,255,0.2);
}

/* after click, we’ll add one of these classes: */
.correct-bubble {
  background-color: #28a745;
  color: #fff;
}
.incorrect-bubble {
  background-color: #e74c3c;
  color: #fff;
}
/* keep game & host containers inside the viewport with a 20px buffer */
@media (max-height: 700px) {
  #game-container,
  #host-container {
    max-height: calc(100vh - 40px);  /* leaves 20px top + bottom */
    overflow-y: auto;                /* scroll if content is taller */
    margin: 20px auto;               /* reinforce the vertical buffer */
  }
}

/* on very short devices, align to top so you don’t get awkward centering */
@media (max-height: 500px) {
  body {
    justify-content: flex-start !important;
    padding-top: 10px;
  }
}
    </style>
    <!-- Instructions Overlay -->
    <div id="instructions-overlay">
        <div id="instructions-box">
            <h2>How to Play</h2>
            <p>Welcome to the Spanglish Fixit Challenge! Here's what to do:</p>
            <ul>
                <li>Click the incorrect word in each sentence.</li>
                <li>After clicking, type the correct word.</li>
                <li>For each sentence, your points decrease from 100 to 10 over 30 seconds.</li>
                <li>Incorrect clicks or wrong corrections lose you 50 points.</li>
                <li>The game ends after 15 sentences (e.g., 2/15, 3/15, etc.).</li>
            </ul>
            <p>Good luck!</p>
            <button id="close-instructions">Got It!</button>
        </div>
    </div>
    <!-- Game Container -->
    <div id="game-container">
        <img
  id="titleImage"
  src="images/Spanglish-title.png"
  alt="Spanglish Fixit"
  style="display:block;max-width:300px;margin:0 auto 20px;"
/>
        <!-- Sentence counter -->
        <p id="counter">Sentence: 0/15</p>
        <!-- Points bar container -->
        <div id="points-bar-container" style="width:100%; background: #555; height: 10px; margin-top: 5px;">
            <div id="points-bar" style="width: 100%; height: 100%; background: #0f0; transition: width 0.1s linear;"></div>
        </div>
        <p id="sentence"></p>
        <p id="instructionsText">Click the error and type the correction:</p>
        <input type="text" id="answer" autofocus>
        <p id="feedback"></p>
        <p>Score: <span id="score">0</span></p>
        <p>Best Score: <span id="bestScore">0</span></p>
        <button id="start">Start Game</button>
        <button id="restart">Restart</button>
        <button id="review">Review Mistakes</button>
        <button id="downloadReport" style="display: none;">Download Report</button>
    </div>
`;
        document.getElementById("close-instructions").addEventListener("click", () => {
            document.getElementById("instructions-overlay").style.display = "none";
        });
        document.getElementById("start").addEventListener("click", () => this.startGame());
        document.getElementById("restart").addEventListener("click", () => this.restartGame());
        document.getElementById("review").addEventListener("click", () => this.startReview());
        this.setupInputListener();
        this.updateBestScoreDisplay();
    }

    updateBestScoreDisplay() {
        let storedBest = localStorage.getItem("bestScoreSpanglish") || 0;
        document.getElementById("bestScore").textContent = storedBest;
    }

    updateSentence() {
    if (this.reviewMode) {
        // In review mode, use the length of wrongAnswers
        if (this.currentIndex >= this.wrongAnswers.length) {
            document.getElementById("sentence").innerHTML = "Review complete!";
            document.getElementById("answer").style.display = "none";
            document.getElementById("feedback").textContent = "";
            this.reviewMode = false;
            return;
        }
        document.getElementById("counter").textContent = `Review: ${this.currentIndex + 1}/${this.wrongAnswers.length}`;
    } else {
        // Normal game mode: check against totalSentences
        if (this.currentIndex >= this.totalSentences) {
            this.endGame();
            return;
        }
        document.getElementById("counter").textContent = `Sentence: ${this.currentIndex + 1}/${this.totalSentences}`;
    }
    
    const currentSet = this.reviewMode ? this.wrongAnswers : this.sentences;
    const currentSentence = currentSet[this.currentIndex];
    const sentenceParts = currentSentence.sentence.split(" ");
    let sentenceHTML = sentenceParts.map((word) => `<span class="clickable-word">${word}</span>`).join(" ");
    document.getElementById("sentence").innerHTML = sentenceHTML;
    
    // Re-enable clicking for new sentence
    document.getElementById("sentence").style.pointerEvents = "auto";
    
    // Start the 30-second phase timer for scoring (max 100 points, min 10)
    this.startClickTime = Date.now();
    if (this.pointsInterval) clearInterval(this.pointsInterval);
    this.pointsInterval = setInterval(() => {
        let elapsed = Date.now() - this.startClickTime;
        let availablePoints = Math.max(100 - Math.floor(elapsed / 300), 10);
        let percentage = ((availablePoints - 10) / (100 - 10)) * 100;
        document.getElementById("points-bar").style.width = percentage + "%";
    }, 100);
    
    // Attach click listeners to each word
    const clickableWords = document.querySelectorAll(".clickable-word");
    clickableWords.forEach((wordElement) => {
        wordElement.addEventListener("click", () => {
            this.handleWordClick(wordElement, currentSentence);
        });
    });
}


handleWordClick(wordElement, currentSentence) {
    // stop the points countdown
    if (this.pointsInterval) {
      clearInterval(this.pointsInterval);
      this.pointsInterval = null;
    }
  
    // record the click
    const clickedWord = wordElement.textContent;
    if (!this.reviewMode) {
    // record only the first-click during normal play
    currentSentence.clickedWord = clickedWord;
    } else {
    // optional: record review clicks separately
    currentSentence.reviewClickedWord = clickedWord;
    }
  
    // helper to normalize words
    const clean = str =>
      str.replace(/[^\w\s]|_/g, "")
         .trim()
         .toLowerCase();
  
    const isCorrect = clean(clickedWord) === clean(currentSentence.errorWord);
  
    // clear old bubbles
    document.querySelectorAll(".clickable-word")
      .forEach(el => el.classList.remove("correct-bubble", "incorrect-bubble"));
  
    // bubble the clicked word
    wordElement.classList.add(isCorrect ? "correct-bubble" : "incorrect-bubble");
  
    // adjust score / record mistakes
    if (isCorrect) {
      const clickTime = Date.now() - this.startClickTime;
      this.score += Math.max(100 - Math.floor(clickTime / 300), 10);
    } else {
      this.score -= 50;
      if (!this.wrongAnswers.includes(currentSentence)) {
        this.wrongAnswers.push(currentSentence);
      }
    }
    document.getElementById("score").textContent = this.score;
  
    // highlight the true error word in green
    document.querySelectorAll(".clickable-word")
      .forEach(el => {
        if (clean(el.textContent) === clean(currentSentence.errorWord)) {
          el.classList.add("correct-bubble");
        }
      });
  
    // stop further clicks and move to typing correction
    document.getElementById("sentence").style.pointerEvents = "none";
    this.selectErrorWord(clickedWord);
  }  

    selectErrorWord(word) {
        this.currentErrorWord = word;
        document.getElementById("feedback").textContent = `You selected "${word}". Now, type the correction.`;
        if (this.pointsInterval) {
            clearInterval(this.pointsInterval);
            this.pointsInterval = null;
        }
        this.startCorrectionTime = Date.now();
        document.getElementById("points-bar").style.width = "100%";
        this.pointsInterval = setInterval(() => {
            let elapsed = Date.now() - this.startCorrectionTime;
            let availablePoints = Math.max(100 - Math.floor(elapsed / 300), 10);
            let percentage = ((availablePoints - 10) / (100 - 10)) * 100;
            document.getElementById("points-bar").style.width = percentage + "%";
        }, 100);
        document.getElementById("answer").focus();
    }

    checkAnswer() {
        if (!this.currentErrorWord) {
            document.getElementById("feedback").textContent = "Please click on the incorrect word first!";
            return;
        }
        if (this.pointsInterval) {
            clearInterval(this.pointsInterval);
            this.pointsInterval = null;
        }
        if (!this.gameActive && !this.reviewMode) return;
        const input = document.getElementById("answer");
        const userInput = input.value.trim().toLowerCase();
        const currentSet = this.reviewMode ? this.wrongAnswers : this.sentences;
        const currentSentence = currentSet[this.currentIndex];
        const correctionTime = Date.now() - this.startCorrectionTime;
        let possibleAnswers = currentSentence.correctAnswer;
        if (!Array.isArray(possibleAnswers)) {
            possibleAnswers = [possibleAnswers];
        }
        possibleAnswers = possibleAnswers.map(answer => answer.toLowerCase());
        if (!this.reviewMode) {
            currentSentence.studentAnswer = userInput;
            currentSentence.wasCorrect    = possibleAnswers.includes(userInput);
          } else {
            currentSentence.reviewAnswer     = userInput;
            currentSentence.reviewWasCorrect = possibleAnswers.includes(userInput);
          }
        if (this.reviewMode) {
            if (possibleAnswers.includes(userInput)) {
                input.classList.add("correct");
                document.getElementById("feedback").textContent = `Correct. The answer is: ${possibleAnswers.join(" / ")}`;
                setTimeout(() => {
                    input.classList.remove("correct");
                    input.value = "";
                    this.currentIndex++;
                    this.currentErrorWord = null;
                    this.updateSentence();
                }, 1000);
            } else {
                input.classList.add("incorrect");
                document.getElementById("feedback").textContent = `Incorrect. The correct answer is: ${possibleAnswers.join(" / ")}`;
                setTimeout(() => {
                    input.classList.remove("incorrect");
                    input.value = "";
                    this.currentIndex++;
                    this.currentErrorWord = null;
                    this.updateSentence();
                }, 1000);
            }
            return;
        }
        if (possibleAnswers.includes(userInput)) {
            let correctionScore = Math.max(100 - Math.floor(correctionTime / 300), 10);
            this.score += correctionScore;
            document.getElementById("score").textContent = this.score;
            input.classList.add("correct");
            document.getElementById("feedback").textContent = `Correct. The answer is: ${possibleAnswers.join(" / ")}`;
            setTimeout(() => {
                input.classList.remove("correct");
                input.value = "";
                this.currentIndex++;
                this.currentErrorWord = null;
                this.updateSentence();
            }, 1000);
        } else {
            this.score -= 50;
            if (!this.wrongAnswers.some(item => item.sentence === currentSentence.sentence)) {
                this.wrongAnswers.push({
                    sentence: currentSentence.sentence,
                    errorWord: currentSentence.errorWord,
                    correctAnswer: currentSentence.correctAnswer,
                    studentAnswer: userInput
                });
            }
            document.getElementById("score").textContent = this.score;
            input.classList.add("incorrect");
            document.getElementById("feedback").textContent = `Incorrect. The correct answer is: ${possibleAnswers.join(" / ")}`;
            setTimeout(() => {
                input.classList.remove("incorrect");
                input.value = "";
                this.currentIndex++;
                this.currentErrorWord = null;
                this.updateSentence();
            }, 1000);
        }
    }

    // No overall timer now, so startTimer() is removed.

    endGame() {
    this.gameActive = false;
    if (this.pointsInterval) clearInterval(this.pointsInterval);

    // Check and update best score using localStorage
    let storedBest = localStorage.getItem("bestScoreSpanglish") || 0;
    let newHighScore = false;
    if (this.score > storedBest) {
        localStorage.setItem("bestScoreSpanglish", this.score);
        newHighScore = true;
    }
    this.updateBestScoreDisplay();

    // Build a "Game Over" message
    let endMessage = `
        <div class="game-over">Game Over!</div>
        <div>Your score: ${this.score}</div>
    `;
    if (newHighScore) {
        endMessage += `<div class="new-high">New High Score!</div>`;
    }

    // Replace the last sentence with the end message
    document.getElementById("sentence").innerHTML = endMessage;

    // Hide the instructions paragraph and clear leftover feedback
    document.getElementById("instructionsText").style.display = "none";
    document.getElementById("feedback").textContent = "";

    // Hide the answer input and reset the points bar
    document.getElementById("answer").style.display = "none";
    document.getElementById("points-bar").style.width = "0%";

    // Show the restart button
    document.getElementById("restart").style.display = "block";

    // Show review button if there are mistakes
    document.getElementById("review").style.display = this.wrongAnswers.length > 0 ? "block" : "none";

    // Show the download report button if present
    const reportButton = document.getElementById("downloadReport");
    if (reportButton) {
        reportButton.style.display = "block";
        // Only attach the click listener once
        if (!reportButton.dataset.listenerAdded) {
            reportButton.addEventListener("click", () => this.downloadReport());
            reportButton.dataset.listenerAdded = "true";
        }
    }
}

restartGame() {
    this.gameActive = false;
    this.reviewMode = false;
    if (this.pointsInterval) clearInterval(this.pointsInterval);
    this.currentIndex = 0;
    this.score = 0;
    this.wrongAnswers = [];
    this.sentences = this.shuffle([...this.originalSentences]).slice(0, this.totalSentences);

    document.getElementById("score").textContent = this.score;
    document.getElementById("feedback").textContent = "";
    document.getElementById("sentence").textContent = "";
    document.getElementById("answer").value = "";

    // Re-show the answer input
    document.getElementById("answer").style.display = "block";

    // Re-show instructions paragraph
    document.getElementById("instructionsText").style.display = "block";

    // Reset counters, hide review, hide restart, show start
    document.getElementById("counter").textContent = "Sentence: 0/15";
    document.getElementById("review").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById("start").style.display = "block";
}


downloadReport() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      return alert("PDF generator not loaded yet—please try again in a moment.");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0,0,150);
    doc.text("Spanglish Fixit – Detailed Report", 14, 20);
  
    // build the rows WITHOUT the result column
    const body = this.sentences.map((s, i) => {
      const correct = Array.isArray(s.correctAnswer)
        ? s.correctAnswer.join(" / ")
        : s.correctAnswer;
      return [
        i + 1,
        s.sentence,
        s.errorWord,
        s.clickedWord     || "—",
        correct,
        s.studentAnswer   || "—"
      ];
    });
  
    doc.autoTable({
      startY: 30,
      head: [["#", "Sentence", "Error", "Clicked", "Correct Answer", "Your Entry"]],
      body,
      headStyles: { fillColor: [41,128,185], textColor: 255 },
      bodyStyles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245,245,245] },
      didParseCell: function(data) {
        if (data.section !== 'body') return;
  
        // ─── Updated Clicked column (index 3) ────────────────────────────────
  if (data.column.index === 3) {
    // normalize clicked: lowercase, trim, remove punctuation
    const clickedRaw  = String(data.cell.raw).toLowerCase().trim();
    const clickedNorm = clickedRaw.replace(/[^\w\s]|_/g, "");

    // normalize errorWord from column 2 in the same way
    const errorRaw    = String(data.row.raw[2]).toLowerCase().trim();
    const errorNorm   = errorRaw.replace(/[^\w\s]|_/g, "");

    data.cell.styles.textColor = (clickedNorm === errorNorm)
      ? [0,128,0]  // green
      : [255,0,0]; // red
  }
  
        // Your Entry column (index 5): green if one of the correct answers, else red
        if (data.column.index === 5) {
          const student    = String(data.cell.raw).toLowerCase().trim();
          const correctRaw = String(data.row.raw[4]);
          const possible   = correctRaw.split(" / ").map(a => a.toLowerCase().trim());
          data.cell.styles.textColor = possible.includes(student)
            ? [0,128,0]
            : [255,0,0];
        }
      }
    });
  
    doc.save("SpanglishFixit_Report.pdf");
  }
  
}

// Sample sentences for testing
const sentences = [
    { 
        sentence: "It depends of the person.", 
        errorWord: "of",
        correctAnswer: "on"
    },
    { 
        sentence: "There is too much air contamination in Madrid.", 
        errorWord: "contamination",
        correctAnswer: "pollution"
    },
    { 
        sentence: "I went to a bar last night but it was almost empty. There were little people there.", 
        errorWord: "little",
        correctAnswer: "few"
    },
    { 
        sentence: "I couldn’t assist the meeting.", 
        errorWord: "assist",
        correctAnswer: "attend"
    },
    { 
        sentence: "Today’s class was very bored.", 
        errorWord: "bored",
        correctAnswer: "boring"
    },
    { 
        sentence: "She usually lives with her friends, but actually, she's staying with her mum while she recovers.", 
        errorWord: "actually",
        correctAnswer: ["currently", "at the moment"]
    },
    { 
        sentence: "Don’t shout at him. He’s very sensible.", 
        errorWord: "sensible",
        correctAnswer: "sensitive"
    },
    { 
        sentence: "She presented me to her friend Bea.", 
        errorWord: "presented",
        correctAnswer: "introduced"
    },
    { 
        sentence: "I don’t have no money.", 
        errorWord: "no",
        correctAnswer: "any"
    },
    { 
        sentence: "She gave me some good advices.", 
        errorWord: "advices",
        correctAnswer: "advice"
    },
    { 
        sentence: "I did a big effort.", 
        errorWord: "did",
        correctAnswer: "made"
    },
    { 
        sentence: "It’s an important amount of material.", 
        errorWord: "important",
        correctAnswer: ["significant", "considerable"]
    },
    {
        sentence: "I’m thinking in buying a new car.",
        errorWord: "in",
        correctAnswer: ["about", "of"]
    },
    {
        sentence: "The exam consists in 5 different papers.",
        errorWord: "in",
        correctAnswer: "of"
    },
    {
        sentence: "It was a real deception when I failed the exam.",
        errorWord: "deception",
        correctAnswer: "disappointment"
    },
    {
        sentence: "My favourite travel was when I went to Thailand.",
        errorWord: "travel",
        correctAnswer: "trip"
    },
    {
        sentence: "He’s absolutely compromised to the company’s goals.",
        errorWord: "compromised",
        correctAnswer: "committed"
    },
    {
        sentence: "This is your final advice! Don’t be late again.",
        errorWord: "advice",
        correctAnswer: "warning"
    },
    {
        sentence: "If you approve this final test, you’ll get the job.",
        errorWord: "approve",
        correctAnswer: "pass"
    },
    {
        sentence: "Could you give me the direction for the new offices?",
        errorWord: "direction",
        correctAnswer: "address"
    },
    {
        sentence: "They got very bad notes in their exams.",
        errorWord: "notes",
        correctAnswer: ["marks", "grades"]
    },
    {
        sentence: "You shouldn’t talk to the bus conductor while she’s driving.",
        errorWord: "conductor",
        correctAnswer: "driver"
    },
    {
        sentence: "We stayed in a camping, but it was dirty and overcrowded.",
        errorWord: "camping",
        correctAnswer: ["campsite", "camp site"]
    },
    {
        sentence: "Is there a public parking near here?",
        errorWord: "parking",
        correctAnswer: ["car park", "parking lot"]
    },
    {
        sentence: "Were you expecting to see him there or was it just a casualty?",
        errorWord: "casualty",
        correctAnswer: "coincidence"
    },
    {
        sentence: "I really can’t support people like that!",
        errorWord: "support",
        correctAnswer: "stand"
    },
    {
        sentence: "I don’t eat jam because I’m a vegetarian.",
        errorWord: "jam",
        correctAnswer: "ham"
    },
    {
        sentence: "I always take a coffee before going to work.",
        errorWord: "take",
        correctAnswer: ["have", "drink"]
    },
    {
        sentence: "That was a very long history.",
        errorWord: "history",
        correctAnswer: "story"
    },
    {
        sentence: "It was a very tired journey.",
        errorWord: "tired",
        correctAnswer: "tiring"
    },
    {
        sentence: "I have afraid of spiders.",
        errorWord: "have",
        correctAnswer: "am"
    },
    {
        sentence: "I had lucky to get the job.",
        errorWord: "had",
        correctAnswer: "was"
    },
    {
        sentence: "People is always telling me that.",
        errorWord: "is",
        correctAnswer: "are"
    },
    {
        sentence: "I organized a big party but anybody came.",
        errorWord: "anybody",
        correctAnswer: ["nobody", "no one"]
    },
    {
        sentence: "I have a carpet here with all the relevant documents.",
        errorWord: "carpet",
        correctAnswer: "folder"
    },
    {
        sentence: "She’s responsible of training new employees.",
        errorWord: "of",
        correctAnswer: "for"
    },
    {
        sentence: "At the moment, I’m unemployment, but I’m looking for a job.",
        errorWord: "unemployment",
        correctAnswer: "unemployed"
    },
    {
        sentence: "My wife and I often discuss about stupid things.",
        errorWord: "discuss",
        correctAnswer: "argue"
    },
    {
        sentence: "You can’t avoid me from seeing my friends.",
        errorWord: "avoid",
        correctAnswer: ["prevent", "stop"]
    },
    {
        sentence: "I wish it doesn’t rain during your holiday!",
        errorWord: "wish",
        correctAnswer: "hope"
    },
    {
        sentence: "Atleti won Real Madrid last night.",
        errorWord: "won",
        correctAnswer: "beat"
    },
    {
        sentence: "I’ll have a shower before go out.",
        errorWord: "go",
        correctAnswer: "going"
    },
    {
        sentence: "Sarah doesn’t think he’s coming today but I think yes.",
        errorWord: "yes",
        correctAnswer: "so"
    },
    {
        sentence: "For a long and healthy life, it’s important to practise sport regularly.",
        errorWord: "practise",
        correctAnswer: "do"
    },
    {
        sentence: "The factory needs to contract more staff over the summer.",
        errorWord: "contract",
        correctAnswer: ["hire", "employ", "take on"]
    },
    {
        sentence: "I’ve never been in London, but I would really like to go.",
        errorWord: "in",
        correctAnswer: "to"
    },
    {
        sentence: "Don’t put attention to anything they say.",
        errorWord: "put",
        correctAnswer: "pay"
    },
    {
        sentence: "He’s talking with the phone right now.",
        errorWord: "with",
        correctAnswer: "on"
    },
    {
        sentence: "The flight was cancelled for the weather.",
        errorWord: "for",
        correctAnswer: ["because of", "due to"]
    },
    {
        sentence: "I have known them since seven years.",
        errorWord: "since",
        correctAnswer: "for"
    },
    {
        sentence: "I don’t know how it is called.",
        errorWord: "how",
        correctAnswer: "what"
    },
    {
        sentence: "I have a doubt about this.",
        errorWord: "doubt",
        correctAnswer: "question"
    },
    {
        sentence: "I have a lot of homeworks.",
        errorWord: "homeworks",
        correctAnswer: "homework"
    },
    {
        sentence: "She’s very good in maths.",
        errorWord: "in",
        correctAnswer: "at"
    },
    {
        sentence: "They remembered me of my cousins.",
        errorWord: "remembered",
        correctAnswer: "reminded"
    },
    {
        sentence: "She’s married with an Ethiopian man.",
        errorWord: "with",
        correctAnswer: "to"
    },
    {
        sentence: "I like going to a disco at the weekend.",
        errorWord: "disco",
        correctAnswer: "club"
    },
    {
        sentence: "He’s so educated. He always treats everybody with a lot of respect.",
        errorWord: "educated",
        correctAnswer: "polite"
    },
    {
        sentence: "He needs to go to university because he pretends to be a doctor.",
        errorWord: "pretends",
        correctAnswer: ["intends", "wants", "hopes"]
    },
    {
        sentence: "The noise from the neighbour’s house is molesting me.",
        errorWord: "molesting",
        correctAnswer: ["bothering", "annoying", "disturbing", "irritating"]
    },
    {
        sentence: "I liked the movie, but it was a little large for me.",
        errorWord: "large",
        correctAnswer: "long"
    },
    {
        sentence: "He got a great punctuation in the game.",
        errorWord: "punctuation",
        correctAnswer: "score"
    },
    {
        sentence: "Can you borrow me your pen?",
        errorWord: "borrow",
        correctAnswer: "lend"
    },
    {
        sentence: "She works as a commercial in a bank.",
        errorWord: "commercial",
        correctAnswer: ["saleswoman", "salesperson"]
    },
    {
        sentence: "They said me to wait here.",
        errorWord: "said",
        correctAnswer: "told"
    },
    {
        sentence: "They all agreed that rock-climbing would be more funny.",
        errorWord: "funny",
        correctAnswer: "fun"
    },
    {
        sentence: "Did you know that Jane is going to make a party on Friday?",
        errorWord: "make",
        correctAnswer: "have"
    },
    { 
        sentence: "There’s plenty more soap if you’re still hungry.", 
        errorWord: "soap", 
        correctAnswer: "soup"
    },
    { 
        sentence: "We knew each other in 1996.", 
        errorWord: "knew", 
        correctAnswer: "met"
    },
    { 
        sentence: "I lived in Japan during three years.", 
        errorWord: "during", 
        correctAnswer: "for"
    },
    { 
        sentence: "I have two brothers, María and Juan.", 
        errorWord: "brothers", 
        correctAnswer: "siblings"
    },
    { 
        sentence: "Jane works very hardly. She’s a workaholic.", 
        errorWord: "hardly", 
        correctAnswer: "hard"
    },
    { 
        sentence: "Our teacher puts us too much homework.", 
        errorWord: "puts", 
        correctAnswer: ["gives", "sets"]
    },
    { 
        sentence: "I prefer spending time with another people.", 
        errorWord: "another", 
        correctAnswer: "other"
    },
    { 
        sentence: "I usually visit my family in Christmas.", 
        errorWord: "in", 
        correctAnswer: "at"
    },
    { 
        sentence: "Tim’s not as taller as me.", 
        errorWord: "taller", 
        correctAnswer: "tall"
    },
    { 
        sentence: "It’s one of the safest city in the world.", 
        errorWord: "city", 
        correctAnswer: "cities"
    },
    { 
        sentence: "How many time do you need?", 
        errorWord: "many", 
        correctAnswer: "much"
    },
    { 
        sentence: "I'm watching a great serie at the moment.", 
        errorWord: "serie", 
        correctAnswer: "series"
    }
];

const game = new SpanglishFixitGame(sentences);
