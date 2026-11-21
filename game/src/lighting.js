// Seeded lantern pools and ambient shadows keep every staged frame reproducible.
export function isInShadow(x,y,level){
  return Boolean(level?.shadows?.some((r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h));
}

function seeded(seed){
  let value=(Number(seed)||1)>>>0;
  return ()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};
}

function radial(ctx,x,y,r,color,alpha){
  const g=ctx.createRadialGradient(x,y,2,x,y,r);
  g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(1,`rgba(${color},0)`);
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
}

function lanternsFor(levelIndex){
  return [
    [[128,95],[360,330],[635,89],[784,115],[930,401],[1152,240]],
    [[110,92],[384,394],[618,97],[820,391],[1042,94],[1152,270]],
    [[111,94],[320,405],[576,90],[806,401],[1000,93],[1170,268]],
  ][Math.max(0,Math.min(2,levelIndex))];
}

export function drawLighting(ctx,state){
  const t=state.elapsed||0,seed=state.seed||1,lanterns=lanternsFor(state.levelIndex||0);
  ctx.save();ctx.globalCompositeOperation='multiply';
  for(const s of state.level.shadows){
    const x=s.x+s.w/2,y=s.y+s.h/2,r=Math.max(s.w,s.h)*.7;
    const g=ctx.createRadialGradient(x,y,r*.12,x,y,r);
    g.addColorStop(0,'rgba(11,15,29,.76)');g.addColorStop(.68,'rgba(13,17,31,.48)');g.addColorStop(1,'rgba(15,19,34,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,s.w*.78,s.h*.82,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  ctx.save();ctx.filter='blur(8px)';ctx.globalAlpha=.55;ctx.fillStyle='#090d1a';
  for(const o of state.level.cover){ctx.beginPath();ctx.ellipse(o.x+o.w*.52,o.y+o.h*.82,o.w*.58,Math.max(9,o.h*.34),0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
  for(let i=0;i<lanterns.length;i++){
    const [x,y]=lanterns[i],flicker=.92+Math.sin(t*5+i*2.1)*.06+Math.sin(t*11+i)*.025;
    radial(ctx,x,y,175,'255,174,83',.22*flicker);
    ctx.fillStyle='#ffd47e';ctx.beginPath();ctx.arc(x,y,3.5*flicker,0,Math.PI*2);ctx.fill();
  }
  for(const g of state.guards){
    if(g.kind==='dog')continue;
    radial(ctx,g.x+Math.cos(g.angle)*13,g.y+Math.sin(g.angle)*13,66,'255,191,103',.18);
  }
  const exit=state.level.exit,pulse=.78+.22*Math.sin(t*3.4);
  radial(ctx,exit.x,exit.y,95,'255,205,111',.24*pulse);
  const rand=seeded(seed+7919*(state.levelIndex+1));
  for(let i=0;i<17;i++){
    const x=25+rand()*1230,y=82+rand()*380,phase=rand()*Math.PI*2;
    const a=.24+.5*(.5+.5*Math.sin(t*2+phase));
    ctx.globalAlpha=a;ctx.fillStyle='#ffd781';ctx.shadowColor='#f7bf62';ctx.shadowBlur=7;
    ctx.beginPath();ctx.arc(x,y,1.2+rand()*1.1,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;
}
