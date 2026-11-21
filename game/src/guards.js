import { CHASE_SPEED, DETECT_CLOSE_BONUS, DETECT_RATE, DETECT_RUN_BONUS, DETECT_SHADOW_FACTOR, DETECT_SNEAK_FACTOR, GUARD_SPEED } from './config.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const bearing = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const angleDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

function segmentHitsRect(a, b, box) {
  const dx = b.x - a.x, dy = b.y - a.y;
  let near = 0, far = 1;
  const clip = (p, q) => {
    if (p === 0) return q >= 0;
    const t = q / p;
    if (p < 0) near = Math.max(near, t);
    else far = Math.min(far, t);
    return near <= far;
  };
  return clip(-dx, a.x - box.x) && clip(dx, box.x + box.w - a.x) &&
    clip(-dy, a.y - box.y) && clip(dy, box.y + box.h - a.y) && near <= 1 && far >= 0;
}

export function lineOfSight(a, b, blockers) {
  return !blockers.some((box) => segmentHitsRect(a, b, box));
}

export function makeGuards(level) {
  return level.guards.map((plan) => {
    const first = plan.route[0], next = plan.route[1] || first;
    return { ...plan, x:first.x, y:first.y, angle:bearing(first,next), routeIndex:1, wait:first.pause||0, state:'patrol', suspicion:0, search:0, target:null, range:plan.kind==='dog'?225:270, fov:.64 };
  });
}

function moveToward(guard, target, speed, dt) {
  const dx=target.x-guard.x, dy=target.y-guard.y, d=Math.hypot(dx,dy);
  if (d < 3) return true;
  guard.angle=Math.atan2(dy,dx);
  const step=Math.min(d,speed*dt); guard.x+=dx/d*step; guard.y+=dy/d*step;
  return d <= step + 2;
}

function investigateNoise(guard, noise) {
  if (!noise || noise.life <= 0) return false;
  const earshot=guard.kind==='dog'?440:330;
  if (dist(guard,noise)>Math.min(noise.radius,earshot)) return false;
  guard.state='suspicious'; guard.suspicion=Math.max(guard.suspicion,.72);
  guard.target={x:noise.x,y:noise.y}; guard.search=2.8; return true;
}

export function updateGuards(state, dt) {
  const blockers=[...state.level.cover,...state.level.walls];
  const p=state.player,margin=11;
  p.hidden=state.level.cover.some((b)=>b.type==='bush'&&p.x>=b.x+margin&&p.x<=b.x+b.w-margin&&p.y>=b.y+margin&&p.y<=b.y+b.h-margin);
  let danger=0, playerSeen=false;
  for (const guard of state.guards) {
    investigateNoise(guard,state.noise);
    const d=dist(guard,state.player), viewAngle=bearing(guard,state.player);
    const visible=d<guard.range && Math.abs(angleDiff(viewAngle,guard.angle))<guard.fov && lineOfSight(guard,state.player,blockers);
    if (visible && !state.player.hidden) {
      playerSeen=true;
      const close=Math.max(0,1-d/guard.range);
      let rate=DETECT_RATE+close*DETECT_CLOSE_BONUS+(state.player.running?DETECT_RUN_BONUS:0);
      if (state.player.sneaking) rate*=DETECT_SNEAK_FACTOR;
      if (state.player.inShadow) rate*=DETECT_SHADOW_FACTOR;
      danger=Math.max(danger,rate);
      guard.suspicion=Math.min(1,guard.suspicion+dt*(.58+close));
      if (guard.state==='patrol' && guard.suspicion>.25) {
        guard.state='suspicious'; guard.target={x:state.player.x,y:state.player.y}; guard.search=2.3;
      }
      if (guard.suspicion>.8 || state.alert>.7) {
        guard.state='chase'; guard.target={x:state.player.x,y:state.player.y};
      }
    } else {
      const decay=state.player.hidden||state.player.inShadow?.42:.16;
      guard.suspicion=Math.max(0,guard.suspicion-dt*decay);
    }
    if (guard.state==='patrol') {
      if (guard.wait>0) guard.wait-=dt;
      else {
        const target=guard.route[guard.routeIndex];
        if (moveToward(guard,target,guard.kind==='dog'?54:GUARD_SPEED,dt)) {
          guard.routeIndex=(guard.routeIndex+1)%guard.route.length; guard.wait=target.pause||.45;
        }
      }
    } else if (guard.state==='suspicious') {
      const target=visible?state.player:guard.target;
      if (target && moveToward(guard,target,GUARD_SPEED*1.16,dt)) guard.search=Math.max(guard.search,1.2);
      guard.search-=dt;
      if (guard.search<=0 && guard.suspicion<.12) guard.state='search';
    } else if (guard.state==='chase') {
      if (visible) guard.target={x:state.player.x,y:state.player.y};
      if (guard.target) moveToward(guard,guard.target,CHASE_SPEED,dt);
      guard.search+=dt;
      if (!visible && guard.search>2.7) { guard.state='search'; guard.search=2.1; }
      if (d<22 && state.alert>.55) danger=Math.max(danger,.8);
    } else {
      guard.search-=dt; guard.angle+=Math.sin(state.elapsed*3+guard.x)*dt*1.5;
      if (guard.search<=0) { guard.state='patrol'; guard.search=0; guard.target=null; }
    }
  }
  if (playerSeen) state.everSeen=true;
  const recover=state.player.inShadow?.2:.11;
  state.alert=danger?Math.min(1,state.alert+danger*dt):Math.max(0,state.alert-dt*recover);
  if (state.alert>=1) state.catchPlayer();
}
