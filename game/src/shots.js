import { makePlayer } from './player.js';
import { makeGuards } from './guards.js';
import { LEVELS } from './levels.js';

export function stageShot(name,state){
  const second=name==='play2',index=second?1:0;
  state.loadLevel(index);state.elapsed=8;state.levelTime=38;state.everSeen=false;state.alert=0;
  if(name==='start'){state.screen='title';state.best=Math.max(state.best,1240);return;}
  state.screen='play';
  if(name==='play'){
    state.player.x=458;state.player.y=211;state.player.face=-2.7;state.player.sneaking=true;state.player.inShadow=true;
    state.fish.slice(0,2).forEach((f)=>f.taken=true);state.fishCount=2;state.score=200;state.alert=.11;
    const g=state.guards[0];g.x=560;g.y=248;g.angle=Math.atan2(state.player.y-g.y,state.player.x-g.x);g.routeIndex=1;g.state='patrol';
    return;
  }
  if(name==='play2'){
    state.player.x=1168;state.player.y=104;state.player.face=2.8;state.player.sneaking=true;state.fish.slice(0,3).forEach((f)=>f.taken=true);state.fishCount=3;state.score=460;state.alert=.36;
    const g=state.guards[2];g.x=1034;g.y=142;g.angle=Math.atan2(state.player.y-g.y,state.player.x-g.x);g.state='chase';g.suspicion=.74;g.target={x:state.player.x,y:state.player.y};
    return;
  }
  if(name==='end'){
    state.player.x=1178;state.player.y=250;state.fish.forEach((f)=>f.taken=true);state.fishCount=5;state.score=760;state.levelScore=760;state.levelTime=52;state.stars=3;state.screen='level-complete';
  }
}
