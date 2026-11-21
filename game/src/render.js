import { drawWorld } from './art.js';

function label(c,value,x,y,size=14,color='#f4dfbb',weight=600,align='left'){c.fillStyle=color;c.font=`${weight} ${size}px system-ui, sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillText(value,x,y);}
function pane(c,x,y,w,h,alpha=.92){c.save();c.fillStyle=`rgba(22,25,42,${alpha})`;c.beginPath();c.roundRect(x,y,w,h,15);c.fill();c.strokeStyle='rgba(238,195,126,.42)';c.lineWidth=1;c.stroke();c.restore();}
function paw(c,x,y,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y+3,6,5,0,0,Math.PI*2);c.fill();for(let i=0;i<3;i++){c.beginPath();c.arc(x-5+i*5,y-4-(i===1?2:0),2,0,Math.PI*2);c.fill();}}

export function drawHud(c,s){
  const g=c.createLinearGradient(0,0,0,68);g.addColorStop(0,'rgba(18,21,38,.97)');g.addColorStop(1,'rgba(25,27,43,.88)');c.fillStyle=g;c.fillRect(0,0,1280,68);c.fillStyle='#d99b5a';c.fillRect(0,66,1280,2);
  label(c,'KUCING SENJA',20,17,10,'#e1ad69',800);label(c,s.level.name,20,41,18,'#fff0d1',700);
  label(c,`${s.fishCount}/${s.fish.length} IKAN`,224,27,15,'#ffe1a3',700);label(c,'FISH',224,49,9,'#a9a9b8',600);
  label(c,'ALERT',406,18,9,s.alert>.55?'#ff8978':'#d3c6ad',700);
  c.fillStyle='#494453';c.beginPath();c.roundRect(406,30,244,17,8);c.fill();
  const meter=c.createLinearGradient(408,0,648,0);meter.addColorStop(0,'#e3ae5e');meter.addColorStop(.65,'#f2795d');meter.addColorStop(1,'#ed4c57');
  if(s.alert>0){c.fillStyle=meter;c.beginPath();c.roundRect(408,32,Math.max(4,240*s.alert),13,6);c.fill();}
  label(c,s.alert>.7?'DANGER':s.alert>.3?'EYES ON YOU':'CLEAR',528,57,9,s.alert>.55?'#ff9c89':'#cfc3ae',700,'center');
  label(c,`SCORE  ${String(s.score).padStart(5,'0')}`,692,28,13,'#f3deb9',700);
  const seconds=Math.floor(s.levelTime);label(c,`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`,894,28,14,'#e7decf',700);label(c,'TIME',894,49,9,'#a9a9b8',600);
  label(c,`PEBBLES  ${'● '.repeat(s.pebbles).trim()||'—'}`,1000,28,12,'#f1cf89',700);
  label(c,'LIVES',1154,18,9,'#bab0ab',700);for(let i=0;i<3;i++)paw(c,1160+i*27,42,i<s.lives?'#e79c63':'#58515b');
  if(s.level.hints?.length&&s.levelIndex===0&&s.screen==='play'){pane(c,18,394,302,62,.82);label(c,s.level.hints[0],34,414,10,'#f7dfad',700);label(c,s.level.hints[1],34,438,10,'#d6c8aa',600);}
}

function titleScreen(c,s){
  c.save();c.fillStyle='rgba(9,12,27,.26)';c.fillRect(0,68,1280,412);pane(c,42,92,365,326,.95);
  c.fillStyle='#eeb45e';c.beginPath();c.arc(89,132,23,0,Math.PI*2);c.fill();c.fillStyle='#25283d';c.beginPath();c.arc(101,123,22,0,Math.PI*2);c.fill();
  label(c,'A NIGHT MARKET TALE',72,177,10,'#e5b56d',800);label(c,'Kucing',72,216,38,'#fff0d4',800);label(c,'Senja',72,254,38,'#f0ad63',800);
  label(c,'Miko wants one last fish before dawn.',72,290,13,'#d9d2c8',500);label(c,'Stay low. Watch the lanterns. Leave unseen.',72,312,12,'#c2b9b1',500);
  c.fillStyle='#d28a50';c.beginPath();c.roundRect(70,343,210,42,11);c.fill();label(c,'BEGIN THE HEIST   →',175,364,13,'#281f2b',800,'center');
  label(c,'WASD MOVE   ·   SHIFT SNEAK   ·   CLICK PEBBLE',72,400,9,'#d4c6b1',700);
  label(c,`BEST  ${String(s.best||0).padStart(5,'0')}`,1232,91,12,'#ffe2a9',700,'right');
  c.restore();
}

function modal(c,title,subtitle,action,color='#f2c579'){
  pane(c,410,123,460,237,.97);c.save();c.textAlign='center';label(c,title,640,174,29,color,800,'center');label(c,subtitle,640,217,14,'#d8cfc4',500,'center');
  c.fillStyle='rgba(237,177,93,.18)';c.beginPath();c.roundRect(500,264,280,45,12);c.fill();label(c,action,640,286,13,'#ffe1a2',700,'center');c.restore();
}

export function render(c,s){
  c.clearRect(0,0,1280,480);drawWorld(c,s);
  if(s.screen==='play'||s.screen==='paused'||s.screen==='caught'||s.screen==='level-complete'||s.screen==='game-over'||s.screen==='win')drawHud(c,s);
  if(s.screen==='title'){titleScreen(c,s);return;}
  if(s.screen==='paused')modal(c,'PAUSED','The market keeps its secrets while you catch your breath.','ESC / P   ·   RESUME');
  if(s.screen==='caught')modal(c,'SPOTTED!','The watch closes in. You lose one life, then try again.','ENTER   ·   RETRY LEVEL','#f17a68');
  if(s.screen==='game-over')modal(c,'THE MARKET WAKES','Miko has run out of chances.','ENTER   ·   TRY AGAIN','#f17a68');
  if(s.screen==='level-complete'){
    modal(c,s.level.name.toUpperCase(),'Fish secured · the exit stayed quiet.',`+${s.levelScore}   ·   ${s.fishCount}/${s.fish.length} FISH`);
    const stars=s.stars||1;for(let i=0;i<3;i++){c.fillStyle=i<stars?'#f4c773':'#58525c';c.font='34px system-ui';c.textAlign='center';c.fillText('★',592+i*48,255);}
  }
  if(s.screen==='win')modal(c,'DAWN, AT LAST','Miko slipped through all three markets unseen.',`FINAL SCORE   ${s.score}   ·   BEST   ${s.best}`);
}
