import { DASH_COOLDOWN, DASH_SPEED, DASH_TIME, PEBBLES_PER_LEVEL, SNEAK_SPEED, WALK_SPEED } from './config.js';
import { sound } from './audio.js';

export function makePlayer(start) {
  return {x:start.x,y:start.y,face:0,sneaking:false,running:false,hidden:false,inShadow:false,dash:0,dashCooldown:0,pebbleCooldown:0,stepClock:0,stride:0};
}

function hitsRect(x,y,r,box) {
  const nx=Math.max(box.x,Math.min(x,box.x+box.w)), ny=Math.max(box.y,Math.min(y,box.y+box.h));
  return Math.hypot(x-nx,y-ny)<r;
}

function move(player,dx,dy,blocks) {
  const r=11; let x=player.x+dx;
  if (!blocks.some((box)=>hitsRect(x,player.y,r,box))) player.x=x;
  let y=player.y+dy;
  if (!blocks.some((box)=>hitsRect(player.x,y,r,box))) player.y=y;
  player.x=Math.max(22,Math.min(1258,player.x)); player.y=Math.max(76,Math.min(458,player.y));
}

export function throwPebble(state,target) {
  if (state.screen!=='play'||state.pebbles<=0||state.player.pebbleCooldown>0) return false;
  state.pebbles-=1; state.player.pebbleCooldown=.45;
  state.noise={x:target.x,y:target.y,radius:390,life:1.1,kind:'pebble'};
  state.effects.push({x:target.x,y:target.y,life:.55,color:'#f2c66c',kind:'ring'});
  sound('pebble'); return true;
}

export function updatePlayer(state,controls,dt) {
  const p=state.player;
  p.dashCooldown=Math.max(0,p.dashCooldown-dt); p.pebbleCooldown=Math.max(0,p.pebbleCooldown-dt);
  if (controls.pebble) throwPebble(state,controls.pebble);
  let dx=controls.dx||0,dy=controls.dy||0,mag=Math.hypot(dx,dy);
  if (mag>0) { dx/=mag; dy/=mag; p.face=Math.atan2(dy,dx); }
  if (controls.dash && p.dashCooldown===0) {
    p.dash=DASH_TIME; p.dashCooldown=DASH_COOLDOWN;
    const angle=mag?Math.atan2(dy,dx):p.face; dx=Math.cos(angle); dy=Math.sin(angle); mag=1;
    state.noise={x:p.x,y:p.y,radius:410,life:.9,kind:'dash'}; sound('step');
  }
  p.sneaking=Boolean(controls.sneak);
  const dashing=p.dash>0; p.running=mag>0&&!p.sneaking&&!dashing;
  const speed=dashing?DASH_SPEED:(p.sneaking?SNEAK_SPEED:WALK_SPEED);
  if (mag>0) move(p,dx*speed*dt,dy*speed*dt,[...state.level.cover,...state.level.walls]);
  p.dash=Math.max(0,p.dash-dt); p.stride+=mag*dt*(p.sneaking?5:10);
  p.inShadow=state.level.shadows.some((r)=>p.x>r.x&&p.x<r.x+r.w&&p.y>r.y&&p.y<r.y+r.h);
  p.hidden=state.level.cover.some((r)=>r.type==='bush'&&p.x>r.x&&p.x<r.x+r.w&&p.y>r.y&&p.y<r.y+r.h);
  if (mag>0) {
    p.stepClock-=dt;
    if (p.stepClock<=0) {
      p.stepClock=p.sneaking?.58:.36;
      if (p.running) state.noise={x:p.x,y:p.y,radius:205,life:.48,kind:'steps'};
      sound('step');
    }
  }
  if (state.noise) { state.noise.life-=dt; if(state.noise.life<=0) state.noise=null; }
  state.comboTime=Math.max(0,state.comboTime-dt);
  for (const fish of state.fish) {
    if (fish.taken||Math.hypot(fish.x-p.x,fish.y-p.y)>25) continue;
    fish.taken=true; state.fishCount+=1; state.combo=state.comboTime>0?state.combo+1:1; state.comboTime=2.6;
    state.score+=100+Math.max(0,state.combo-1)*25; sound('fish');
    state.effects.push({x:fish.x,y:fish.y,life:.7,color:'#ffd889',kind:'spark'});
  }
  const needed=Math.ceil(state.fish.length/2);
  if (state.fishCount>=needed&&Math.hypot(p.x-state.level.exit.x,p.y-state.level.exit.y)<35) state.completeLevel();
}

export { PEBBLES_PER_LEVEL };
