//word game puzzle
const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const answerLength = 5;
let done = false;
const rouds = 6;

async function init ()
{
    var currenGuess = "";
    var currentRow = 0;

    // get the word from the server using a fetch request
    const response = await fetch("https://words.dev-apis.com/word-of-the-day"); //allow cors
    const resObjet = await response.json(); // convert to json
    const word = resObjet.word.toUpperCase();   // get the word from the response
    const wordParts = word.split(''); // split the word into an array of letters
    const wordMap = makeMap(wordParts); // make a map of the word
    console.log(word);
    setLoading(false);

    function addLetter (letter) // add letter to html page
    {
        
        if(currenGuess.length < answerLength) // check if the guess is less than 5
        {
            
            currenGuess += letter; // add letter to guess

        } else{
            currenGuess = currenGuess.substring(1, answerLength-1) + letter; // remove last letter and add new letter
        }

        letters[answerLength * currentRow + currenGuess.length - 1].innerText = letter;  // update letter on screen
    }

    async function commit(){
        if(currenGuess.length ==! answerLength) // check if the guess is 5
        {
            return; // do nothing
        }

        // Check if word user enter is a valid word or not by using post request
        setLoading(true);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({word: currenGuess}),
        });

        const resObj = await res.json();
        setLoading(false);

        if(resObj.validWord == false) // check if the word is valid
        {
            for(var i = 0; i < answerLength; i++) // Flash the letters red
            {
                letters[answerLength * currentRow + i].classList.add('invalid');
            }
            return;
        }


        const guessParts = currenGuess.split(''); // split the guess into an array

        // check if the guess is equal to the word character by character
        for(var i = 0; i < answerLength; i++)
        {
            if(guessParts[i] == wordParts[i])
            {
                letters[answerLength * currentRow + i].classList.add('correct'); // add correct class to letter§§
                // delete the letter from the map so it can't be used again
                wordMap.set(guessParts[i], wordMap.get(guessParts[i]) - 1);
            } 
        }
         // check if the guess is close to the word character by character
        for(var i = 0; i < answerLength; i++)
        {
            //first check if the letter is correct
            if(guessParts[i] == wordParts[i]){
                continue; // skip to next letter
            }
            // check if the character in the guess is close to the character in the word
            else if(wordParts.includes(guessParts[i]) && wordMap.get(guessParts[i]) > 0){
                letters[answerLength * currentRow + i].classList.add('close'); // add close class to letter
            }
            // else the letter is wrong
            else{
                letters[answerLength * currentRow + i].classList.add('wrong'); // add wrong class to letter
            }
        }

        
        currentRow++; // increment row

        //win condition
        if(currenGuess == word) // check if the guess is the word
        {
            document.querySelector('.brand').classList.add('winner'); // win animation
            done = true;
            return;
        }

        //lose condition
        if(currentRow == rouds) // Check if the current row is 6 (6 rows)
        {
            alert("You Lose!");
            done = true;
            return;
        }

        currenGuess = ""; // reset guess
    }

    function backspace(){
        if(currenGuess.length == 0) // check if guess is empty
        {
            return; // do nothing
        }
        currenGuess = currenGuess.substring(0, currenGuess.length - 1); // remove last letter
        letters[answerLength * currentRow + currenGuess.length].innerText = ""; // update letter on screen
    }

    document.addEventListener('keydown', function handelKeydown (event) {
        if(done) // check if the game is done
        {
            return; // do nothing
        }

        const action = event.key;
        console.log(action);

        if (action === 'Enter') {
            commit(); // handle enter key
        } else if(action === 'Backspace') {
            backspace(); // handle backspace
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase()); 
        } else {
            console.log('invalid key'); // do nothing, this can be anything
        }
    });
}
// handle letter small or capital
function isLetter (str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
}

function setLoading(isLoading){ // show loading screen
    if(isLoading){ 
        loadingDiv.classList.remove('hidden'); // hide loading screen
    } else {
        loadingDiv.classList.add('hidden');  // show loading screen alternatively you can use .toggle('hidden', isLoading)
    }
}

//make mape of each letter how many times it appears

function makeMap(array)
{
    var map = new Map();
    for(var i = 0; i < array.length; i++)
    {
        if(map.has(array[i]))
        {
            map.set(array[i], map.get(array[i]) + 1);
        } else{
            map.set(array[i], 1);
        }
    }
    return map;
}


init();
 
 