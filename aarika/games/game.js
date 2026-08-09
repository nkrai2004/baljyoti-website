const $ = id => document.getElementById(id);

let state = {
  name:"Explorer", score:0, coins:0, lives:3, streak:0, hints:3,
  index:0, timer:60, timerId:null, checkpoint:0, bossHp:5, bossIndex:0,
  answered:false, questions:[]
};

const WORLD_NAMES = ["Triangle Village","Ratio Forest","Ratio Mountain","Complement Bridge","Standard Value Castle","Identity Fortress"];

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
}

function setHud(){
  $("playerName").textContent=state.name;
  $("sideName").textContent=state.name;
  $("score").textContent=state.score;
  $("coins").textContent=state.coins;
  $("lives").textContent=state.lives;
  $("streak").textContent=state.streak;
  $("hints").textContent=state.hints;
  $("checkpoint").textContent=state.checkpoint;
  $("rank").textContent =
    state.score >= 1800 ? "Trigonometry Champion" :
    state.score >= 1200 ? "Trigonometry Master" :
    state.score >= 700 ? "Trigo Explorer" :
    state.score >= 300 ? "Ratio Ranger" : "Triangle Rookie";
}

function prepareQuestions(){
  state.questions = [...QUESTION_BANK].sort(()=>Math.random()-0.5).slice(0,15);
}

function startGame(){
  state = {...state, name:($("nameInput").value.trim() || "Explorer"), score:0, coins:0, lives:3,
    streak:0,hints:3,index:0,timer:60,checkpoint:0,bossHp:5,bossIndex:0,answered:false};
  prepareQuestions();
  setHud();
  show("game");
  loadQuestion();
}

function startTimer(){
  clearInterval(state.timerId);
  state.timer=60;
  $("timer").textContent=state.timer;
  state.timerId=setInterval(()=>{
    state.timer--;
    $("timer").textContent=state.timer;
    if(state.timer<=0){
      clearInterval(state.timerId);
      timeoutQuestion();
    }
  },1000);
}

function loadQuestion(){
  state.answered=false;
  const q=state.questions[state.index];
  $("worldTitle").textContent=q.world;
  $("topicTag").textContent=q.topic;
  $("question").textContent=q.q;
  $("formulaBox").classList.add("hidden");
  $("feedback").className="feedback";
  $("feedback").textContent="";
  $("questionNumber").textContent=(state.index%5)+1;
  $("progressBar").style.width=`${((state.index%5)+1)/5*100}%`;
  $("roadblock").innerHTML="<span>🚧 ROADBLOCK</span><small>Solve to cross!</small>";
  const options=$("options"); options.innerHTML="";
  q.options.forEach((text,i)=>{
    const b=document.createElement("button");
    b.className="option"; b.textContent=`${String.fromCharCode(65+i)}. ${text}`;
    b.onclick=()=>answerQuestion(i,b);
    options.appendChild(b);
  });
  setHud();
  startTimer();
}

function lockOptions(container){
  [...container.querySelectorAll(".option")].forEach(b=>b.disabled=true);
}

function answerQuestion(choice, button){
  if(state.answered)return;
  state.answered=true; clearInterval(state.timerId);
  const q=state.questions[state.index];
  const all=[...$("options").querySelectorAll(".option")];
  all[q.answer].classList.add("correct");
  if(choice===q.answer){
    state.streak++;
    const speedBonus=state.timer>=50?50:0;
    state.score+=100+speedBonus+(state.streak>=3?25:0);
    state.coins+=10;
    $("feedback").className="feedback good";
    $("feedback").textContent=`✅ Correct! ${q.explain}`;
    $("roadblock").innerHTML="<span>🟢 ROADBLOCK CLEARED!</span><small>+XP +Coins</small>";
  }else{
    state.streak=0; state.lives--;
    button.classList.add("wrong");
    $("feedback").className="feedback bad";
    $("feedback").textContent=`❌ Not quite. ${q.explain}`;
  }
  lockOptions($("options")); setHud();
  setTimeout(afterQuestion,1500);
}

function timeoutQuestion(){
  if(state.answered)return;
  state.answered=true; state.streak=0; state.lives--;
  $("feedback").className="feedback bad";
  $("feedback").textContent="⏰ TIME OUT! The roadblock takes a life. Moving on...";
  lockOptions($("options")); setHud();
  setTimeout(afterQuestion,1200);
}

function skipQuestion(){
  if(state.answered)return;
  state.answered=true; clearInterval(state.timerId);
  state.streak=0; state.lives--;
  $("feedback").className="feedback info";
  $("feedback").textContent="⏭️ Skipped — 1 life lost. Keep moving!";
  lockOptions($("options")); setHud();
  setTimeout(afterQuestion,1000);
}

function afterQuestion(){
  if(state.lives<=0){ gameOver(); return; }
  state.index++;
  if(state.index>0 && state.index%5===0){
    state.checkpoint++;
    state.score+=100; state.coins+=25;
    $("checkpointMessage").textContent=`Checkpoint ${state.checkpoint} secured! You're ready for the next zone.`;
    setHud(); show("checkpointScreen");
  }else if(state.index>=15){
    showBoss();
  }else{
    loadQuestion();
  }
}

function continueGame(){
  if(state.index>=15) showBoss();
  else { show("game"); loadQuestion(); }
}

function useHint(){
  if(state.answered)return;
  if(state.hints<=0){alert("No hint tokens left!");return;}
  if(state.coins<10){alert("You need 10 coins for a hint.");return;}
  const q=state.questions[state.index];
  state.hints--; state.coins-=10;
  const wrong=[...Array(q.options.length).keys()].filter(i=>i!==q.answer);
  wrong.sort(()=>Math.random()-0.5).slice(0,2).forEach(i=>{
    const btn=$("options").children[i];
    btn.disabled=true; btn.style.opacity=".35";
    btn.textContent="❌ eliminated";
  });
  $("feedback").className="feedback info";
  $("feedback").textContent="💡 Hint used! Two wrong options have been eliminated.";
  setHud();
}

function showBoss(){
  clearInterval(state.timerId); state.bossHp=5; state.bossIndex=0;
  loadBoss(); show("boss");
}

function loadBoss(){
  const q=BOSS_QUESTIONS[state.bossIndex];
  $("bossQuestion").textContent=q.q;
  $("bossFeedback").className="feedback";
  $("bossFeedback").textContent="";
  $("bossHp").textContent="❤️".repeat(state.bossHp);
  const box=$("bossOptions"); box.innerHTML="";
  q.options.forEach((text,i)=>{
    const b=document.createElement("button"); b.className="option";
    b.textContent=`${String.fromCharCode(65+i)}. ${text}`;
    b.onclick=()=>answerBoss(i,b); box.appendChild(b);
  });
}

function answerBoss(choice,button){
  const q=BOSS_QUESTIONS[state.bossIndex];
  const all=[...$("bossOptions").querySelectorAll(".option")];
  all[q.answer].classList.add("correct");
  if(choice===q.answer){
    state.bossHp--; state.score+=200; state.coins+=20;
    $("bossFeedback").className="feedback good";
    $("bossFeedback").textContent=`🎯 Direct hit! ${q.explain}`;
  }else{
    state.lives--; state.streak=0;
    button.classList.add("wrong");
    $("bossFeedback").className="feedback bad";
    $("bossFeedback").textContent=`💥 Boss counterattack! ${q.explain}`;
  }
  setHud(); lockOptions($("bossOptions"));
  setTimeout(()=>{
    if(state.lives<=0){gameOver();return}
    if(state.bossHp<=0){victory();return}
    state.bossIndex++;
    if(state.bossIndex>=BOSS_QUESTIONS.length) state.bossIndex=0;
    loadBoss();
  },1300);
}

function gameOver(){
  clearInterval(state.timerId);
  $("gameOverScore").textContent=state.score;
  show("gameOver");
}

function victory(){
  clearInterval(state.timerId);
  $("finalXP").textContent=state.score;
  $("finalCoins").textContent=state.coins;
  show("victory");
}

$("startBtn").onclick=startGame;
$("skipBtn").onclick=skipQuestion;
$("hintBtn").onclick=useHint;
$("continueBtn").onclick=continueGame;
$("restartBtn").onclick=()=>{show("lobby");};
$("playAgainBtn").onclick=()=>{show("lobby");};
$("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter")startGame()});

setHud();
