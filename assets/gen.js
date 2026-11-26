
const W=320,H=80;
const C={navy:'#1a1c2c',purple:'#5d275d',red:'#b13e53',orange:'#ef7d57',yellow:'#ffcd75',lime:'#a7f070',green:'#38b764',teal:'#257179',dblue:'#29366f',blue:'#3b5dc9',lblue:'#41a6f6',cyan:'#73eff7',white:'#f4f4f4',lgray:'#94b0c2',gray:'#566c86',dgray:'#333c57'};
const px=new Map(); // "x,y" -> color (base layer)
const set=(x,y,c)=>{if(x>=0&&y>=0&&x<W&&y<H)px.set(x+','+y,c)};
const bands=[[0,C.navy],[26,C.dblue],[46,C.purple]];
const bayer=[[0,2],[3,1]];
for(let y=0;y<62;y++)for(let x=0;x<W;x++){
  let i=0;for(let k=0;k<bands.length;k++)if(y>=bands[k][0])i=k;
  let c=bands[i][1];
  const next=bands[i+1];
  if(next&&next[0]-y<=3){const t=4-(next[0]-y);if(bayer[y%2][x%2]<t)c=next[1];}
  set(x,y,c);
}
for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++)if(x*x+y*y<=42)set(270+x,14+y,C.white);
for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++)if(x*x+y*y<=42&&(x-3)*(x-3)+(y+2)*(y+2)<=26)set(270+x,14+y,C.navy);
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const ridge=(base,amp,col,step)=>{let h=base;for(let x=0;x<W;x++){h+=(rnd()-0.5)*step;h=Math.max(base-amp,Math.min(base+amp,h));for(let y=Math.round(h);y<62;y++)set(x,y,col);}};
ridge(44,6,C.dgray,2.2);ridge(52,4,C.navy,1.6);
for(let x=0;x<W;x++){for(let y=62;y<H;y++)set(x,y,y<64?C.green:(y<66?(bayer[y%2][x%2]<2?C.green:C.teal):C.teal));}
for(let x=0;x<W;x++)if(rnd()<0.18)set(x,61,C.green);
for(let i=0;i<60;i++)set(Math.floor(rnd()*W),67+Math.floor(rnd()*13),C.dblue);
const F={A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],N:['10001','11001','10101','10011','10001','10001','10001'],P:['11110','10001','10001','11110','10000','10000','10000'],I:['11111','00100','00100','00100','00100','00100','11111'],X:['10001','10001','01010','00100','01010','10001','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],M:['10001','11011','10101','10101','10001','10001','10001'],T:['11111','00100','00100','00100','00100','00100','00100'],O:['01110','10001','10001','10001','10001','10001','01110'],S:['01111','10000','10000','01110','00001','00001','11110'],R:['11110','10001','10001','11110','10100','10010','10001'],U:['10001','10001','10001','10001','10001','10001','01110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],K:['10001','10010','10100','11000','10100','10010','10001'],'.':['00000','00000','00000','00000','00000','01100','01100'],'+':['00000','00100','00100','11111','00100','00100','00000'],' ':['00000','00000','00000','00000','00000','00000','00000']};
const text=(s,x0,y0,sc,col,shadow)=>{const draw=(dx,dy,c)=>{let x=x0;for(const ch of s){const g=F[ch];for(let r=0;r<7;r++)for(let k=0;k<5;k++)if(g[r][k]==='1')for(let a=0;a<sc;a++)for(let b=0;b<sc;b++)set(x+k*sc+a+dx,y0+r*sc+b+dy,c);x+=6*sc;}};if(shadow)draw(1,Math.max(1,sc-1),shadow);draw(0,0,col);};
text('BEAN',16,10,3,C.yellow,C.red);
text('PIXEL FX + GAME TOOLS',17,38,1,C.lgray,C.navy);
const chef=[
'....wwwww...',
'...wwwwwww..',
'....wwwww...',
'....kkkkk...',
'...ooooooo..',
'..ooooooooo.',
'..oonooonoo.',
'..ooooooooo.',
'..oooRRRooo.',
'..ooooooooo.',
'...ooooooo..',
'...ooooooo..',
'....oo.oo...',
'....nn.nn...'];
const cm={w:C.white,k:C.lgray,o:C.orange,n:C.navy,R:C.red};
chef.forEach((row,y)=>[...row].forEach((ch,x)=>{if(cm[ch])set(196+x,48+y,cm[ch])}));
for(let i=0;i<6;i++)set(208+i,55-Math.floor(i/2),C.lgray);
const pot=['.dddddddddd.','dggggggggggd','.dddddddddd.','.dggggggggd.','.dggggggggd.','.dggggggggd.','..dddddddd..'];
const pm={d:C.dgray,g:C.gray};
pot.forEach((row,y)=>[...row].forEach((ch,x)=>{if(pm[ch])set(214+x,52+y,pm[ch])}));
for(let x=212;x<228;x++){set(x,60,C.purple);set(x,61,C.purple);}
const tree=(tx,ty)=>{for(let y=0;y<10;y++){const w=Math.floor(y/2)+1;for(let x=-w;x<=w;x++)set(tx+x,ty+y,y%3===0?C.teal:C.green);}for(let y=10;y<13;y++)set(tx,ty+y,C.purple);};
[[130,49],[142,52],[300,49],[312,51],[160,51]].forEach(([a,b])=>tree(a,b));
let out='';
for(let y=0;y<H;y++){let x=0;while(x<W){const c=px.get(x+','+y);let e=x+1;while(e<W&&px.get(e+','+y)===c)e++;if(c)out+='<rect x="'+x+'" y="'+y+'" width="'+(e-x)+'" height="1" fill="'+c+'"/>';x=e;}}
seed=42;let stars='';
for(let i=0;i<40;i++){const x=Math.floor(rnd()*W),y=Math.floor(rnd()*34);if(x<110&&y<34)continue;if(Math.abs(x-270)<10&&y<24)continue;const d=(rnd()*3).toFixed(2);stars+='<rect class="tw" style="animation-delay:'+d+'s" x="'+x+'" y="'+y+'" width="1" height="1" fill="'+(i%3?C.white:C.cyan)+'"/>';}
const flameA='<g class="fa"><rect x="217" y="59" width="6" height="1" fill="#ef7d57"/><rect x="218" y="58" width="4" height="1" fill="#ffcd75"/><rect x="219" y="57" width="1" height="1" fill="#ffcd75"/></g>';
const flameB='<g class="fb"><rect x="216" y="59" width="7" height="1" fill="#ef7d57"/><rect x="219" y="58" width="3" height="1" fill="#ffcd75"/><rect x="221" y="57" width="1" height="1" fill="#ffcd75"/></g>';
let steam='';[[218,0],[222,0.8],[225,1.6]].forEach(([x,d])=>{steam+='<rect class="st" style="animation-delay:'+d+'s" x="'+x+'" y="49" width="1" height="2" fill="#f4f4f4"/>';});
const css='.tw{animation:tw 2.4s steps(1) infinite}@keyframes tw{0%{opacity:1}50%{opacity:.2}}.fa{animation:fl .5s steps(1) infinite}.fb{animation:fl .5s steps(1) infinite reverse;opacity:0}@keyframes fl{0%{opacity:1}50%{opacity:0}}.fb{animation-name:fl2}@keyframes fl2{0%{opacity:0}50%{opacity:1}}.st{animation:st 2.4s steps(6) infinite}@keyframes st{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-12px);opacity:0}}';
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="960" height="240" shape-rendering="crispEdges"><style>'+css+'</style>'+out+stars+flameA+flameB+steam+'</svg>';
await Bun.write(process.argv[2]+'/assets/banner.svg',svg);
console.log(svg.length);
