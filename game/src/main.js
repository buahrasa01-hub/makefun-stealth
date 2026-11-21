import { HEIGHT, STEP, WIDTH, STARTING_LIVES, PEBBLES_PER_LEVEL } from './config.js';
import { LEVELS } from './levels.js';
import { makeGuards, updateGuards } from './guards.js';
import { makePlayer, updatePlayer } from './player.js';
import { createInput, readControls, takePress } from './input.js';
import { render } from './render.js';
import { sound, primeAudio } from './audio.js';
import { stageShot } from './shots.js';

const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
canvas.width=WIDTH;canvas.height=HEIGHT;
const input=createInput(canvas);
let savedBest=0;try{savedBest=Number(localStorage.getItem('kucing-senja-best'))||0;}catch{}
const params=new URLSearchParams(location.search);
const seed=Number(params.get('seed'))||1;

const state={levelIndex:0,level:null,player:null,guards:[],fish:[],fishCount:0,pebbles:3,lives:STARTING_LIVES,score:0,best:savedBest,levelScore:0,levelTime:0,elapsed:0,alert:0,combo:0,comboTime:0,everSeen:false,screen:'title',noise:null,effects:[],stars:1,seed};
state.loadLevel=(index)=>{
  state.levelIndex=index;state.level=LEVELS[index];state.player=makePlayer(state.level.playerStart);state.guards=makeGuards(state.level);
  state.fish=state.level.fish.map((f)=>({...f,taken:false}));state.fishCount=0;state.pebbles=PEBBLES_PER_LEVEL;
  state.levelTime=0;state.alert=0;state.everSeen=false;state.noise=null;state.effects=[];state.combo=0;state.comboTime=0;
};
state.startGame=()=>{state.score=0;state.lives=STARTING_LIVES;state.elapsed=0;state.loadLevel(0);state.screen='play';primeAudio();};
state.catchPlayer=()=>{if(state.screen!=='play')return;state.lives-=1;state.screen=state.lives<=0?'game-over':'caught';sound('caught');};
state.completeLevel=()=>{
  if(state.screen!=='play')return;
  const fast=state.levelTime<88,all=state.fishCount===state.fish.length;
  state.stars=1+(state.everSeen?0:1)+(fast&&all?1:0);
  state.levelScore=150+state.fishCount*40+Math.max(0,120-Math.floor(state.levelTime))*3;
  state.score+=state.levelScore;state.screen='level-complete';sound('win');
};
state.saveBest=()=>{state.best=Math.max(state.best,state.score);try{localStorage.setItem('kucing-senja-best',String(state.best));}catch{}};
state.advance=()=>{
  if(state.levelIndex<LEVELS.length-1){state.loadLevel(state.levelIndex+1);state.screen='play';}
  else{state.screen='win';state.saveBest();sound('win');}
};
state.loadLevel(0);window.__gameDebug={state};

function menuAction(){return Boolean(input.click)||takePress(input,'enter',' ','r');}
function step(dt){
  state.elapsed+=dt;
  if(state.screen==='title'){if(menuAction()){input.click=null;state.startGame();}return;}
  if(state.screen==='paused'){if(takePress(input,'escape','p','enter')||input.click){input.click=null;state.screen='play';}return;}
  if(state.screen==='caught'){
    if(menuAction()){input.click=null;if(state.lives<=0){state.screen='game-over';}else{state.loadLevel(state.levelIndex);state.screen='play';}}return;
  }
  if(state.screen==='game-over'||state.screen==='win'){if(menuAction()){input.click=null;state.startGame();}return;}
  if(state.screen==='level-complete'){if(menuAction()){input.click=null;state.advance();}return;}
  if(takePress(input,'escape','p')){state.screen='paused';return;}
  if(takePress(input,'r')){state.loadLevel(state.levelIndex);state.screen='play';return;}
  const oldAlert=state.alert;state.levelTime+=dt;state.effects=state.effects.filter((e)=>{e.life-=dt;return e.life>0;});
  updatePlayer(state,readControls(input),dt);updateGuards(state,dt);
  if(oldAlert<=.7&&state.alert>.7)sound('alert');
}

const shot=params.get('shot');
if(shot){stageShot(shot,state);render(ctx,state);render(ctx,state);window.__shotReady=true;}
else{
  let previous=performance.now(),accumulator=0;
  function frame(now){const elapsed=Math.min(.1,(now-previous)/1000);previous=now;accumulator+=elapsed;while(accumulator>=STEP){step(STEP);accumulator-=STEP;}render(ctx,state);requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
}
