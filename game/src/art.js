import { WIDTH, HEIGHT } from './config.js';

const stalls=['#b76553','#d29a52','#507c78'];
function roundBox(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
function glow(c,x,y,r,color,alpha=.3){const g=c.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(245,174,79,0)');c.save();c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();}

export function drawFloor(c,state){
  const grad=c.createLinearGradient(0,0,WIDTH,HEIGHT);grad.addColorStop(0,'#24283e');grad.addColorStop(.54,'#343449');grad.addColorStop(1,'#202a3b');c.fillStyle=grad;c.fillRect(0,0,WIDTH,HEIGHT);
  c.save();c.globalAlpha=.12;c.strokeStyle='#d0b58a';c.lineWidth=1;
  for(let x=20;x<WIDTH;x+=52){c.beginPath();c.moveTo(x,66);c.lineTo(x,HEIGHT);c.stroke();}
  for(let y=82;y<HEIGHT;y+=48){c.beginPath();c.moveTo(0,y);c.lineTo(WIDTH,y);c.stroke();}
  c.restore();
  // Irregular cobbles and warm pools make the lanes legible at a glance.
  for(let i=0;i<22;i++){const x=(i*173+39)%WIDTH,y=88+(i*79)%370;c.fillStyle=i%2?'rgba(177,155,132,.035)':'rgba(20,23,37,.08)';c.beginPath();c.ellipse(x,y,23,8,(i%5)*.2,0,Math.PI*2);c.fill();}
  const lanterns=[[128,95],[360,330],[635,89],[784,115],[930,401],[1152,240]];
  lanterns.forEach(([x,y],i)=>{glow(c,x,y,155,'#f4a94e',.17);c.fillStyle='#f6c674';c.beginPath();c.arc(x,y,3+(i%2),0,Math.PI*2);c.fill();});
  state.level.shadows.forEach((s)=>{c.save();c.fillStyle='rgba(12,17,32,.52)';c.beginPath();c.roundRect(s.x,s.y,s.w,s.h,18);c.fill();c.strokeStyle='rgba(132,147,178,.12)';c.stroke();c.restore();});
  c.strokeStyle='rgba(232,192,125,.24)';c.lineWidth=3;c.strokeRect(12,70,1256,398);
}

export function drawVision(c,g){
  const red=g.state==='chase',sus=g.state==='suspicious',range=g.range||270,fov=sus?.43:(g.fov||.64);
  const color=red?'#ff5d57':sus?'#ffd174':'#f5df9b';
  c.save();c.globalAlpha=red?.29:sus?.23:.18;c.fillStyle=color;c.beginPath();c.moveTo(g.x,g.y);c.arc(g.x,g.y,range,g.angle-fov,g.angle+fov);c.closePath();c.fill();
  c.globalAlpha=.56;c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();c.moveTo(g.x,g.y);c.lineTo(g.x+Math.cos(g.angle-fov)*range,g.y+Math.sin(g.angle-fov)*range);c.moveTo(g.x,g.y);c.lineTo(g.x+Math.cos(g.angle+fov)*range,g.y+Math.sin(g.angle+fov)*range);c.stroke();c.restore();
}

function drawFish(c,f,t){if(f.taken)return;c.save();c.translate(f.x,f.y+Math.sin(t*3+f.x)*2);c.rotate(-.12);c.shadowColor='#ffc65f';c.shadowBlur=12;c.fillStyle='#f6bd60';c.beginPath();c.ellipse(0,0,13,7,0,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(-10,0);c.lineTo(-19,-7);c.lineTo(-18,7);c.closePath();c.fillStyle='#e99b4d';c.fill();c.shadowBlur=0;c.fillStyle='#47384a';c.beginPath();c.arc(7,-1,1.5,0,Math.PI*2);c.fill();c.restore();}
function drawExit(c,p,t){c.save();c.translate(p.x,p.y);c.shadowColor='#ffd270';c.shadowBlur=18+Math.sin(t*3)*5;c.strokeStyle='#efc46e';c.lineWidth=4;c.beginPath();c.arc(0,0,22,Math.PI,Math.PI*2);c.lineTo(22,15);c.lineTo(-22,15);c.closePath();c.stroke();c.shadowBlur=0;c.fillStyle='rgba(230,173,86,.18)';c.fillRect(-18,-1,36,16);c.strokeStyle='rgba(241,203,131,.7)';c.lineWidth=2;c.beginPath();c.moveTo(-8,-2);c.lineTo(-8,15);c.moveTo(4,-2);c.lineTo(4,15);c.moveTo(16,-2);c.lineTo(16,15);c.stroke();c.fillStyle='#ffe4a1';c.font='700 9px system-ui';c.textAlign='center';c.fillText('EXIT',0,31);c.restore();}

export function drawCover(c,items){
  for(const o of items){c.save();c.fillStyle='rgba(7,10,20,.34)';c.beginPath();c.roundRect(o.x+5,o.y+8,o.w,o.h,8);c.fill();
    if(o.type==='stall'){roundBox(c,o.x,o.y+12,o.w,o.h-12,7,'#392f38','#a98563');const col=stalls[o.tone||0];roundBox(c,o.x-3,o.y,o.w+6,22,5,col,'#e0b77b');c.fillStyle='rgba(245,217,162,.26)';c.fillRect(o.x+8,o.y+3,o.w-16,3);for(let i=0;i<5;i++){c.fillStyle=i%2?'rgba(26,33,50,.2)':'rgba(250,211,145,.18)';c.fillRect(o.x+i*o.w/5,o.y+21,o.w/5,o.h-21);}c.fillStyle='#d3b486';c.fillRect(o.x+10,o.y+o.h-12,o.w-20,5);}
    else if(o.type==='crate'){roundBox(c,o.x,o.y,o.w,o.h,5,'#80543e','#d19a5f');c.strokeStyle='#543b37';c.lineWidth=3;c.strokeRect(o.x+5,o.y+5,o.w-10,o.h-10);c.beginPath();c.moveTo(o.x+7,o.y+o.h/2);c.lineTo(o.x+o.w-7,o.y+o.h/2);c.stroke();c.fillStyle='rgba(246,199,126,.2)';c.fillRect(o.x+7,o.y+7,o.w-14,3);}
    else if(o.type==='bush'){c.fillStyle='#254b46';c.beginPath();c.ellipse(o.x+o.w/2,o.y+o.h/2,o.w/2,o.h/2,0,0,Math.PI*2);c.fill();for(let i=0;i<7;i++){const x=o.x+10+(i*23)%(o.w-16),y=o.y+10+(i*13)%(o.h-14);c.fillStyle=i%2?'#396d58':'#4e7d5b';c.beginPath();c.arc(x,y,9,0,Math.PI*2);c.fill();}c.fillStyle='#c9a36d';c.fillRect(o.x+8,o.y+o.h-3,o.w-16,4);}
    c.restore();}
}

function drawWall(c,w){roundBox(c,w.x,w.y,w.w,w.h,3,'#67616a','#a5998b');c.fillStyle='rgba(255,230,184,.18)';c.fillRect(w.x+4,w.y+3,w.w-8,3);}
export function drawWorld(c,state){
  drawFloor(c,state);state.guards.forEach((g)=>drawVision(c,g));
  state.fish.forEach((f)=>drawFish(c,f,state.elapsed));drawExit(c,state.level.exit,state.elapsed);
  if(state.noise&&state.noise.life>0){c.save();c.globalAlpha=Math.min(.55,state.noise.life);c.strokeStyle='#f3d07e';c.lineWidth=2;c.beginPath();c.arc(state.noise.x,state.noise.y,24+(1-state.noise.life)*70,0,Math.PI*2);c.stroke();c.restore();}
  state.effects.forEach((e)=>{c.save();c.globalAlpha=Math.max(0,e.life/.7);c.strokeStyle=e.color;c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,10+(1-e.life)*36,0,Math.PI*2);c.stroke();c.restore();});
  state.level.walls.forEach((w)=>drawWall(c,w));drawCover(c,state.level.cover);
  state.guards.forEach((g)=>drawGuard(c,g,state.elapsed));drawCat(c,state.player);
}

function drawGuard(c,g,t){
  c.save();c.translate(g.x,g.y);c.rotate(g.angle);
  if(g.kind==='dog'){
    c.fillStyle='#b97845';c.beginPath();c.ellipse(0,1,16,10,0,0,Math.PI*2);c.fill();
    c.fillStyle='#d18b4f';c.beginPath();c.ellipse(11,-2,8,7,0,0,Math.PI*2);c.fill();
    c.fillStyle='#8a503d';c.beginPath();c.moveTo(8,-6);c.lineTo(11,-14);c.lineTo(15,-6);c.fill();
    c.strokeStyle='#633f39';c.lineWidth=3;for(const x of [-9,8]){c.beginPath();c.moveTo(x,-4);c.lineTo(x,8);c.stroke();}
    c.fillStyle='#221f30';c.beginPath();c.arc(14,-4,1.4,0,Math.PI*2);c.fill();
  }else{
    c.fillStyle='rgba(7,12,24,.33)';c.beginPath();c.ellipse(0,12,16,7,0,0,Math.PI*2);c.fill();
    c.fillStyle=g.color;c.beginPath();c.ellipse(-1,3,11,16,0,0,Math.PI*2);c.fill();
    c.fillStyle='#d9ae81';c.beginPath();c.arc(1,-12,9,0,Math.PI*2);c.fill();
    c.fillStyle='#473847';c.fillRect(-7,8,5,10);c.fillRect(2,8,5,10);
    c.fillStyle='#4a3641';c.beginPath();c.arc(-2,-13,1.2,0,Math.PI*2);c.arc(4,-13,1.2,0,Math.PI*2);c.fill();
    c.fillStyle='#efb95f';c.beginPath();c.arc(13,1,6+Math.sin(t*4+g.x)*.6,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,211,120,.22)';c.beginPath();c.arc(13,1,10,0,Math.PI*2);c.fill();
  }
  c.restore();
  c.fillStyle='#f2d6b0';c.font='10px system-ui';c.textAlign='center';c.fillText(g.kind==='dog'?'🐾':g.name,g.x,g.y+27);
  if(g.state==='suspicious'||g.state==='chase'){c.save();c.fillStyle=g.state==='chase'?'#ff7165':'#ffe095';c.beginPath();c.roundRect(g.x-10,g.y-39,20,18,7);c.fill();c.fillStyle='#392c36';c.font='bold 14px system-ui';c.textAlign='center';c.fillText(g.state==='chase'?'!':'?',g.x,g.y-26);c.restore();}
}

export function drawCat(c,p){
  c.save();c.translate(p.x,p.y);c.rotate(p.face);c.scale(p.sneaking?1:.95,p.sneaking?.78:1);
  c.fillStyle='rgba(3,7,17,.4)';c.beginPath();c.ellipse(-1,11,18,7,0,0,Math.PI*2);c.fill();
  c.strokeStyle='#d78343';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(-10,1);c.bezierCurveTo(-24,-10,-24,12,-13,12);c.stroke();
  c.fillStyle='#df8c49';c.beginPath();c.ellipse(-1,1,14,9,0,0,Math.PI*2);c.fill();
  c.fillStyle='#eb9b54';c.beginPath();c.arc(10,-2,9,0,Math.PI*2);c.fill();
  c.beginPath();c.moveTo(4,-8);c.lineTo(5,-17);c.lineTo(12,-9);c.fill();c.beginPath();c.moveTo(13,-9);c.lineTo(20,-16);c.lineTo(20,-5);c.fill();
  c.fillStyle='#f4c08a';c.beginPath();c.arc(7,-7,2,0,Math.PI*2);c.arc(16,-7,2,0,Math.PI*2);c.fill();
  c.fillStyle='#241f32';c.beginPath();c.arc(8,-2,1.3,0,Math.PI*2);c.arc(15,-2,1.3,0,Math.PI*2);c.fill();
  c.fillStyle='#f5cf90';c.beginPath();c.arc(12,2,1.6,0,Math.PI*2);c.fill();
  c.strokeStyle='#bf713e';c.lineWidth=2;c.beginPath();c.moveTo(-7,-5);c.lineTo(-3,6);c.moveTo(-2,-7);c.lineTo(2,8);c.stroke();
  c.restore();
}
