export function createInput(canvas){
  const input={keys:new Set(),pressed:new Set(),click:null,mouse:{x:0,y:0}};
  const down=(e)=>{const key=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();if(!input.keys.has(key))input.pressed.add(key);input.keys.add(key);};
  const up=(e)=>input.keys.delete(e.key.toLowerCase());
  const point=(e)=>{const r=canvas.getBoundingClientRect();input.mouse={x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*480/r.height};};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);
  canvas.addEventListener('pointermove',point);canvas.addEventListener('pointerdown',(e)=>{point(e);input.click={...input.mouse};});
  return input;
}

export function takePress(input,...keys){
  for(const key of keys){if(input.pressed.has(key)){input.pressed.delete(key);return true;}}
  return false;
}

export function readControls(input){
  const k=input.keys,pebble=input.click;input.click=null;
  return {dx:(k.has('d')||k.has('arrowright')?1:0)-(k.has('a')||k.has('arrowleft')?1:0),
    dy:(k.has('s')||k.has('arrowdown')?1:0)-(k.has('w')||k.has('arrowup')?1:0),
    sneak:k.has('shift'),dash:takePress(input,' '),pebble};
}
