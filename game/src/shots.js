import { makePlayer } from './player.js';
import { makeGuards } from './guards.js';
import { LEVELS } from './levels.js';

export function stageShot(name,state){
  const second=name==='play2',index=second?1:0;
  state.loadLevel(index);state.elapsed=8;state.levelTime=38;state.everSeen=false;state.alert=0;
  if(name==='start'){state.screen='title';state.best=Math.max(state.best,1240);return;}
  state.screen='play';
  if(name==='play'){
    state.player.x=458;state.player.y=211;state.player.face=-2.7;state.player.sneaking=true;state.player.hidden=false;state.player.inShadow=true;
    state.fish.slice(0,2).forEach((f)=>f.taken=true);state.fishCount=2;state.score=200;state.alert=.34;
    const g=state.guards[0];g.x=560;g.y=248;g.angle=Math.atan2(state.player.y-g.y,state.player.x-g.x);g.routeIndex=1;g.state='suspicious';g.suspicion=.58;
    return;
  }
  if(name==='play2'){
    state.player.x=1128;state.player.y=116;state.player.face=2.8;state.player.sneaking=true;state.player.hidden=true;state.player.inShadow=true;
    state.fish.slice(0,3).forEach((f)=>f.taken=true);state.fishCount=3;state.score=460;state.alert=.22;
    const dog=state.guards[0];dog.kind='dog';dog.name='Warehouse hound';dog.x=1035;dog.y=155;dog.range=225;dog.angle=Math.atan2(state.player.y-dog.y,state.player.x-dog.x);
    const watch=state.guards[1];watch.x=930;watch.y=205;watch.state='suspicious';watch.suspicion=.68;watch.angle=Math.atan2(state.player.y-watch.y,state.player.x-watch.x);
    return;
  }
  if(name==='end'){
    state.player.x=1178;state.player.y=250;state.fish.forEach((f)=>f.taken=true);state.fishCount=5;state.score=760;state.levelScore=760;state.levelTime=52;state.stars=3;state.screen='level-complete';
  }
}
