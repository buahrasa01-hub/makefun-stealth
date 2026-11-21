// Hand-placed market lanes: rectangles are solid cover and block a guard's view.
export const LEVELS = [
  { name: 'Pasar Senja', subtitle: 'Dusk market · learn the lantern rhythm', playerStart: { x: 86, y: 420 }, exit: { x: 1206, y: 250 },
    fish: [{x:187,y:155},{x:355,y:375},{x:640,y:112},{x:828,y:390},{x:1066,y:155}],
    guards: [
      {name:'Pak Rudi',color:'#8b5549',route:[{x:310,y:142,pause:.7},{x:575,y:142,pause:1.1},{x:575,y:300,pause:.7},{x:310,y:300,pause:1}]},
      {name:'Mbak Sari',color:'#536b79',route:[{x:895,y:351,pause:1},{x:1105,y:351,pause:.8},{x:1105,y:172,pause:1},{x:895,y:172,pause:.7}]},
      {name:'Ari',color:'#8a6e50',route:[{x:650,y:125,pause:1.8},{x:650,y:350,pause:1.8},{x:715,y:350,pause:1.8},{x:715,y:125,pause:1.8}]},
    ],
    cover: [
      {type:'stall',x:145,y:205,w:126,h:72,tone:0},{type:'crate',x:382,y:188,w:68,h:48},
      {type:'stall',x:475,y:344,w:142,h:66,tone:1},{type:'crate',x:552,y:207,w:66,h:49},
      {type:'bush',x:683,y:176,w:76,h:46},{type:'stall',x:737,y:286,w:130,h:78,tone:2},
      {type:'crate',x:943,y:213,w:64,h:48},{type:'bush',x:1042,y:300,w:82,h:48},
      {type:'stall',x:990,y:86,w:142,h:66,tone:1},
    ], walls:[{x:298,y:367,w:90,h:22},{x:640,y:365,w:72,h:20},{x:872,y:87,w:72,h:20}],
    shadows:[{x:105,y:292,w:207,h:108},{x:369,y:247,w:161,h:92},{x:607,y:260,w:141,h:100},{x:878,y:268,w:196,h:82},{x:1105,y:185,w:92,h:144}],
    hints:['SHIFT  ·  SNEAK IN THE SHADOWS','CLICK  ·  TOSS A PEBBLE TO DISTRACT']
  },
  { name:'Gudang Rempah',subtitle:'Spice warehouse · crossing lanterns',playerStart:{x:82,y:410},exit:{x:1200,y:83},
    fish:[{x:170,y:123},{x:302,y:337},{x:505,y:122},{x:646,y:380},{x:844,y:137},{x:1082,y:339}],
    guards:[
      {name:'Wira',color:'#8b5549',route:[{x:290,y:112,pause:.7},{x:290,y:350,pause:.8},{x:450,y:350,pause:.6},{x:450,y:112,pause:.8}]},
      {name:'Tari',color:'#536b79',route:[{x:690,y:350,pause:.8},{x:690,y:117,pause:.6},{x:870,y:117,pause:.8},{x:870,y:350,pause:.7}]},
      {name:'Banu',color:'#79684d',route:[{x:1050,y:116,pause:.8},{x:1050,y:352,pause:.8},{x:1145,y:352,pause:.6},{x:1145,y:116,pause:.8}]},
    ],
    cover:[{type:'stall',x:140,y:194,w:112,h:68,tone:2},{type:'crate',x:348,y:182,w:74,h:52},{type:'crate',x:490,y:286,w:70,h:50},{type:'stall',x:520,y:75,w:112,h:72,tone:0},{type:'bush',x:560,y:174,w:66,h:42},{type:'stall',x:744,y:210,w:112,h:72,tone:1},{type:'crate',x:878,y:330,w:78,h:51},{type:'stall',x:972,y:168,w:116,h:74,tone:2},{type:'bush',x:1090,y:245,w:70,h:42},{type:'bush',x:1090,y:96,w:78,h:44},{type:'crate',x:190,y:320,w:70,h:51}],
    walls:[{x:160,y:88,w:72,h:20},{x:450,y:389,w:100,h:20},{x:929,y:87,w:60,h:20}],
    shadows:[{x:90,y:279,w:177,h:119},{x:312,y:246,w:154,h:135},{x:474,y:159,w:176,h:97},{x:639,y:278,w:145,h:120},{x:836,y:160,w:175,h:119},{x:1017,y:285,w:175,h:115}],hints:[]
  },
  { name:'Dermaga Lentera',subtitle:'Lantern dock · the hound hears a sprint',playerStart:{x:75,y:420},exit:{x:1204,y:75},key:{x:1110,y:390},
    fish:[{x:167,y:102},{x:280,y:357},{x:430,y:112},{x:575,y:358},{x:754,y:118},{x:918,y:358},{x:1085,y:155}],
    guards:[
      {name:'Jaka',color:'#8b5549',route:[{x:242,y:110,pause:.5},{x:380,y:110,pause:.5},{x:380,y:230,pause:.6},{x:242,y:230,pause:.5}]},
      {name:'Mira',color:'#536b79',route:[{x:495,y:345,pause:.5},{x:645,y:345,pause:.4},{x:645,y:240,pause:.5},{x:495,y:240,pause:.4}]},
      {name:'Oji',color:'#79684d',route:[{x:770,y:105,pause:.5},{x:920,y:105,pause:.4},{x:920,y:230,pause:.5},{x:770,y:230,pause:.4}]},
      {name:'Si Belang',color:'#a3713f',kind:'dog',route:[{x:1015,y:342,pause:.3},{x:1152,y:342,pause:.3},{x:1152,y:210,pause:.35},{x:1015,y:210,pause:.3}]},
    ],
    cover:[{type:'stall',x:142,y:180,w:102,h:74,tone:0},{type:'crate',x:300,y:276,w:63,h:48},{type:'bush',x:404,y:180,w:70,h:44},{type:'stall',x:538,y:88,w:106,h:68,tone:1},{type:'crate',x:665,y:290,w:66,h:48},{type:'stall',x:820,y:184,w:102,h:74,tone:2},{type:'bush',x:952,y:83,w:78,h:46},{type:'crate',x:1064,y:278,w:62,h:48},{type:'stall',x:1110,y:135,w:100,h:67,tone:0}],
    walls:[{x:250,y:347,w:95,h:19},{x:685,y:83,w:82,h:19},{x:934,y:298,w:70,h:18}],
    shadows:[{x:89,y:267,w:154,h:124},{x:260,y:143,w:164,h:112},{x:425,y:259,w:150,h:132},{x:601,y:161,w:153,h:104},{x:771,y:270,w:157,h:122},{x:932,y:148,w:158,h:115},{x:1087,y:234,w:113,h:122}],hints:[]
  }
];
