let numOfQ = 5;
let docNumOfQ = document.querySelector(".quizApp .quizInfo .count span");
let circles = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quizArea");
let answersArea = document.querySelector(".answersArea");
let submit = document.querySelector(".submit-button");
let timer = document.querySelector(".countDown");

let qDuration = 20;
let rightAns = "";
let rightAnsCount = 0;
let cIndex =0;
docNumOfQ.innerHTML = numOfQ;
bullets(numOfQ);

function getQuizeQuestion(){
  let request = new XMLHttpRequest();

  request.onreadystatechange = function (){
    if (this.readyState === 4 && this.status ===200) {
      let questions = JSON.parse(this.responseText);
      console.log(questions);
      //console.log(typeof(questions));
      addQ(questions[cIndex], numOfQ);
      countDown(qDuration);

      submit.onclick = () => {
        if(cIndex < numOfQ){
          rightAns = questions[cIndex].right_ans;
        }
        //console.log(rightAns);
          cIndex++;
        
        checkAnswer(rightAns, numOfQ);
        if (cIndex < numOfQ) {
          quizArea.innerHTML="";
          answersArea.innerHTML = "";
          addQ(questions[cIndex], numOfQ);
        }
        currentQ();

        if (cIndex === numOfQ) {
          showResults();
          clearInterval(countDownInterval);
        }
      };

    }
  };

  request.open("GET","questions.json",true);
  request.send();
}

getQuizeQuestion();

function bullets(x){
  for (let index = 0; index < x; index++) {
    let circle = document.createElement("span");
    if (index === 0) {
      circle.className = "on";
    }
    circles.appendChild(circle);
  }
}

function addQ(obj, c) {
  let qHedding = document.createElement("h2");
  qHedding.appendChild(document.createTextNode(obj.title));
  quizArea.appendChild(qHedding);

  //choises adding
  for (let index = 1; index < c; index++) {
    let choose = document.createElement("div");
    choose.className = "choose";

    let input = document.createElement("input");
    input.type = "radio";
    input.id = `ans${index}`;
    input.name = "answers";
    input.dataset.answer = obj[`ans${index}`];

    let label = document.createElement("label");
    label.htmlFor = `ans${index}`;
    label.appendChild(document.createTextNode(obj[`ans${index}`]));
    choose.appendChild(input);
    choose.appendChild(label);
    answersArea.appendChild(choose);
  }

}

function checkAnswer(rAns, cout){
  let mAnswer = document.getElementsByName("answers");

  let urAns;

  for (let i = 0; i < mAnswer.length; i++) {
    if (mAnswer[i].checked) {
      urAns = mAnswer[i].dataset.answer;
    }
    
  }
  if (urAns === rAns) {
    rightAnsCount++;
  }
  //console.log(rightAnsCount);
}

function currentQ(){
  let circles = document.querySelectorAll(".bullets .spans span");
  let arrOfCircles = Array.from(circles);

  arrOfCircles.forEach( (span,index)=>{
    if(cIndex === index){
      span.className = "on";
    }
  });
}

function showResults(){
  let res = document.createElement("div");
  res.className = "results";
  let hRes = document.createElement("h2");
  let pRes = document.createElement("p");
  
  if (rightAnsCount < (numOfQ/2)) {
    hRes.appendChild(document.createTextNode("Ooops"));
  }
  if (rightAnsCount > (numOfQ/2) && rightAnsCount <numOfQ) {
    hRes.appendChild(document.createTextNode("Good"));
  }
  if (rightAnsCount === numOfQ) {
    hRes.appendChild(document.createTextNode("Perfect"));
  }
  pRes.innerHTML = `Your Answered ${rightAnsCount} Right from ${numOfQ}`
  res.appendChild(hRes);
  res.appendChild(pRes);
  document.body.appendChild(res);
}

function countDown(d) {
  let min =0;
  let sec =0;

  countDownInterval = setInterval(function (){
    min = parseInt(d/60);
    sec = parseInt(d%60);

    min = (min<10)? `0${min}`:min;
    sec = (sec<10)? `0${sec}`:sec;

    timer.innerHTML = `${min}:${sec}`;

    if (--d<0) {
      clearInterval(countDownInterval);
      cIndex = numOfQ-1;
      submit.click();
      //showResults();
    }
  }, 1000);

}

//If you want to set time for each question you can adjust countDown function as below:
/*
function countDown(d) {
  let min =0;
  let sec =0;

  countDownInterval = setInterval(function (){
    min = parseInt(d/60);
    sec = parseInt(d%60);

    min = (min<10)? `0${min}`:min;
    sec = (sec<10)? `0${sec}`:sec;

    timer.innerHTML = `${min}:${sec}`;

    if (--d<0) {
      clearInterval(countDownInterval);
      submit.click();
    }
  }, 1000);

}
then call function agian inside fuction in submit.onclick (bet. line 28 to 40)  ,dont forget to clearinterval before using fuction again
and removing the clear interval from if condition (line 44) 
*/