const questionArea = document.querySelector('.question-area');
const correctComment = document.querySelector('.correct-comment');
const uncorrectComment = document.querySelector('.uncorrect-comment');
const uncorrectCommentFooter = document.querySelector('.uncorrect-comment-footer');
const selectButtons = document.querySelectorAll('.select-button');
let selectedTile = [];
let correctAnswer = [];
let fourTimesTile = [];

function select(number){
    const targetButton = event.target.closest('.select-button');
    targetButton.classList.toggle('selected');
    if(selectedTile.includes(number)){
        const index = selectedTile.indexOf(number);
        if (index !== -1) {
            selectedTile.splice(index, 1);
        }
    }else{
        selectedTile.push(number);
        selectedTile.sort((a, b) => a - b);
    }
}

// 1~9までランダムな整数を生成
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

// 13個生成、一つにつき四つまで生成
function generateRandomArray() {
    const maxCount = 4;
    const maxNumber = 9;
    const targetLength = 13;
    let countMap = {};
    let result = [];

    while (result.length < targetLength) {
        let num = getRandomNumber(maxNumber);

        if (!countMap[num]) {
            countMap[num] = 0;
        }

        if (countMap[num] < maxCount) {
            result.push(num);
            countMap[num]++;
            if(countMap[num] === maxCount){
                fourTimesTile.push(num);
                fourTimesTile.sort((a, b) => a - b);
            }
        }
    }
    return result.sort((a, b) => a - b);
}


// 問題を生成
function generateQuestion(){
    let correctTile = 1;
    fourTimesTile = [];
    questionArea.innerHTML = '';
    const createQuestion = generateRandomArray();
    let cloneQuestion = [...createQuestion];
    for(let i = 0; i < createQuestion.length; i++){
        const createTile = document.createElement('img');
        createTile.setAttribute('src',`img/s${createQuestion[i]}.png`);
        createTile.draggable = false;
        questionArea.appendChild(createTile);
    }

    for(let i = 1; i < 10; i++){
        if(!fourTimesTile.includes(i)){
            cloneQuestion.push(i);
            cloneQuestion.sort((a, b) => a - b);
            // 出現回数をカウントするオブジェクト
            const countMap = {};

            // 元の配列をループして出現回数をカウント
            for (let num of cloneQuestion) {
                if (countMap[num]) {
                    countMap[num]++;
                } else {
                    countMap[num] = 1;
                }
            }

            // カウントされた出現回数を新たな配列に格納
            const hand = [];
            for (let i = 1; i < 10; i++) {
                hand.push(countMap[i] || 0);
            }
            function checkMentsu(hand){
              let r, a = hand[0], b = hand[1];

              for(let i=0; i<7; i++){
                if(r=a%3, b>=r && hand[i+2]>=r){
                  a=b-r; b=hand[i+2]-r;
                }
                else return false;
              }

              if(a%3==0 && b%3==0) return true;
              else return false;
            }

            function checkHola(hand) {
                let p = 0;

                // 最初のループ: pの計算
                for (let i = 0; i < 9; i++) {
                    p += i * hand[i];
                }

                // 2番目のループ: handの操作と条件判定
                for (let i = p * 2 % 3; i < 9; i += 3) {
                    // hand[i]を2減算する
                    hand[i] -= 2;

                    // hand[i]が0以上の場合に処理を続行
                    if (hand[i] >= 0) {
                        // checkMentsu(hand)が真の場合
                        if (checkMentsu(hand)) {
                            // hand[i]を元に戻し、trueを返す
                            hand[i] += 2;
                            return true;
                        }
                    }

                    // hand[i]を元に戻す
                    hand[i] += 2;
                }

                // どの条件も満たさなかった場合、falseを返す
                return false;
            }
            if(checkHola(hand) === true){
                correctAnswer.push(correctTile);
            }
            correctTile++;
            cloneQuestion = [...createQuestion];
        }else{
            correctTile++;
        }
    }
    correctTile = 1;
}

function compareAnswer(selectedTile, correctAnswer){
    if(selectedTile.length !== correctAnswer.length){
        return false;
    }
    for (let i = 0; i < selectedTile.length; i++) {
        if (selectedTile[i] !== correctAnswer[i]) {
            return false;
        }
    }
    return true;
}

function answer(){
    selectButtons.forEach(function(button){
        button.disabled = true;
    });
    if(compareAnswer(selectedTile, correctAnswer)){
        correctComment.classList.add('visible');
    }else{
        uncorrectCommentFooter.innerHTML = '';
        uncorrectComment.classList.add('visible');
        if(correctAnswer.length !== 0){
            for(let i = 0; i < correctAnswer.length; i++){
                const createTile = document.createElement('img');
                createTile.setAttribute('src',`img/s${correctAnswer[i]}.png`);
                createTile.draggable = false;
                uncorrectCommentFooter.appendChild(createTile);
            }
        }else{
            const newText = document.createElement('span');
            newText.innerText = 'ノーテン';
            uncorrectCommentFooter.appendChild(newText);
        }
    }
    document.querySelector('.answer-button').classList.remove('showed');
    document.querySelector('.next-button').classList.add('showed');
}

function next(){
    document.querySelector('.visible').classList.remove('visible');
    selectButtons.forEach(function(button){
        button.disabled = false;
    });
    let selected = document.querySelectorAll('.selected');
    for(let i = 0; i < selected.length; i++){
        selected[i].classList.remove('selected');
    }
    selectedTile = [];
    correctAnswer = [];
    generateQuestion();
    document.querySelector('.next-button').classList.remove('showed');
    document.querySelector('.answer-button').classList.add('showed');
}

// 開始時に一度生成
generateQuestion();
