document.addEventListener("DOMContentLoaded", () => {

    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;
    
    let word;
    let guessedWordCount = 0;

    /* Control keyboard log-ins */
    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord(){
        fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`, {
            "method": "GET",
            "headers": {
                'X-RapidAPI-Key': '433f2982f1msh9f532cb84f440c6p13b115jsn47cfb9e34dd1',
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            }
          })
          .then(response => {
            return response.json();
          })
          .then((res) => {
            word = res.word;
          })
          .catch(err => {
            console.error(err);
          });
    }

    function getCurrentWordArray(){
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArray();

        if (currentWordArr && currentWordArr.length < 5){
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

   function getTileColor(letter, index){
    const isCorrect = word.includes(letter);

    if (!isCorrect){
        return "rgb(58, 58, 60)";
    }

    const letterInPosition = word.charAt(index);
    const rightPosition = (letter == letterInPosition);

    if (rightPosition){
        return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
   }
   
    function handleSubmitWord(){
        const currentWordArr = getCurrentWordArray();
        if (currentWordArr.length != 5){
            window.alert("Word must contain 5 letters");
        }

        const currentWord = currentWordArr.join("");

        fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
            "method": "GET",
            "headers": {
                'X-RapidAPI-Key': '433f2982f1msh9f532cb84f440c6p13b115jsn47cfb9e34dd1',
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            }
        })
        .then((res) => {
            if (!res.ok){
                throw Error();
            }

            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index);
    
                    const letterId = firstLetterId + index;
                    const letterEl = document.getElementById(letterId);
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                }, interval * index);
            });
    
            guessedWordCount += 1;
    
            if (currentWord == word){
                window.alert("Congradulations!");
            }
    
            if (guessedWords.length === 6){
                window.alert(`Failed for today! The word is ${word}.`);
            }
    
            guessedWords.push([]);
        })
        .catch(() => {
            window.alert("This is not a word.");
        })
    }

    /* Create grid */
    function createSquares(){
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter(){
        const currentWordArr = getCurrentWordArray();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = '';
        availableSpace = availableSpace - 1;
    }

    for (let index = 0; index < keys.length; index++){
        keys[index].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if (letter == "enter"){
                handleSubmitWord();
                return;
            }

            if (letter == "del"){
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }

})