
import { deflateSync } from 'node:zlib';
const N=32,S=16;
const C={navy:[26,28,44],purple:[93,39,93],red:[177,62,83],orange:[239,125,87],yellow:[255,205,117],green:[56,183,100],lime:[167,240,112],teal:[37,113,121],dblue:[41,54,111],white:[244,244,244],lgray:[148,176,194],gray:[86,108,134],cyan:[115,239,247]};
const g=Array.from({length:N},()=>Array(N).fill(C.navy));
const set=(x,y,c)=>{if(x>=0&&y>=0&&x<N&&y<N)g[y][x]=c};
const bayer=[[0,2],[3,1]];
for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(y>=18)g[y][x]=C.dblue;else if(y>=15&&bayer[y%2][x%2]<y-14)g[y][x]=C.dblue;}
[[3,3,C.white],[27,5,C.cyan],[6,10,C.cyan],[25,12,C.white],[29,2,C.white]].forEach(([x,y,c])=>set(x,y,c));
for(let x=0;x<N;x++){for(let y=27;y<N;y++)set(x,y,y===27?C.green:C.teal);}
for(let x=0;x<N;x+=3)set(x,26,C.green);
const cx=15.5,cy=18.5,rx=8,ry=8.5;
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<=1)set(x,y,d>0.72&&(x>cx||y>cy+3)?C.red:C.orange);}
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d>1&&d<=1.28){const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const dd=((x+a-cx)/rx)**2+((y+b-cy)/ry)**2;return dd<=1;});if(nb)set(x,y,C.purple);}}
set(11,14,C.yellow);set(12,13,C.yellow);set(11,13,C.yellow);
for(let y=4;y<=9;y++)for(let x=9;x<=22;x++){const top=y<=7;const w=top?((x-15.5)**2/42+(y-6.5)**2/3)<=1:false;if(w)set(x,y,C.white);}
for(let x=11;x<=20;x++){set(x,8,C.white);set(x,9,C.white);set(x,10,C.lgray);}
for(let x=17;x<=20;x++)set(x,9,C.lgray);
[[10,10],[21,10]].forEach(([x,y])=>set(x,y,C.purple));
for(let x=11;x<=20;x++)set(x,11,C.purple);
for(let y=3;y<=10;y++)for(let x=8;x<=23;x++){if(g[y][x]!==C.white&&g[y][x]!==C.lgray&&g[y][x]!==C.purple){const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const v=g[y+b]?.[x+a];return v===C.white||v===C.lgray;});if(nb&&y<11)set(x,y,C.purple);}}
for(const [x,y] of [[12,16],[13,16],[12,17],[13,17],[18,16],[19,16],[18,17],[19,17]])set(x,y,C.navy);
set(12,16,C.white);set(18,16,C.white);
set(10,19,C.red);set(11,19,C.red);set(20,19,C.red);set(21,19,C.red);
set(14,20,C.purple);set(15,21,C.purple);set(16,21,C.purple);set(17,20,C.purple);
const W=N*S,raw=Buffer.alloc((W*3+1)*W);
for(let y=0;y<W;y++){raw[y*(W*3+1)]=0;for(let x=0;x<W;x++){const c=g[Math.floor(y/S)][Math.floor(x/S)];raw.set(c,y*(W*3+1)+1+x*3);}}
const crcT=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
const crc=b=>{let c=0xffffffff;for(const v of b)c=crcT[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(W,4);ih[8]=8;ih[9]=2;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
const root=process.argv[2];if(!root)throw new Error('usage: bun avatar.js <repo-root>');
await Bun.write(root+'/assets/avatar.png',png);
