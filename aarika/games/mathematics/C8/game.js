let S={name:"Explorer",score:0,coins:0,lives:3,streak:0,hints:3,index:0,timer:60,timerId:null,checkpoint:0,questions:[],answered:false,repairDone:false,bossHp:5,bossIndex:0,correct:0,bestStreak:0};

const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active")}
function hud(){ $("playerName").textContent=S.name;$("sideName").textContent=S.name;$("score").textContent=S.score;$("coins").textContent=S.coins;$("lives").textContent=S.lives;$("streak").textContent=S.streak;$("hints").textContent=S.hints;$("checkpoint").textContent=S.checkpoint;$("rank").textContent=S.score>=1800?"Trigonometry Champion":S.score>=1200?"Trigonometry Master":S.score>=700?"CBSE Warrior":S.score>=300?"Ratio Ranger":"Triangle Rookie"; }

const LEADERBOARD_KEY="trigoQuestLeaderboardV1";

function getLeaderboard(){
  try{return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)||"[]")}catch(e){return []}
}
function levelFromScore(score){
  if(score>=2500)return "Trigo Legend";
  if(score>=1800)return "Trigo Champion";
  if(score>=1200)return "Trigo Master";
  if(score>=700)return "CBSE Warrior";
  if(score>=300)return "Ratio Ranger";
  return "Triangle Rookie";
}
function savePlayerRecord(){
  const board=getLeaderboard();
  const existing=board.find(x=>x.name.toLowerCase()===S.name.toLowerCase());
  const record={
    name:S.name,score:S.score,coins:S.coins,correct:S.correct||0,
    bestStreak:S.bestStreak||S.streak||0,level:levelFromScore(S.score),
    lastPlayed:new Date().toISOString()
  };
  if(existing){
    existing.score=Math.max(existing.score||0,record.score);
    existing.coins=Math.max(existing.coins||0,record.coins);
    existing.correct=Math.max(existing.correct||0,record.correct);
    existing.bestStreak=Math.max(existing.bestStreak||0,record.bestStreak);
    existing.level=levelFromScore(existing.score);
    existing.lastPlayed=record.lastPlayed;
  }else board.push(record);
  board.sort((a,b)=>(b.score-a.score)||(b.correct-a.correct)||(b.bestStreak-a.bestStreak));
  localStorage.setItem(LEADERBOARD_KEY,JSON.stringify(board.slice(0,100)));
}
function renderLeaderboard(){
  const board=getLeaderboard();
  const body=$("leaderboardBody");body.innerHTML="";
  board.forEach((p,i)=>{
    const tr=document.createElement("tr");
    if(S.name && p.name.toLowerCase()===S.name.toLowerCase())tr.className="me";
    const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1);
    tr.innerHTML=`<td class="rank-medal">${medal}</td><td>${escapeHtml(p.name)}</td><td>⭐ ${p.score}</td><td>${p.correct}</td><td>🔥 ${p.bestStreak}</td><td>${p.level}</td>`;
    body.appendChild(tr);
  });
  if(!board.length)body.innerHTML='<tr><td colspan="6">No players yet. Start an adventure!</td></tr>';
  const me=board.findIndex(p=>S.name && p.name.toLowerCase()===S.name.toLowerCase());
  $("myRank").textContent=me>=0?`🏅 Your local rank: #${me+1} • ${board[me].score} XP`:"Play a game to enter the leaderboard.";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function openLeaderboard(){clearInterval(S.timerId);renderLeaderboard();show("leaderboard")}
function clearLeaderboard(){
  if(confirm("Clear all local Trigo Quest leaderboard records from this browser?")){
    localStorage.removeItem(LEADERBOARD_KEY);renderLeaderboard();
  }
}
function start(){S={...S,name:$("nameInput").value.trim()||"Explorer",score:0,coins:0,lives:3,streak:0,hints:3,index:0,timer:60,checkpoint:0,questions:[...QUESTION_BANK].sort(()=>Math.random()-.5).slice(0,20),answered:false,repairDone:false,bossHp:5,bossIndex:0,correct:0,bestStreak:0};hud();show("game");load();}
function timer(){clearInterval(S.timerId);S.timer=60;$("timer").textContent=60;S.timerId=setInterval(()=>{S.timer--;$("timer").textContent=S.timer;if(S.timer<=0){clearInterval(S.timerId);wrong(null,true)}},1000)}
function load(){S.answered=false;S.repairDone=false;let q=S.questions[S.index];$("worldTitle").textContent=q.topic.split(" • ")[0];$("topicTag").textContent=q.subtopic;$("difficulty").textContent=q.difficulty;$("question").textContent=q.q;$("questionNumber").textContent=S.index+1;$("progressBar").style.width=((S.index+1)/20*100)+"%";$("feedback").className="feedback";$("feedback").textContent="";$("roadblockText").textContent="🚧 ROADBLOCK";$("roadblockSmall").textContent="Solve to cross!";let box=$("options");box.innerHTML="";q.options.forEach((t,i)=>{let b=document.createElement("button");b.className="option";b.textContent=String.fromCharCode(65+i)+". "+t;b.onclick=()=>answer(i,b);box.appendChild(b)});hud();timer();}
function lock(box){[...box.querySelectorAll(".option")].forEach(b=>b.disabled=true)}
function answer(choice,b){if(S.answered)return;clearInterval(S.timerId);let q=S.questions[S.index];if(choice===q.answer){S.answered=true;S.streak++;S.correct++;S.bestStreak=Math.max(S.bestStreak,S.streak);S.score+=100+(S.timer>=50?50:0)+(S.streak>=3?25:0);S.coins+=10;b.classList.add("correct");$("feedback").className="feedback good";$("feedback").textContent="✅ Correct! "+q.explain;$("roadblockText").textContent="🟢 ROADBLOCK CLEARED!";$("roadblockSmall").textContent="+XP +Coins";lock($("options"));hud();setTimeout(next,1100)}else wrong(b,false)}
function wrong(button,timeout){if(S.answered)return;S.answered=true;let q=S.questions[S.index];S.streak=0;S.lives--;if(button)button.classList.add("wrong");[...$("options").querySelectorAll(".option")][q.answer].classList.add("correct");lock($("options"));hud();$("repairMistake").textContent=timeout?"⏰ Time ran out! The question was: "+q.q:"❌ Your answer was not the concept we needed. The correct answer is: "+q.options[q.answer];$("repairReference").textContent=q.reference;$("repairExplain").textContent=q.explain;$("repairQuestion").textContent="🎯 Quick Fix: "+q.repairQ;let box=$("repairOptions");box.innerHTML="";q.repairOptions.forEach((t,i)=>{let x=document.createElement("button");x.className="option";x.textContent=String.fromCharCode(65+i)+". "+t;x.onclick=()=>repair(i,x);box.appendChild(x)});$("repairFeedback").className="feedback";$("repairFeedback").textContent="";show("repair")}
function repair(choice,b){let q=S.questions[S.index];lock($("repairOptions"));if(choice===q.repairAnswer){S.score+=15;S.coins+=5;$("repairFeedback").className="feedback good";$("repairFeedback").textContent="🧠 Concept repaired! +15 Learning XP. The roadblock remembers your progress."}else{$("repairFeedback").className="feedback bad";$("repairFeedback").textContent="💡 Almost! Revisit "+q.reference+" and try the next challenge."}S.repairDone=true;hud();setTimeout(next,1200)}
function next(){if(S.lives<=0){savePlayerRecord();$("gameOverScore").textContent=S.score;show("gameOver");return}S.index++;if(S.index>=S.questions.length){boss();return}if(S.index%5===0){S.checkpoint++;S.score+=100;S.coins+=25;$("checkpointMessage").textContent="Checkpoint "+S.checkpoint+" secured! You earned bonus XP and coins.";hud();show("checkpointScreen")}else{show("game");load()}}
function continueGame(){show("game");load()}
function hint(){if(S.answered)return;if(S.hints<=0||S.coins<10){alert("You need 1 hint token and 10 coins.");return}S.hints--;S.coins-=10;let q=S.questions[S.index];let wrong=[...Array(q.options.length).keys()].filter(i=>i!==q.answer).sort(()=>Math.random()-.5).slice(0,2);wrong.forEach(i=>{let b=$("options").children[i];b.disabled=true;b.style.opacity=.3;b.textContent="❌ eliminated"});$("feedback").className="feedback info";$("feedback").textContent="💡 Hint used — two wrong choices eliminated.";hud()}
const BOSS=[{q:"Which identity is always true?",o:["sin²A+cos²A=1","sinA+cosA=1","tan²A=1","secA=tanA"],a:0,e:"Pythagorean identity."},{q:"If tan A=3/4, sin A is:",o:["3/5","4/5","5/4","3/4"],a:0,e:"Use the 3-4-5 triangle."},{q:"If sec A=13/12, tan A is:",o:["5/12","12/5","13/5","5/13"],a:0,e:"sec²−tan²=1."},{q:"sin 30° + cos 60° equals:",o:["0","1/2","1","2"],a:2,e:"Both are 1/2."},{q:"(sec A−tan A)(sec A+tan A) equals:",o:["0","1","sec²A","tan²A"],a:1,e:"sec²A−tan²A=1."}];
function boss(){clearInterval(S.timerId);S.bossHp=5;S.bossIndex=0;show("boss");bossLoad()}
function bossLoad(){let q=BOSS[S.bossIndex];$("bossHp").textContent="❤️".repeat(S.bossHp);$("bossQuestion").textContent=q.q;$("bossFeedback").textContent="";let box=$("bossOptions");box.innerHTML="";q.o.forEach((t,i)=>{let b=document.createElement("button");b.className="option";b.textContent=String.fromCharCode(65+i)+". "+t;b.onclick=()=>bossAnswer(i,b);box.appendChild(b)})}
function bossAnswer(i,b){let q=BOSS[S.bossIndex];lock($("bossOptions"));if(i===q.a){S.bossHp--;S.score+=200;S.coins+=20;b.classList.add("correct");$("bossFeedback").className="feedback good";$("bossFeedback").textContent="🎯 Direct hit! "+q.e}else{S.lives--;b.classList.add("wrong");$("bossFeedback").className="feedback bad";$("bossFeedback").textContent="💥 Boss counterattack! "+q.e}hud();setTimeout(()=>{if(S.lives<=0){savePlayerRecord();$("gameOverScore").textContent=S.score;show("gameOver");return}if(S.bossHp<=0){savePlayerRecord();$("finalXP").textContent=S.score;$("finalCoins").textContent=S.coins;let r=getLeaderboard().findIndex(p=>p.name.toLowerCase()===S.name.toLowerCase());$("finalRank").textContent=r>=0?`🏆 Local leaderboard rank: #${r+1}`:"";show("victory");return}S.bossIndex=(S.bossIndex+1)%BOSS.length;bossLoad()},1100)}
$("startBtn").onclick=start;
$("leaderboardBtn").onclick=openLeaderboard;
$("victoryLeaderboardBtn").onclick=openLeaderboard;
$("leaderboardBackBtn").onclick=()=>show("lobby");
$("clearLeaderboardBtn").onclick=clearLeaderboard;$("skipBtn").onclick=()=>wrong(null,false);$("hintBtn").onclick=hint;$("continueBtn").onclick=continueGame;$("restartBtn").onclick=()=>show("lobby");$("playAgainBtn").onclick=()=>show("lobby");$("nameInput").onkeydown=e=>{if(e.key==="Enter")start()};hud();
