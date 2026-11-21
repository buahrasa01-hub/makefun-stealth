let context=null;
const tones={
  step:[110,.035,'sine',.018],alert:[740,.24,'triangle',.07],caught:[240,.46,'sawtooth',.065],
  fish:[1040,.16,'sine',.055],pebble:[520,.12,'triangle',.05],win:[880,.42,'sine',.07]
};

function audioContext(){
  if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio)context=new Audio();}
  if(context?.state==='suspended')context.resume();
  return context;
}

export function sound(name){
  const ac=audioContext();if(!ac)return;
  const [base,duration,wave,volume]=tones[name]||tones.step;
  const count=name==='win'?4:1;
  for(let i=0;i<count;i++){
    const start=ac.currentTime+i*(name==='win'?.105:0);
    const osc=ac.createOscillator(),gain=ac.createGain();
    osc.type=wave;osc.frequency.setValueAtTime(base+(name==='win'?i*145:0),start);
    if(name==='caught')osc.frequency.exponentialRampToValueAtTime(95,start+duration);
    gain.gain.setValueAtTime(volume,start);gain.gain.exponentialRampToValueAtTime(.001,start+duration);
    osc.connect(gain);gain.connect(ac.destination);osc.start(start);osc.stop(start+duration);
  }
}

export function primeAudio(){audioContext();}
