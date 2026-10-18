const $ = id => document.getElementById(id);
const canvas = $('worldCanvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
const STORE_KEY = 'frontier-heroes-save-v2';
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
const rand = (min,max) => min + Math.random()*(max-min);
const troop = {
  tank:{name:'Tanques',short:'TANQUES',color:'#72b7e8',dark:'#315a77',css:'tank',emoji:'🛡️'},
  air:{name:'Aeronaves',short:'AERONAVES',color:'#b99ae7',dark:'#594279',css:'air',emoji:'🪽'},
  missile:{name:'Mísseis',short:'MÍSSEIS',color:'#efb06e',dark:'#80502e',css:'missile',emoji:'✦'}
};
const beats={tank:'missile',missile:'air',air:'tank'};
const heroRoster=[
 {id:'bram',name:'Bram',title:'Sentinela de Ferro',emoji:'🛡️',troop:'tank',role:'Guardião',style:'melee',hp:260,damage:20,rate:1.35,range:48,speed:2.25,armor:7},
 {id:'helga',name:'Helga',title:'Quebra-escudos',emoji:'⚒️',troop:'tank',role:'Atacante',style:'melee',hp:175,damage:34,rate:1.25,range:47,speed:2.35,armor:3},
 {id:'orwen',name:'Orwen',title:'Porta-estandarte',emoji:'🔰',troop:'tank',role:'Suporte',style:'support',hp:190,damage:9,rate:2.5,range:145,speed:1.9,armor:4},
 {id:'dorn',name:'Dorn',title:'Muralha Rúnica',emoji:'🪨',troop:'tank',role:'Especialista',style:'melee',hp:245,damage:16,rate:1.55,range:48,speed:1.85,armor:10},
 {id:'maela',name:'Maela',title:'Médica de Campanha',emoji:'🌿',troop:'tank',role:'Suporte',style:'support',hp:165,damage:12,rate:2.6,range:150,speed:1.95,armor:2},
 {id:'lyra',name:'Lyra',title:'Olho do Crepúsculo',emoji:'🏹',troop:'air',role:'Atiradora',style:'ranged',hp:142,damage:25,rate:1.05,range:155,speed:2.8,armor:1},
 {id:'kael',name:'Kael',title:'Lâmina Alada',emoji:'🪽',troop:'air',role:'Guardião',style:'melee',hp:185,damage:22,rate:1.1,range:48,speed:3.2,armor:3},
 {id:'suri',name:'Suri',title:'Harmonista',emoji:'🎶',troop:'air',role:'Suporte',style:'support',hp:150,damage:12,rate:2.4,range:150,speed:2.7,armor:1},
 {id:'vex',name:'Vex',title:'Dançarino Sombrio',emoji:'🗡️',troop:'air',role:'Especialista',style:'melee',hp:155,damage:29,rate:.95,range:45,speed:3.05,armor:1},
 {id:'aerin',name:'Aerin',title:'Falcão Cinzento',emoji:'🦅',troop:'air',role:'Atacante',style:'ranged',hp:135,damage:22,rate:.85,range:155,speed:2.85,armor:1},
 {id:'nyx',name:'Nyx',title:'Oráculo de Cinzas',emoji:'🔮',troop:'missile',role:'Arcanista',style:'ranged',hp:150,damage:33,rate:1.55,range:155,speed:2.0,armor:1,aoe:true},
 {id:'torq',name:'Torq',title:'Artífice do Cerco',emoji:'💣',troop:'missile',role:'Guardião',style:'melee',hp:205,damage:20,rate:1.4,range:50,speed:1.9,armor:5},
 {id:'elion',name:'Elion',title:'Condutor de Éter',emoji:'✨',troop:'missile',role:'Suporte',style:'support',hp:160,damage:10,rate:2.4,range:150,speed:2.0,armor:2},
 {id:'mira',name:'Mira',title:'Tecelã de Ruína',emoji:'☄️',troop:'missile',role:'Especialista',style:'ranged',hp:145,damage:24,rate:1.2,range:150,speed:2.0,armor:1},
 {id:'zara',name:'Zara',title:'Lança-tempestades',emoji:'⚡',troop:'missile',role:'Atacante',style:'ranged',hp:140,damage:30,rate:1.35,range:150,speed:2.15,armor:1}
];
const tierVariants={
 SSR:[
  ['Astra','Vanguarda da Aurora'],['Varka','Quebra-fortalezas'],['Serena','Porta-estandarte solar'],['Draeg','Muralha de basalto'],['Eira','Médica da alvorada'],
  ['Sylwen','Olho do horizonte'],['Talon','Lâmina do vendaval'],['Nym','Harmonista astral'],['Kestrel','Dançarino do eclipse'],['Riven','Falcão de prata'],
  ['Oryn','Oráculo de obsidiana'],['Bront','Artífice do trovão'],['Isolde','Condutora de éter'],['Caelia','Tecelã de estrelas'],['Zyra','Lança-tempestades']
 ],
 UR:[
  ['Valéria','Baluarte Celeste'],['Asha','Martelo do Juízo'],['Thalia','Estandarte Imortal'],['Korvan','Colosso Rúnico'],['Myrr','Mão da Fênix'],
  ['Astrid','Rainha dos Ventos'],['Elandra','Lâmina da Meia-noite'],['Zephyra','Voz das Constelações'],['Kaine','Dança do Vazio'],['Solenne','Falcão Solar'],
  ['Vael','Profeta das Cinzas'],['Ignis','Artilheiro Primordial'],['Nymera','Tecelã do Infinito'],['Maelis','Vórtice Arcano'],['Xandria','Tempestade Viva']
 ]
};
heroRoster.forEach(h=>{h.rarity='SR';});
const baseRoster=heroRoster.map(h=>({...h}));
for(const rarity of ['SSR','UR']){
 baseRoster.forEach((base,i)=>{
  const [name,title]=tierVariants[rarity][i];
  heroRoster.push({...base,id:base.id+'_'+rarity.toLowerCase(),name,title,rarity});
 });
}
const enemyTypes=[
 {name:'Cão-de-brasa',troop:'air',role:'Assaltante',hp:92,damage:13,speed:2.45,range:46,rate:1.25,color:'#bd674d',kind:'hound'},
 {name:'Brutamonte de musgo',troop:'tank',role:'Bruto',hp:195,damage:17,speed:1.35,range:47,rate:1.7,color:'#72906b',kind:'brute'},
 {name:'Acólito carbonizado',troop:'missile',role:'Conjurador',hp:100,damage:19,speed:1.15,range:140,rate:1.8,color:'#9a77b0',kind:'caster'},
 {name:'Batedor corrompido',troop:'air',role:'Assaltante',hp:105,damage:15,speed:2.2,range:43,rate:1.15,color:'#ba905d',kind:'scout'},
 {name:'Cavaleiro vazio',troop:'tank',role:'Guardião',hp:225,damage:21,speed:1.4,range:47,rate:1.55,color:'#7c929b',kind:'knight'}
];
const gearPool=[
 {name:'Lâmina do Vigia',slot:'weapon',rarity:'Raro',attackPct:.09,hpPct:0,armor:0,setId:'veilguard',setName:'Vigia do Véu'},
 {name:'Couraça do Vigia',slot:'armor',rarity:'Raro',attackPct:0,hpPct:.10,armor:2,setId:'veilguard',setName:'Vigia do Véu'},
 {name:'Medalhão do Vigia',slot:'relic',rarity:'Épico',attackPct:.03,hpPct:.04,armor:0,setId:'veilguard',setName:'Vigia do Véu'},
 {name:'Arco da Caçada',slot:'weapon',rarity:'Épico',attackPct:.12,hpPct:0,armor:0,setId:'hunt',setName:'Caçador da Bruma'},
 {name:'Passos da Caçada',slot:'armor',rarity:'Raro',attackPct:.04,hpPct:.03,armor:1,setId:'hunt',setName:'Caçador da Bruma'},
 {name:'Broquel Rúnico',slot:'armor',rarity:'Raro',attackPct:0,hpPct:.07,armor:3,setId:null,setName:''},
 {name:'Foco de Cinzas',slot:'relic',rarity:'Épico',attackPct:.08,hpPct:0,armor:0,setId:'ash',setName:'Fornalha Antiga'},
 {name:'Amuleto de Âmbar',slot:'relic',rarity:'Incomum',attackPct:.03,hpPct:.04,armor:0,setId:null,setName:''}
];
const slotNames={weapon:'Arma',armor:'Armadura',relic:'Relíquia'};
let gold=0,wave=1,selectedSlot=0,partyIds=['bram'],ownedHeroIds=['bram'],unlockedSlots=1,recruitCards=0,tavernUnlocked=false,inventoryUnlocked=false,recruitSinceSSR=0,recruitSinceUR=0,recruitCount=0,items=[],equipment={},heroProgress={},tacticalCard=false,nextItemId=1,firstGearCollected=false,firstRecruitDrop=false,tutorialSeen=false;
let running=false,cleared=false,defeated=false,lastToast=0,elapsed=0,offlineEarned=0,offlineXpEarned=0,offlineGearEarned=0;
let heroes=[],enemies=[],projectiles=[],effects=[],loot=[],stars=[],treeFar=[],treeNear=[],stones=[],fireflies=[];
let viewW=window.innerWidth,viewH=window.innerHeight,lastFrame=0,uiTimer=0,saveTimer=0,worldScroll=0;
let lastToastMsg='',firstBossDrop=false;
const healthColor='#80d7a3';

function fmt(n){return Math.floor(n).toLocaleString('pt-BR');}
function progressFor(id){if(!heroProgress[id]||typeof heroProgress[id]!=='object')heroProgress[id]={level:1,xp:0};heroProgress[id].level=Math.max(1,Math.floor(heroProgress[id].level||1));heroProgress[id].xp=Math.max(0,Math.floor(heroProgress[id].xp||0));return heroProgress[id];}
function xpNeeded(level){return 70+(Math.max(1,level)-1)*35;}
function grantHeroXp(id,amount){const p=progressFor(id);p.xp+=Math.max(0,Math.floor(amount));let levels=0;while(p.xp>=xpNeeded(p.level)){p.xp-=xpNeeded(p.level);p.level++;levels++;}return levels;}
function makeItem(){
 const eligible=wave<3?gearPool.filter(x=>x.setId==='veilguard'||x.setId===null):gearPool;
 const base=eligible[Math.floor(Math.random()*eligible.length)];
 return {...base,id:'item-'+(nextItemId++),attackPct:Math.max(0,(base.attackPct||0)+Math.random()*.02),hpPct:Math.max(0,(base.hpPct||0)+Math.random()*.02),foundAt:Date.now()};
}
function getEquippedItems(id){const slots=equipment[id]||{};return Object.keys(slots).map(slot=>items.find(it=>it.id===slots[slot])).filter(Boolean);}
function getGearBonus(id){
 const gear=getEquippedItems(id),sets={};let attackPct=0,hpPct=0,armor=0;
 gear.forEach(it=>{attackPct+=it.attackPct||0;hpPct+=it.hpPct||0;armor+=it.armor||0;if(it.setId)sets[it.setId]=(sets[it.setId]||0)+1;});
 if((sets.veilguard||0)>=2)hpPct+=.08;if((sets.veilguard||0)>=3)attackPct+=.10;
 if((sets.hunt||0)>=2)attackPct+=.08;if((sets.ash||0)>=2)hpPct+=.10;
 return {attackPct,hpPct,armor,sets,gear};
}
function heroDataAtLevel(id){
 const base=heroRoster.find(h=>h.id===id);if(!base)return null;
 const p=progressFor(id),g=getGearBonus(id),n=p.level-1;
 const tier=base.rarity==='UR'?1.30:base.rarity==='SSR'?1.12:1;
 return {...base,level:p.level,xp:p.xp,nextXp:xpNeeded(p.level),hp:Math.round(base.hp*tier*(1+n*.06)*(1+g.hpPct)),damage:Math.round(base.damage*tier*(1+n*.045)*(1+g.attackPct)),armor:base.armor+Math.floor(n*.25)+g.armor};
}
function compInfo(){
 const count={tank:0,air:0,missile:0};partyIds.forEach(id=>{const h=heroRoster.find(x=>x.id===id);if(h)count[h.troop]++;});
 const values=Object.values(count).sort((a,b)=>b-a);let bonus=0,label='Sem bônus',short='';
 if(values[0]===5){bonus=20;label='5 do mesmo tipo';short='formação pura';}
 else if(values[0]===4){bonus=tacticalCard?20:15;label=tacticalCard?'4 + 1 · Carta Tática':'4 do mesmo tipo';short=tacticalCard?'carta tática equipada':'formação especializada';}
 else if(values[0]===3){bonus=values[1]===2?10:5;label=values[1]===2?'3 + 2':'3 do mesmo tipo';short=values[1]===2?'formação mista':'especialização parcial';}
 return {count,bonus,label,short};
}
function saveGame(){
 try{localStorage.setItem(STORE_KEY,JSON.stringify({gold,wave,partyIds,ownedHeroIds,loot:loot.map(l=>({...l})),unlockedSlots,recruitCards,tavernUnlocked,inventoryUnlocked,recruitSinceSSR,recruitSinceUR,recruitCount,items,equipment,heroProgress,tacticalCard,nextItemId,firstGearCollected,firstRecruitDrop,tutorialSeen,savedAt:Date.now()}));}catch(e){}
}
function loadGame(){
 try{
  const s=JSON.parse(localStorage.getItem(STORE_KEY)||'null');if(!s)return;
  if(Number.isFinite(s.gold))gold=Math.max(0,s.gold);
  if(Number.isFinite(s.wave))wave=Math.max(1,s.wave);
  if(Array.isArray(s.ownedHeroIds)){ownedHeroIds=[...new Set(s.ownedHeroIds.filter(id=>heroRoster.some(h=>h.id===id)))];if(!ownedHeroIds.includes('bram'))ownedHeroIds.unshift('bram');}
  if(Number.isFinite(s.unlockedSlots))unlockedSlots=Math.max(1,Math.min(5,Math.floor(s.unlockedSlots)));
  if(Array.isArray(s.partyIds)&&s.partyIds.length>=1&&s.partyIds.length<=5&&s.partyIds.every(id=>ownedHeroIds.includes(id))&&new Set(s.partyIds).size===s.partyIds.length)partyIds=[...s.partyIds];
  if(partyIds.length>unlockedSlots)partyIds=partyIds.slice(0,unlockedSlots);
  if(Array.isArray(s.loot))loot=s.loot.filter(l=>l&&['gold','gear','relic','cards'].includes(l.kind)).map(l=>({...l,created:elapsed}));
  recruitCards=Math.max(0,Math.floor(Number(s.recruitCards)||0));tavernUnlocked=!!s.tavernUnlocked;inventoryUnlocked=!!s.inventoryUnlocked;
  recruitSinceSSR=Math.max(0,Math.floor(Number(s.recruitSinceSSR)||0));recruitSinceUR=Math.max(0,Math.floor(Number(s.recruitSinceUR)||0));recruitCount=Math.max(0,Math.floor(Number(s.recruitCount)||0));
  if(Array.isArray(s.items))items=s.items.filter(it=>it&&it.id&&it.slot).slice(-60);
  if(s.equipment&&typeof s.equipment==='object')equipment=s.equipment;
  if(s.heroProgress&&typeof s.heroProgress==='object')heroProgress=s.heroProgress;
  tacticalCard=!!s.tacticalCard;firstGearCollected=!!s.firstGearCollected;firstRecruitDrop=!!s.firstRecruitDrop;tutorialSeen=!!s.tutorialSeen;
  nextItemId=Math.max(1,Number(s.nextItemId)||1,items.reduce((max,it)=>Math.max(max,Number(String(it.id).replace('item-',''))+1||1),1));
  const mins=Math.min(720,Math.max(0,(Date.now()-(s.savedAt||Date.now()))/60000));
  if(mins>=2){offlineEarned=Math.floor(mins*(26+Math.min(20,wave*1.5)));gold+=offlineEarned;offlineXpEarned=Math.floor(mins*1.35);partyIds.forEach(id=>grantHeroXp(id,offlineXpEarned));offlineGearEarned=inventoryUnlocked?Math.min(12,Math.floor(mins/35)):0;for(let i=0;i<offlineGearEarned;i++)items.push(makeItem());if(items.length>60)items=items.slice(-60);}
 }catch(e){console.warn('Save local inválido',e);}
}
function resize(){
 viewW=window.innerWidth;viewH=window.innerHeight;
 canvas.width=Math.max(480,Math.floor(viewW*.72));canvas.height=Math.max(300,Math.floor(viewH*.72));
 canvas.style.width=viewW+'px';canvas.style.height=viewH+'px';
 canvas.style.imageRendering='pixelated';
 ctx.setTransform(canvas.width/viewW,0,0,canvas.height/viewH,0,0);ctx.imageSmoothingEnabled=false;
 prepareBackdrop();
}
function seedRand(seed){let x=seed|0;return ()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
function prepareBackdrop(){
 const r=seedRand(78123);stars=[];treeFar=[];treeNear=[];stones=[];fireflies=[];
 for(let i=0;i<80;i++)stars.push({x:r()*viewW,y:r()*viewH*.34,r:r()<.8?1:2,a:r()*.65+.15,p:r()*6.28});
 for(let i=0;i<34;i++)treeFar.push({x:r()*viewW*1.6,y:r()*viewH*.47,scale:.5+r()*.75,type:i%4});
 for(let i=0;i<18;i++)treeNear.push({x:r()*viewW*1.7,y:viewH*(.61+r()*.16),scale:.65+r()*.9,type:i%3});
 for(let i=0;i<48;i++)stones.push({x:r()*viewW*1.6,y:viewH*(.7+r()*.1),w:4+r()*16,h:2+r()*5,c:i%3});
 for(let i=0;i<26;i++)fireflies.push({x:r()*viewW,y:viewH*(.30+r()*.42),phase:r()*6.28,s:r()*1.8+.6});
}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill();}
function drawTree(x,base,scale,type,near){
 const s=scale, trunk=near?'#362f2c':'#273237',leaves=near?['#243b35','#2d483c','#3a5140']:['#23363a','#283e40','#304743'];
 ctx.fillStyle=trunk;ctx.fillRect(x-3*s,base-24*s,6*s,26*s);
 for(let j=0;j<3;j++){const wide=(12-j*2)*s;poly([[x-wide,base-(19+j*10)*s],[x,base-(41+j*10)*s],[x+wide,base-(19+j*10)*s]],leaves[(type+j)%leaves.length]);}
 if(near){ctx.fillStyle='#8b7750';ctx.fillRect(x-5*s,base-3*s,10*s,3*s);}
}
function drawBackground(t){
 const W=viewW,H=viewH;
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#101d30');sky.addColorStop(.44,'#45515a');sky.addColorStop(.75,'#9b7960');sky.addColorStop(1,'#243a35');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 // A small pale moon and subdued stars make the world feel alive without heavy rendering.
 ctx.fillStyle='#e6d9ae';ctx.globalAlpha=.74;ctx.beginPath();ctx.arc(W*.78,H*.17,Math.min(17,W*.02),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 stars.forEach(s=>{ctx.globalAlpha=s.a*(.72+.28*Math.sin(t*1.25+s.p));ctx.fillStyle='#e1dcbf';ctx.fillRect(s.x,s.y,s.r,s.r);});ctx.globalAlpha=1;
 poly([[0,H*.52],[W*.09,H*.36],[W*.19,H*.46],[W*.31,H*.31],[W*.42,H*.47],[W*.55,H*.35],[W*.68,H*.47],[W*.81,H*.32],[W,H*.48],[W,H*.72],[0,H*.72]],'#34494b');
 poly([[0,H*.58],[W*.13,H*.46],[W*.22,H*.55],[W*.38,H*.41],[W*.51,H*.55],[W*.64,H*.43],[W*.79,H*.57],[W*.9,H*.45],[W,H*.55],[W,H*.74],[0,H*.74]],'#2c4140');
 // Distant tower silhouette.
 const tx=W*.67,ty=H*.52;ctx.fillStyle='#2b3836';ctx.fillRect(tx,ty-72,47,73);ctx.fillRect(tx-10,ty-47,18,48);ctx.fillRect(tx+36,ty-35,18,36);
 poly([[tx-11,ty-72],[tx+23,ty-106],[tx+48,ty-72]],'#2b3836');
 ctx.fillStyle='#d2a96d';for(let j=0;j<3;j++){ctx.fillRect(tx+12+j*12,ty-31,4,8);ctx.fillRect(tx-3,ty-26+j*13,4,4);}
 // Back tree-line parallax.
 treeFar.forEach((tr,i)=>{const x=((tr.x-worldScroll*.12)%(W*1.65)+W*1.65)%(W*1.65)-W*.24;drawTree(x,H*.59+tr.y*.04,tr.scale*.72,tr.type,false);});
 // Main ground and winding path.
 ctx.fillStyle='#31483b';ctx.fillRect(0,H*.64,W,H*.36);
 poly([[0,H*.73],[W*.16,H*.69],[W*.33,H*.74],[W*.5,H*.7],[W*.67,H*.75],[W*.84,H*.70],[W,H*.73],[W,H],[0,H]],'#6b624c');
 poly([[0,H*.77],[W*.18,H*.74],[W*.34,H*.79],[W*.53,H*.75],[W*.69,H*.8],[W*.87,H*.75],[W,H*.78],[W,H],[0,H]],'#877659');
 ctx.fillStyle='#6b7752';for(let i=0;i<Math.ceil(W/11);i++){const x=i*11-(worldScroll*.6%11),y=H*.72+Math.sin(i*.7)*3;ctx.fillRect(x,y,3,5);ctx.fillRect(x+4,y-3,2,4);}
 stones.forEach((s,i)=>{const x=((s.x-worldScroll*.85)%(W*1.6)+W*1.6)%(W*1.6)-W*.2;ctx.fillStyle=['#a28b6a','#796d55','#b1a080'][s.c];ctx.fillRect(x,s.y,s.w,s.h);});
 treeNear.forEach((tr,i)=>{const x=((tr.x-worldScroll*.35)%(W*1.75)+W*1.75)%(W*1.75)-W*.25;drawTree(x,tr.y,tr.scale,tr.type,true);});
 // Rune stones mark the trail edges.
 for(let i=0;i<7;i++){const x=(i*W/6+W*.035-(worldScroll*.22%W)+W)%W;const y=H*.76+Math.sin(i*1.3)*H*.025;ctx.fillStyle='#51483a';ctx.fillRect(x-4,y-19,8,23);ctx.fillStyle='#d1b875';ctx.fillRect(x-1,y-15,2,13);ctx.fillRect(x-4,y-10,8,2);}
 fireflies.forEach(f=>{const x=((f.x-worldScroll*.13)%(W*1.2)+W*1.2)%(W*1.2)-W*.1,y=f.y+Math.sin(t*1.3+f.phase)*9;ctx.globalAlpha=.25+.55*(.5+.5*Math.sin(t*2+f.phase));ctx.fillStyle='#d8e69b';ctx.fillRect(x,y,f.s+1,f.s+1);});ctx.globalAlpha=1;
 const vignette=ctx.createRadialGradient(W*.51,H*.49,H*.12,W*.51,H*.49,H*.78);vignette.addColorStop(0,'#07101600');vignette.addColorStop(1,'#06111891');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
}
function laneY(i){return viewH*(.445+i*.052);}
function heroHomeX(i){return viewW*(.17+(i%2)*.035)+(Math.floor(i/2)*8);}
function textFloat(x,y,text,color){effects.push({kind:'text',x,y,text,color,life:1,age:0,vy:-21});}
function burst(x,y,color,count,power){
 for(let i=0;i<count;i++)effects.push({kind:'particle',x:x+rand(-4,4),y:y+rand(-5,3),vx:rand(-43,43)*power,vy:rand(-75,25)*power,life:rand(.28,.65),age:0,size:rand(2,4),color:color});
 effects.push({kind:'ring',x:x,y:y,life:.28,age:0,color:color,r:4});
}
function drawBar(x,y,w,ratio,enemy){
 ctx.fillStyle='#11181a';ctx.fillRect(x-1,y-1,w+2,5);
 ctx.fillStyle='#3f2d2a';ctx.fillRect(x,y,w,3);
 ctx.fillStyle=ratio<.25?'#df6b5a':enemy?'#d39b71':'#7bd69c';ctx.fillRect(x,y,w*clamp(ratio,0,1),3);
}
function drawHero(u,t){
 if(u.hp<=0&&u.deadTimer>.7)return;
 const W=viewW,H=viewH,p=clamp(W/370,2.2,3.35),dir=u.facing||1;
 ctx.save();ctx.globalAlpha=u.alive?1:Math.max(0,1-u.deadTimer*1.2);
 ctx.fillStyle='#10191a88';ctx.beginPath();ctx.ellipse(u.x,u.y+2,p*7,p*1.5,0,0,Math.PI*2);ctx.fill();
 ctx.translate(Math.round(u.x),Math.round(u.y));if(dir<0)ctx.scale(-1,1);
 const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x*p),Math.round(y*p),Math.max(1,Math.round(w*p)),Math.max(1,Math.round(h*p)));};
 const dark='#202a31',boots='#292e31',skin=u.data.troop==='missile'?'#c8b8d2':u.data.troop==='air'?'#e0c09c':'#c8bfa3',primary=troop[u.data.troop].color,shadow=troop[u.data.troop].dark,trim='#e1c47e';
 const walk=u.alive&&u.moving?Math.sin(t*11+u.animOffset)*1.1:0;
 // Legs and boots.
 px(-4, -7+walk,3,5,shadow);px(2,-7-walk,3,5,shadow);px(-5,-2+walk,4,2,boots);px(1,-2-walk,4,2,boots);
 // Cape.
 px(-4,-15,8,8,dark);px(-3,-14,6,6,shadow);
 // Torso outline, plate and belt.
 px(-5,-15,11,9,dark);px(-4,-14,9,7,primary);px(-3,-13,7,4,shadow);px(-2,-13,5,3,primary);px(-4,-7,9,1,trim);
 // Head, face, helmet/hood.
 px(-4,-20,9,6,dark);px(-3,-19,7,5,skin);px(-4,-21,9,3,shadow);px(-3,-22,7,2,primary);px(-5,-20,2,3,primary);px(4,-20,2,3,primary);
 px(-2,-18,1,1,'#1c2428');px(2,-18,1,1,'#1c2428');px(-1,-16,3,1,'#a77b68');
 // Shoulder armor and moving arms.
 px(-7,-15,3,3,trim);px(5,-15,3,3,trim);
 px(-7,-12,2,4,primary);px(5,-12,2,4,primary);
 const swing=u.attackAnim>0?Math.sin((u.attackAnim/.26)*Math.PI):0;
 if(u.data.style==='ranged'||u.data.style==='support'){
   px(6,-12,2,4,shadow);px(7,-14,1,6,trim);px(6,-16,3,2,trim);
   px(8,-17,2,2,u.data.troop==='missile'?'#ffd18b':'#c6a8ff');
   if(u.data.style==='ranged'){px(-8,-14,2,4,shadow);px(-9,-17,1,7,trim);px(-10,-16,1,5,primary);}
 }else{
   px(6,-12,3,3,primary);px(8,-13,1,5,trim);px(9,-14,2,7,trim);px(11,-16,2,3,trim);
   if(u.data.role==='Guardião'||u.data.id==='bram'||u.data.id==='torq'){px(-9,-14,3,6,'#d3b975');px(-8,-13,1,4,shadow);px(-9,-12,3,1,trim);}
   if(swing>.35){ctx.globalAlpha*=.8;ctx.fillStyle='#f8e8b4';ctx.fillRect(11*p,-19*p,12*p,1*p);ctx.fillRect(17*p,-17*p,2*p,5*p);ctx.globalAlpha=u.alive?1:Math.max(0,1-u.deadTimer*1.2);}
 }
 if(u.data.troop==='air'){px(-8,-18,2,4,primary);px(-10,-19,2,3,shadow);px(6,-20,2,4,primary);px(8,-21,2,3,shadow);}
 if(u.data.troop==='missile'){px(-2,-23,2,2,trim);px(2,-23,2,2,trim);px(8,-21,1,2,'#ffe2a3');}
 else if(u.data.troop==='tank'){px(0,-24,2,3,trim);}
 else{px(-2,-23,5,1,trim);}
 if(u.data.aoe&&u.attackAnim>0){ctx.globalAlpha=.24;ctx.fillStyle='#b99aff';ctx.fillRect(-14*p,-28*p,28*p,31*p);ctx.globalAlpha=u.alive?1:Math.max(0,1-u.deadTimer*1.2);}
 ctx.restore();
 const barY=u.y-27*p-12;
 drawBar(u.x-18*p,barY,36*p,u.hp/u.maxHp,false);
 ctx.fillStyle='#e3e8d7';ctx.font='bold '+Math.max(9,p*3.2)+'px system-ui';ctx.textAlign='center';ctx.fillText(u.data.name,u.x,barY-4);
}
function drawEnemy(u,t){
 if(!u.alive&&u.deadTimer>.6)return;
 const p=clamp(viewW/370,2.2,3.35),dir=u.facing||-1;
 ctx.save();ctx.globalAlpha=u.alive?1:Math.max(0,1-u.deadTimer*1.7);
 ctx.fillStyle='#10161988';ctx.beginPath();ctx.ellipse(u.x,u.y+2,p*7.4,p*1.7,0,0,Math.PI*2);ctx.fill();
 ctx.translate(Math.round(u.x),Math.round(u.y));if(dir<0)ctx.scale(-1,1);
 const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x*p),Math.round(y*p),Math.max(1,Math.round(w*p)),Math.max(1,Math.round(h*p)));};
 const dark='#252c30',c=u.data.color,highlight=u.data.troop==='air'?'#d8b17a':u.data.troop==='missile'?'#d0a9e6':'#99b28a';
 const walk=u.moving?Math.sin(t*10+u.animOffset)*.9:0;
 px(-5,-7+walk,4,6,dark);px(2,-7-walk,4,6,dark);px(-6,-2+walk,5,2,'#392e2d');px(1,-2-walk,5,2,'#392e2d');
 px(-7,-15,14,9,dark);px(-6,-14,12,8,c);px(-5,-12,10,4,highlight);px(-4,-8,9,2,dark);
 px(-5,-20,11,7,dark);px(-4,-19,9,6,c);px(-3,-18,7,4,dark);
 px(-6,-21,4,3,highlight);px(3,-21,4,3,highlight);px(-3,-23,3,3,highlight);px(2,-23,3,3,highlight);
 px(-3,-18,2,2,'#ff7157');px(2,-18,2,2,'#ff7157');
 px(-8,-14,3,5,dark);px(5,-14,3,5,dark);px(7,-13,3,5,highlight);px(9,-15,2,5,'#d9d0ae');
 if(u.data.kind==='brute'){px(-8,-18,4,4,'#8da482');px(5,-18,4,4,'#8da482');px(-3,-24,3,4,'#d0c6a8');px(2,-24,3,4,'#d0c6a8');}
 if(u.data.kind==='caster'){px(-1,-26,4,3,'#dbc0ff');px(-3,-27,2,2,'#b79de7');px(3,-27,2,2,'#b79de7');}
 if(u.data.kind==='hound'){px(-5,-24,3,4,'#d8c5a3');px(3,-24,3,4,'#d8c5a3');}
 if(u.data.boss){px(-9,-25,5,6,'#b99b67');px(5,-25,5,6,'#b99b67');px(-3,-28,7,3,'#efcc7c');}
 if(u.attackAnim>0){ctx.fillStyle='#f3d5a1';ctx.fillRect(-4*p,-17*p,8*p,2*p);}
 ctx.restore();
 drawBar(u.x-18*p,u.y-29*p-10,36*p,u.hp/u.maxHp,true);
 if(u.data.boss){ctx.fillStyle='#edc16f';ctx.textAlign='center';ctx.font='bold 11px system-ui';ctx.fillText('ELITE',u.x,u.y-29*p-17);}
}
function drawLoot(t){
 loot.forEach(l=>{
  const bob=Math.sin(t*3+l.phase)*3,rot=Math.sin(t*2+l.phase)*3,x=Math.round(l.x),y=Math.round(l.y+bob);
  ctx.save();ctx.globalAlpha=.45+.25*(.5+.5*Math.sin(t*4+l.phase));ctx.fillStyle=l.color;ctx.beginPath();ctx.ellipse(x,y+10,12,4,0,0,Math.PI*2);ctx.fill();ctx.restore();
  if(l.kind==='cards'){
   ctx.save();ctx.translate(x,y);ctx.rotate(rot*.035);ctx.fillStyle='#143138';ctx.fillRect(-9,-11,18,22);ctx.fillStyle='#79d5dc';ctx.fillRect(-7,-9,14,18);ctx.fillStyle='#f4e3a7';ctx.fillRect(-3,-5,6,7);ctx.fillRect(-2,-8,4,2);ctx.restore();
  }else{
   ctx.fillStyle='#11191d';ctx.fillRect(x-7+rot,y-9,14,15);ctx.fillStyle=l.color;ctx.fillRect(x-5+rot,y-8,10,12);ctx.fillStyle='#fff0bd';ctx.fillRect(x-2+rot,y-6,4,5);ctx.fillStyle='#f8e7b1';ctx.fillRect(x-1+rot,y+7,3,2);
  }
  if(t-l.created>1.5){ctx.fillStyle='#f3e4c0';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText(l.kind==='cards'?'CARTAS ×'+l.value:'CLIQUE / +',x,y+26);}
 });
}
function drawEffects(dt){
 for(let i=effects.length-1;i>=0;i--){
  const e=effects[i];const a=dt; e.age+=a; const q=e.age/e.life;
  if(e.kind==='particle'){e.x+=e.vx*a;e.y+=e.vy*a;e.vy+=90*a;ctx.globalAlpha=1-q;ctx.fillStyle=e.color;ctx.fillRect(Math.round(e.x),Math.round(e.y),e.size,e.size);}
  else if(e.kind==='text'){e.y+=e.vy*a;ctx.globalAlpha=1-q;ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#111a20';ctx.strokeText(e.text,e.x,e.y);ctx.fillStyle=e.color;ctx.fillText(e.text,e.x,e.y);}
  else if(e.kind==='ring'){ctx.globalAlpha=1-q;ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,4+q*24,0,Math.PI*2);ctx.stroke();}
  ctx.globalAlpha=1;
  if(q>=1)effects.splice(i,1);
 }
}
function drawScene(t,dt){
 drawBackground(t);
 // Distant zone label integrated into the art rather than a full-screen menu.
 ctx.fillStyle='#0d18224a';ctx.fillRect(0,viewH*.29,viewW,1);
 const units=[...heroes,...enemies].filter(u=>u.alive||u.deadTimer<.6).sort((a,b)=>a.y-b.y);
 units.forEach(u=>{if(u.isEnemy)drawEnemy(u,t);else drawHero(u,t);});
 drawLoot(t);drawEffects(dt);
}
function nearestAlive(list,from){
 let best=null,score=Infinity;
 for(const u of list){if(!u.alive)continue;const dx=u.x-from.x,dy=(u.y-from.y)*1.18;const d=Math.hypot(dx,dy);if(d<score){score=d;best=u;}}
 return {unit:best,distance:score};
}
function makeUnit(data,isEnemy,x,y){
 const scale=isEnemy?(data.boss?1.2:1):1;
 return {data,isEnemy,x,y,homeX:x,homeY:y,hp:data.hp,maxHp:data.hp,alive:true,deadTimer:0,cooldown:rand(.2,.9),attackAnim:0,animOffset:rand(0,6),moving:false,facing:isEnemy?-1:1,scale,homeLane:y};
}
function autoFillParty(){
 while(partyIds.length<unlockedSlots){const next=ownedHeroIds.find(id=>!partyIds.includes(id));if(!next)break;partyIds.push(next);}
}
function resetPartyWorld(){
 heroes=partyIds.map((id,i)=>{
  const data=heroDataAtLevel(id);
  return makeUnit(data,false,heroHomeX(i),laneY(i));
 });
 renderPartyUI();updateComposition();updatePowerNote();
}
function spawnWave(retry=false){
 if(cleared&&wave===2&&ownedHeroIds.length<2){showToast('Recrute seu primeiro aliado','Reúna 5 cartas na Taverna antes de avançar para a próxima horda.');if(tavernUnlocked){renderTavern();$('tavernOverlay').classList.add('open');}return;}
 autoFillParty();if(heroes.length!==partyIds.length)resetPartyWorld();
 heroes.forEach((h,i)=>{
  const ratio=retry ? 0.7 : Math.max(0.62,h.hp/h.maxHp);
  h.data=heroDataAtLevel(partyIds[i]);h.maxHp=h.data.hp;h.hp=h.maxHp*ratio;h.alive=true;h.deadTimer=0;
  h.x=heroHomeX(i);h.y=laneY(i);h.homeX=h.x;h.homeY=h.y;h.cooldown=rand(.2,.8);h.attackAnim=0;
 });
 enemies=[];projectiles=[];effects=[];
 cleared=false;defeated=false;running=true;
 const count=wave===1?1:wave<=3?2:Math.min(wave%5===0?1:3+Math.floor((wave-1)*.42),7);
 for(let i=0;i<count;i++){
  let src=enemyTypes[(wave-1+i*2)%enemyTypes.length];
  const boss=wave%5===0;
  const mult=(1+(wave-1)*.13)*(boss?2.25:1);
  const data={...src,name:boss?'Guardião do Véu':src.name,hp:Math.round(src.hp*mult),damage:Math.round(src.damage*(1+(wave-1)*.07)*(boss?1.35:1)),boss};
  const x=viewW*(.75+Math.random()*.13),y=laneY((i+Math.floor(Math.random()*2))%5)+rand(-8,8);
  enemies.push(makeUnit(data,true,x,y));
 }
 $('pauseButton').textContent='Ⅱ Pausar';$('nextWaveButton').disabled=true;
 $('waveLabel').textContent='HORDA '+String(wave).padStart(2,'0')+' · EM COMBATE';
 $('zoneHint').textContent=wave%5===0?'ELITE DA FRONTEIRA':'CRIATURAS DA FRONTEIRA';
 $('combatStatus').textContent='Batalha automática';$('combatMessage').textContent='Derrote a horda para ganhar ouro, experiência e novas oportunidades de recrutamento.';$('statusDot').style.background='var(--mint)';
 renderPartyUI();updateHud();updateComposition();updateMissionCopy();saveGame();
 if(wave%5===0)showToast('Elite à vista!','Derrote o Guardião do Véu para obter uma relíquia.');
}
function effectiveMultiplier(attacker,target){
 if(beats[attacker.data.troop]===target.data.troop)return 1.2;
 if(beats[target.data.troop]===attacker.data.troop)return .82;
 return 1;
}
function makeProjectile(attacker,target,damage){
 projectiles.push({x:attacker.x,y:attacker.y-34,target,damage,fromTroop:attacker.data.troop,isEnemy:attacker.isEnemy,aoe:!!attacker.data.aoe,speed:attacker.data.aoe?280:380,color:attacker.isEnemy?'#f08b6b':troop[attacker.data.troop].color,age:0});
}
function attackUnit(attacker,target){
 attacker.cooldown=1/(attacker.data.rate||1);attacker.attackAnim=.26;
 if(!attacker.isEnemy&&attacker.data.style==='support'){
  const ally=heroes.filter(h=>h.alive&&h.hp<h.maxHp*.86).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
  if(ally){healUnit(ally,attacker.data.id==='maela'?25:attacker.data.id==='suri'?16:20);return;}
 }
 const damage=attacker.data.damage*(attacker.isEnemy?1:(1+compInfo().bonus/100));
 if(attacker.data.style==='ranged'||attacker.data.style==='support'||(attacker.isEnemy&&attacker.data.range>90)){
  makeProjectile(attacker,target,damage);
 }else applyDamage(target,damage,attacker.data.troop);
}
function applyDamage(target,damage,attackerTroop){
 if(!target||!target.alive)return;
 const multi=effectiveMultiplier({data:{troop:attackerTroop}},target);
 const real=Math.max(1,damage*multi-(target.data.armor||0)*.28);
 target.hp-=real;target.attackAnim=.10;
 textFloat(target.x,target.y-45,Math.round(real),multi>1?'#ffe39a':'#f7f4df');
 burst(target.x,target.y-17,multi>1?'#ffe39a':attackerTroop==='missile'?'#d3a9ff':'#f2e8ca',5,.65);
 if(target.hp<=0)killUnit(target);
}
function healUnit(target,amount){
 if(!target||!target.alive)return;
 const before=target.hp;target.hp=Math.min(target.maxHp,target.hp+amount);
 const got=Math.round(target.hp-before);if(got>0){textFloat(target.x,target.y-47,'+'+got,'#9ff0b0');burst(target.x,target.y-18,'#90e9a7',5,.45);}
}
function killUnit(target){
 if(!target.alive)return;
 target.alive=false;target.deadTimer=0;
 burst(target.x,target.y-14,target.isEnemy?'#ffd08b':'#9ee8ba',13,1);
 if(target.isEnemy){
  if(target.data.boss){makeLoot(target.x,target.y-10,'relic');firstBossDrop=true;}
  else if(!firstRecruitDrop){firstRecruitDrop=true;makeLoot(target.x,target.y-10,'cards',3);}
  else if(wave>=3&&!firstGearCollected&&!loot.some(l=>l.kind==='gear'))makeLoot(target.x,target.y-10,'gear');
  else {const roll=Math.random();if(roll<.25)makeLoot(target.x,target.y-10,'cards',1);else if(roll<.76)makeLoot(target.x,target.y-10,'gold');else if(wave>=3&&roll<.96)makeLoot(target.x,target.y-10,'gear');}
 }
 saveGame();
}
function updateProjectiles(dt){
 for(let i=projectiles.length-1;i>=0;i--){
  const p=projectiles[i];
  if(!p.target.alive){projectiles.splice(i,1);continue;}
  const tx=p.target.x,ty=p.target.y-30,dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);
  if(d<p.speed*dt+5){
   if(p.aoe){
    const targetGroup=p.isEnemy?heroes:enemies;
    targetGroup.filter(u=>u.alive&&Math.hypot(u.x-p.target.x,(u.y-p.target.y)*.9)<72).forEach(u=>applyDamage(u,p.damage*.68,p.fromTroop));
   }else applyDamage(p.target,p.damage,p.fromTroop);
   burst(tx,ty,p.color,7,.7);projectiles.splice(i,1);
  }else{p.x+=dx/d*p.speed*dt;p.y+=dy/d*p.speed*dt;p.age+=dt;}
 }
}
function updateUnits(dt,t){
 const liveH=heroes.filter(h=>h.alive),liveE=enemies.filter(e=>e.alive);
 for(const u of [...heroes,...enemies]){
  if(!u.alive){u.deadTimer+=dt;continue;}
  u.cooldown-=dt;if(u.attackAnim>0)u.attackAnim-=dt;
  const targets=u.isEnemy?liveH:liveE;
  if(!running||!targets.length){u.moving=false;continue;}
  const res=nearestAlive(targets,u),target=res.unit;if(!target)continue;
  const dx=target.x-u.x,dy=target.y-u.y,dist=Math.hypot(dx,dy);
  u.facing=dx>=0?1:-1;
  let desired=u.data.range||45;
  if(u.isEnemy)desired=u.data.range||45;
  const willHeal=!u.isEnemy&&u.data.style==='support'&&heroes.some(h=>h.alive&&h.hp<h.maxHp*.82);
  if(willHeal)desired=Math.min(desired,130);
  const canMove=dist>desired*.88&&(!willHeal||dist>130);
  u.moving=canMove;
  if(canMove){
   const speed=(u.isEnemy?31+u.data.speed*5:37+u.data.speed*5);
   const step=Math.min(dist-desired*.8,speed*dt),nx=dx/(dist||1),ny=dy/(dist||1);
   u.x+=nx*step;u.y+=ny*step*.48;
   if(!u.isEnemy)u.y=clamp(u.y,u.homeY-13,u.homeY+13);
   else u.y=clamp(u.y,viewH*.40,viewH*.72);
  }
  if(dist<=desired+8&&u.cooldown<=0)attackUnit(u,target);
 }
 updateProjectiles(dt);
 if(running&&enemies.length>0&&enemies.every(e=>!e.alive))onWaveClear();
 if(running&&heroes.every(h=>!h.alive))onPartyDefeated();
}
function makeLoot(x,y,kind,value=0){
 const cols={gold:'#f0ce7a',gear:'#c9a5ff',relic:'#f8aa65',cards:'#79d5dc'};
 loot.push({x,y,kind,color:cols[kind]||'#f0ce7a',created:elapsed,phase:rand(0,6.2),value:kind==='gold'?95+wave*19:kind==='cards'?Math.max(1,value||1):0});
}
function pickLoot(l,automatic=false){
 if(!l)return;
 if(l.kind==='gold'){gold+=l.value;textFloat(l.x,l.y-15,'+'+fmt(l.value)+' ouro','#f5d37e');if(!automatic)showToast('Ouro recolhido','+'+fmt(l.value)+' moedas.');}
 else if(l.kind==='cards'){recruitCards+=Math.max(1,l.value||1);textFloat(l.x,l.y-15,'+'+Math.max(1,l.value||1)+' cartas','#a8f1f2');if(!automatic)showToast('Cartas de recrutamento','+'+Math.max(1,l.value||1)+' cartas. Leve-as à Taverna para encontrar um aliado.');renderTavern();}
 else if(l.kind==='relic'&&!tacticalCard){tacticalCard=true;showToast('Relíquia encontrada','Carta Tática: quatro heróis de um tipo e um de outro mantêm +20%.');updateComposition();}
 else{const item=makeItem();items.push(item);if(items.length>60)items=items.slice(-60);firstGearCollected=true;showToast('Equipamento encontrado',item.name+' · '+item.rarity+'. Abra Itens para equipar e comparar.');renderInventory();}
 loot=loot.filter(x=>x!==l);updateHud();updateMissionCopy();saveGame();
}
function onWaveClear(){
 if(cleared||defeated)return;
 cleared=true;running=false;
 const clearedWave=wave,alive=heroes.filter(h=>h.alive).length;
 const reward=140+clearedWave*38+alive*14;gold+=reward;
 const xp=25+clearedWave*10;let levels=0;partyIds.forEach(id=>{levels+=grantHeroXp(id,xp);});
 heroes.forEach((h,i)=>{const data=heroDataAtLevel(partyIds[i]),ratio=h.hp/h.maxHp;h.data=data;h.maxHp=data.hp;h.hp=Math.min(data.hp,data.hp*ratio);});
 const oldSlotLimit=unlockedSlots;
 if(clearedWave===1){tavernUnlocked=true;recruitCards+=2;unlockedSlots=Math.max(unlockedSlots,2);}
 if(clearedWave>=3&&!inventoryUnlocked)inventoryUnlocked=true;
 const slotLimit=clearedWave>=10?5:clearedWave>=6?4:clearedWave>=3?3:clearedWave>=1?2:1;
 unlockedSlots=Math.max(unlockedSlots,slotLimit);
 if(clearedWave>1&&clearedWave%2===0)recruitCards+=1;
 autoFillParty();
 if(clearedWave%5===0){makeLoot(viewW*.52,viewH*.66,'relic');showToast('Chefe derrotado!','+'+fmt(reward)+' ouro · '+fmt(xp)+' XP por herói · relíquia garantida.');}
 else if(clearedWave===1)showToast('Taverna da Fronteira desbloqueada','Você ganhou 2 cartas de missão. Recolha as 3 cartas que caíram para recrutar seu primeiro aliado.');
 else if(clearedWave===3)showToast('Nova vaga e equipamentos desbloqueados','Sua expedição pode receber um terceiro herói. Equipamentos também passam a cair.');
 else if(unlockedSlots>oldSlotLimit)showToast('Nova vaga de formação','Uma nova vaga foi liberada. Recrute ou equipe um herói da sua coleção.');
 else showToast('Horda eliminada','+'+fmt(reward)+' ouro · '+fmt(xp)+' XP por herói'+(levels?' · '+levels+' novo(s) nível(is)':'')+'.');
 $('pauseButton').textContent='▶ Retomar';$('nextWaveButton').disabled=clearedWave===1&&ownedHeroIds.length<2;
 $('waveLabel').textContent='HORDA '+String(clearedWave).padStart(2,'0')+' · CONCLUÍDA';$('combatStatus').textContent='Área segura';
 $('combatMessage').textContent=clearedWave===1?'Taverna aberta. Recolha as cartas e recrute seu primeiro aliado.':'Recolha os cristais e prepare a próxima expedição.';$('statusDot').style.background='var(--gold)';
 wave=clearedWave+1;updateHud();renderPartyUI();updateComposition();updatePowerNote();updateTavernButton();renderTavern();updateMissionCopy();saveGame();
}
function onPartyDefeated(){
 if(defeated)return;
 defeated=true;running=false;
 $('pauseButton').textContent='↻ Tentar de novo';$('nextWaveButton').disabled=true;
 $('combatStatus').textContent='Equipe derrotada';$('combatMessage').textContent='Pause, troque heróis ou tente novamente. Seu progresso permanece salvo.';
 $('waveLabel').textContent='HORDA '+String(wave).padStart(2,'0')+' · DERROTA';$('statusDot').style.background='var(--red)';
 showToast('A equipe precisa se reorganizar','Tente novamente ou troque a composição antes da próxima batalha.');
}
function updateHud(){
 $('goldValue').textContent=fmt(gold);$('waveValue').textContent=String(wave).padStart(2,'0');
 $('recruitCardsValue').textContent=String(recruitCards);$('recruitCardBadge').textContent=String(recruitCards);$('bagCount').textContent=String(items.length);
 updateTavernButton();
 $('rosterButton').disabled=ownedHeroIds.length<2;$('inventoryButton').disabled=!inventoryUnlocked;
 $('teamCount').textContent=partyIds.length+' / '+unlockedSlots+' vagas abertas · '+ownedHeroIds.length+' recrutados';
}
function updateComposition(){
 const c=compInfo();$('bonusValue').textContent=partyIds.length<3?'—':'+'+c.bonus+'%';
 $('bonusLabel').textContent=partyIds.length<2?'Recrute aliados para ativar sinergias':partyIds.length<3?'Sinergias completas com 3 heróis':c.label+' · '+c.short;
 $('typeChips').innerHTML=['tank','air','missile'].map(k=>'<span class="chip"><span class="'+troop[k].css+'">'+troop[k].emoji+'</span> '+c.count[k]+' '+troop[k].name+'</span>').join('');
}
function updatePowerNote(){
 const c=compInfo(),power=partyIds.reduce((s,id)=>s+(heroDataAtLevel(id)?.damage||0),0)*(1+c.bonus/100);
 $('combatMessage').textContent='Poder de ataque '+fmt(power)+'. '+c.label+'.';
}
function renderPartyUI(){
 const root=$('partyCards');
 const cards=Array.from({length:5},(_,i)=>{
  const id=partyIds[i];
  if(id){const h=heroRoster.find(x=>x.id===id),u=heroes[i],p=progressFor(id),ratio=u?Math.max(0,u.hp/u.maxHp):1;
   return '<button class="heroCard '+(selectedSlot===i?'active':'')+'" data-slot="'+i+'"><div class="cardTop"><span class="heroGlyph">'+h.emoji+'</span><span><strong>'+h.name+'</strong><small>NV. '+p.level+' · '+h.rarity+' · '+h.role+'</small></span></div><div class="healthTrack"><div class="healthFill" style="width:'+(ratio*100)+'%"></div></div><div class="cardStats"><span class="affinity '+h.troop+'">'+troop[h.troop].name+'</span><span>'+Math.ceil(u?.hp||heroDataAtLevel(id).hp)+' HP</span></div></button>';
  }
  if(i<unlockedSlots)return '<button class="heroCard emptySlot '+(selectedSlot===i?'active':'')+'" data-empty-slot="'+i+'"><span class="emptyGlyph">＋</span><strong>Vaga livre</strong><small>Selecionar herói</small></button>';
  const gate=i===1?1:i===2?3:i===3?6:10;
  return '<div class="heroCard lockedSlot"><span class="emptyGlyph">🔒</span><strong>Vaga bloqueada</strong><small>Após a horda '+String(gate).padStart(2,'0')+'</small></div>';
 });
 root.innerHTML=cards.join('');
 root.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{selectedSlot=Number(b.dataset.slot);renderPartyUI();$('slotPrompt').textContent='Escolha um aliado da sua coleção para substituir o espaço '+(selectedSlot+1)+'.';}));
 root.querySelectorAll('[data-empty-slot]').forEach(b=>b.addEventListener('click',()=>{selectedSlot=Number(b.dataset.emptySlot);const reserve=ownedHeroIds.some(id=>!partyIds.includes(id));if(reserve){renderRoster();$('rosterOverlay').classList.add('open');}else if(tavernUnlocked){$('tavernOverlay').classList.add('open');renderTavern();showToast('Vaga livre','Recrute um herói na Taverna para preencher esta vaga.');}else showToast('Vaga livre','Conclua a primeira horda para desbloquear a Taverna.');}));
}
function renderRoster(){
 $('rosterGrid').innerHTML=ownedHeroIds.map(id=>{
  const h=heroRoster.find(x=>x.id===id);if(!h)return '';
  const inTeam=partyIds.includes(h.id);
  return '<button class="rosterPick '+h.rarity.toLowerCase()+'" data-hero="'+h.id+'" '+(inTeam?'disabled':'')+'><span class="rarityTag">'+h.rarity+'</span><span class="emoji">'+h.emoji+'</span><strong>'+h.name+'</strong><small class="'+h.troop+'">'+troop[h.troop].name+'</small><div class="role">'+h.role+' · '+h.style+'</div><div class="role">'+(inTeam?'Já está na expedição':selectedSlot<partyIds.length?'Trocar espaço '+(selectedSlot+1):'Adicionar à expedição')+'</div></button>';
 }).join('');
 $('rosterGrid').querySelectorAll('[data-hero]').forEach(b=>b.addEventListener('click',()=>replaceHero(b.dataset.hero)));
}
function replaceHero(id){
 if(running){showToast('Pause a batalha','Pause antes de reorganizar a equipe.');return;}
 if(!ownedHeroIds.includes(id)||partyIds.includes(id))return;
 if(selectedSlot<partyIds.length)partyIds[selectedSlot]=id;
 else if(selectedSlot===partyIds.length&&partyIds.length<unlockedSlots)partyIds.push(id);
 else{showToast('Vaga indisponível','Desbloqueie uma vaga ou selecione um espaço livre.');return;}
 $('rosterOverlay').classList.remove('open');
 resetPartyWorld();updateHud();updateComposition();updatePowerNote();updateMissionCopy();saveGame();showToast('Expedição atualizada',heroRoster.find(h=>h.id===id).name+' entrou na equipe.');renderRoster();
}
function itemStatText(item){
 const a=[];if(item.attackPct)a.push('+'+Math.round(item.attackPct*100)+'% ataque');if(item.hpPct)a.push('+'+Math.round(item.hpPct*100)+'% vida');if(item.armor)a.push('+'+item.armor+' armadura');return a.length?a.join(' · '):'Sem atributos adicionais';
}
function equippedOwner(itemId){
 for(const id of Object.keys(equipment)){for(const slot of Object.keys(equipment[id]||{})){if(equipment[id][slot]===itemId)return id;}}
 return null;
}
function equipItem(itemId){
 if(running){showToast('Pause a batalha','Pause antes de trocar equipamentos.');return;}
 const item=items.find(it=>it.id===itemId);if(!item||!item.slot)return;
 const id=partyIds[selectedSlot];for(const owner of Object.keys(equipment)){for(const slot of Object.keys(equipment[owner]||{})){if(equipment[owner][slot]===item.id)delete equipment[owner][slot];}}
 if(!equipment[id])equipment[id]={};equipment[id][item.slot]=item.id;
 resetPartyWorld();updateHud();saveGame();renderInventory();showToast('Build atualizada',item.name+' equipado em '+heroRoster.find(h=>h.id===id).name+'.');
}
function renderInventory(){
 if(selectedSlot>=partyIds.length)selectedSlot=Math.max(0,partyIds.length-1);
 const id=partyIds[selectedSlot],hero=heroRoster.find(h=>h.id===id);if(!hero)return;
 $('inventoryTargetTitle').textContent='Equipando: '+hero.name+' · '+hero.role+' · nível '+progressFor(id).level;
 $('inventoryTargets').innerHTML=partyIds.map((pid,i)=>{const h=heroRoster.find(x=>x.id===pid);return '<button class="'+(i===selectedSlot?'active':'')+'" data-target="'+i+'">'+h.emoji+' '+h.name+'</button>';}).join('');
 $('inventoryTargets').querySelectorAll('[data-target]').forEach(b=>b.addEventListener('click',()=>{selectedSlot=Number(b.dataset.target);renderPartyUI();renderInventory();}));
 const eq=equipment[id]||{};
 $('equippedGrid').innerHTML=['weapon','armor','relic'].map(slot=>{const item=items.find(it=>it.id===eq[slot]);const color=item?({Comum:'#a0a99d',Incomum:'#66d2a0',Raro:'#80baff',Épico:'#c1a0ff',Lendário:'#ffcf75'}[item.rarity]||'#a0a99d'):'#718075';return '<div class="equippedSlot"><label>'+slotNames[slot]+'</label><strong style="color:'+color+'">'+(item?item.name:'Espaço vazio')+'</strong><p>'+(item?itemStatText(item)+(item.setName?' · '+item.setName:''):'Encontre equipamento ao derrotar monstros.')+'</p></div>';}).join('');
 const set=getGearBonus(id),lines=[];
 [['veilguard','Vigia do Véu','2 peças: +8% vida · 3 peças: +10% ataque'],['hunt','Caçador da Bruma','2 peças: +8% ataque'],['ash','Fornalha Antiga','2 peças: +10% vida']].forEach(x=>{if(set.sets[x[0]])lines.push(x[1]+': '+set.sets[x[0]]+'/3 · '+x[2]);});
 $('inventorySetBonus').textContent=lines.length?lines.join(' | '):'Bônus de conjunto: equipe peças com o mesmo nome no mesmo herói para ativar efeitos adicionais.';
 const colors={Comum:'#a0a99d',Incomum:'#66d2a0',Raro:'#80baff',Épico:'#c1a0ff',Lendário:'#ffcf75'};
 const sorted=[...items].sort((a,b)=>(b.foundAt||0)-(a.foundAt||0));
 $('inventoryEmpty').hidden=sorted.length>0;
 $('inventoryGrid').innerHTML=sorted.map(item=>{
  const ownerId=equippedOwner(item.id),owner=ownerId?heroRoster.find(h=>h.id===ownerId):null,isHere=eq[item.slot]===item.id,color=colors[item.rarity]||'#a0a99d';
  return '<article class="itemCard" style="border-left-color:'+color+'"><div class="itemMeta"><span class="itemRarity" style="color:'+color+'">'+item.rarity+'</span><span class="itemSlot">'+slotNames[item.slot]+'</span></div><strong>'+item.name+'</strong><p>'+itemStatText(item)+'</p><small>'+(item.setName?'Conjunto: '+item.setName:'Item independente')+'</small><small>'+(isHere?'Equipado em '+hero.name:owner?'Equipado em '+owner.name:'Na bolsa')+'</small><button data-equip="'+item.id+'" '+(isHere||running?'disabled':'')+'>'+(isHere?'✓ Equipado aqui':owner?'Mover para '+hero.name:'Equipar em '+hero.name)+'</button></article>';
 }).join('');
 $('inventoryGrid').querySelectorAll('[data-equip]').forEach(b=>b.addEventListener('click',()=>equipItem(b.dataset.equip)));
}
function showToast(title,message){
 $('toastTitle').textContent=title;$('toastText').textContent=message;$('centerToast').classList.add('show');lastToast=3.3;lastToastMsg=title;
}
function updateMissionCopy(){
 const title=$('missionTitle'),eyebrow=$('missionEyebrow'),copy=$('missionCopy'),objective=$('objectiveText');
 if(!tavernUnlocked){eyebrow.textContent='CAPÍTULO 01 · A ÚLTIMA CHAMA';title.textContent='Bram, o último guardião';copy.textContent='Você começa sozinho. Derrote a primeira criatura para encontrar as cartas que vão abrir o caminho até a Taverna.';objective.textContent='OBJETIVO · DERROTE A PRIMEIRA CRIATURA E RECOLHA AS CARTAS';}
 else if(ownedHeroIds.length<2){eyebrow.textContent='CAPÍTULO 01 · NOVOS ALIADOS';title.textContent='A Taverna da Fronteira';copy.textContent='A primeira horda caiu. Recolha cinco cartas de recrutamento e traga seu primeiro aliado para a expedição.';objective.textContent=recruitCards<5?'OBJETIVO · RECOLHA '+(5-recruitCards)+' CARTA(S) PARA RECRUTAR':'OBJETIVO · RECRUTE SEU PRIMEIRO ALIADO NA TAVERNA';}
 else if(partyIds.length<unlockedSlots){eyebrow.textContent='CAPÍTULO 01 · REUNINDO A EXPEDIÇÃO';title.textContent='Uma equipe toma forma';copy.textContent='Você já tem novos aliados. Preencha as vagas livres e avance para abrir mais posições na formação.';objective.textContent='OBJETIVO · PREENCHA AS VAGAS DISPONÍVEIS OU AVANCE PARA A PRÓXIMA HORDA';}
 else{eyebrow.textContent='ATO I · FRONTEIRA VELADA';title.textContent=wave<4?'Floresta dos Ecos':wave<8?'Ruínas do Véu':'Portão das Cinzas';copy.textContent='Derrote hordas, encontre cartas, recrute heróis e forme uma equipe que aproveite as sinergias de tropa.';objective.textContent='OBJETIVO · AVANCE PELAS HORDAS PARA DESBLOQUEAR NOVAS VAGAS';}
}
function updateTavernButton(){
 $('tavernButton').hidden=!tavernUnlocked;$('rosterButton').hidden=!tavernUnlocked;$('inventoryButton').hidden=!inventoryUnlocked;
 $('recruitCardBadge').textContent=String(recruitCards);
}
function renderTavern(){
 if(!$('tavernOverlay'))return;
 $('tavernCardsValue').textContent=recruitCards+' / 5';
 $('recruitButton').disabled=!tavernUnlocked||recruitCards<5||ownedHeroIds.length>=heroRoster.length;
 $('recruitStatus').textContent=ownedHeroIds.length>=heroRoster.length?'Coleção completa.':recruitCards<5?'Faltam '+(5-recruitCards)+' cartas para um recrutamento.':'Você tem cartas suficientes para recrutar.';
 $('collectionCount').textContent=ownedHeroIds.length+' / '+heroRoster.length+' heróis';
 $('pityText').textContent='Garantia SSR em '+Math.max(0,10-recruitSinceSSR)+' recrutamento(s) · garantia UR em '+Math.max(0,30-recruitSinceUR)+' recrutamento(s).';
 $('tavernCollection').innerHTML=heroRoster.map(h=>{const owned=ownedHeroIds.includes(h.id);return '<div class="codexHero '+h.rarity.toLowerCase()+' '+(owned?'owned':'unknown')+'"><span class="codexTier">'+h.rarity+'</span><span class="codexIcon">'+(owned?h.emoji:'?')+'</span><strong>'+(owned?h.name:'Herói desconhecido')+'</strong><small>'+troop[h.troop].name+'</small></div>';}).join('');
}
function pullRecruit(){
 if(!tavernUnlocked||recruitCards<5||ownedHeroIds.length>=heroRoster.length)return;
 recruitCards-=5;recruitCount++;
 const roll=Math.random();let rarity;
 if(recruitSinceUR>=29)rarity='UR';
 else if(recruitSinceSSR>=9)rarity='SSR';
 else rarity=roll<.02?'UR':roll<.22?'SSR':'SR';
 let candidates=heroRoster.filter(h=>h.rarity===rarity&&!ownedHeroIds.includes(h.id));
 if(!candidates.length){candidates=heroRoster.filter(h=>!ownedHeroIds.includes(h.id));rarity=candidates[0]?.rarity||rarity;}
 const hero=candidates[Math.floor(Math.random()*candidates.length)];if(!hero){updateHud();renderTavern();return;}
 ownedHeroIds.push(hero.id);
 if(rarity==='UR'){recruitSinceUR=0;recruitSinceSSR=0;}else{recruitSinceUR++;if(rarity==='SSR')recruitSinceSSR=0;else recruitSinceSSR++;}
 const joined=!running&&partyIds.length<unlockedSlots;
 if(joined){partyIds.push(hero.id);resetPartyWorld();}
 if(cleared&&ownedHeroIds.length>=2)$('nextWaveButton').disabled=false;
 $('recruitReveal').innerHTML='<div class="revealCard '+hero.rarity.toLowerCase()+'"><div class="revealKicker">NOVO HERÓI RECRUTADO</div><div class="revealRarity">'+hero.rarity+'</div><div class="revealEmoji">'+hero.emoji+'</div><h3>'+hero.name+'</h3><p>'+hero.title+'</p><div class="revealMeta">'+troop[hero.troop].name+' · '+hero.role+'</div><div class="revealPower">'+(hero.rarity==='UR'?'POTENCIAL MÍTICO':hero.rarity==='SSR'?'POTENCIAL ÉPICO':'POTENCIAL DE ELITE')+'</div></div>';
 $('recruitButton').textContent='Recrutar outro · 5 cartas';
 renderTavern();renderRoster();updateHud();updateComposition();updateMissionCopy();updatePowerNote();saveGame();
 showToast('Novo herói recrutado',hero.name+' · '+hero.rarity+(joined?' entrou na expedição.':running?' ficará na reserva até a próxima horda.':' foi adicionado à coleção.'));
}
function onCanvasClick(e){
 const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
 let pick=null,best=Infinity;
 for(const l of loot){const d=Math.hypot(x-l.x,y-l.y);if(d<28&&d<best){best=d;pick=l;}}
 if(pick)pickLoot(pick,false);
}
function updateLoot(dt){
 for(let i=loot.length-1;i>=0;i--){const l=loot[i];if(elapsed-l.created>8)pickLoot(l,true);}
}
function wireUI(){
 $('tavernButton').addEventListener('click',()=>{renderTavern();$('tavernOverlay').classList.add('open');});
 $('closeTavern').addEventListener('click',()=>$('tavernOverlay').classList.remove('open'));
 $('tavernOverlay').addEventListener('click',e=>{if(e.target===$('tavernOverlay'))$('tavernOverlay').classList.remove('open');});
 $('recruitButton').addEventListener('click',pullRecruit);
 $('pauseButton').addEventListener('click',()=>{
  if(defeated){spawnWave(true);return;}
  if(running){running=false;$('pauseButton').textContent='▶ Retomar';$('combatStatus').textContent='Combate pausado';$('combatMessage').textContent='Equipe em pausa. Troque heróis ou equipe itens.';$('waveLabel').textContent='HORDA '+String(wave).padStart(2,'0')+' · PAUSADA';$('statusDot').style.background='var(--gold)';}
  else if(cleared){spawnWave(false);}
  else{running=true;$('pauseButton').textContent='Ⅱ Pausar';$('combatStatus').textContent='Batalha automática';$('statusDot').style.background='var(--mint)';}
 });
 $('nextWaveButton').addEventListener('click',()=>{if(cleared&&!defeated)spawnWave(false);});
 $('rosterButton').addEventListener('click',()=>{if(running){showToast('Pause a batalha','Pause para trocar os heróis.');return;}if(selectedSlot>partyIds.length-1)selectedSlot=Math.max(0,partyIds.length-1);renderRoster();$('slotPrompt').textContent=selectedSlot<partyIds.length?'Escolha um herói da coleção para substituir o espaço '+(selectedSlot+1)+'.':'Escolha um herói da coleção para preencher a vaga livre.';$('rosterOverlay').classList.add('open');});
 $('closeRoster').addEventListener('click',()=>$('rosterOverlay').classList.remove('open'));
 $('rosterOverlay').addEventListener('click',e=>{if(e.target===$('rosterOverlay'))$('rosterOverlay').classList.remove('open');});
 $('inventoryButton').addEventListener('click',()=>{if(running){showToast('Pause a batalha','Pause para comparar e equipar itens.');return;}if(!inventoryUnlocked)return;renderInventory();$('inventoryOverlay').classList.add('open');});
 $('closeInventory').addEventListener('click',()=>$('inventoryOverlay').classList.remove('open'));
 $('inventoryOverlay').addEventListener('click',e=>{if(e.target===$('inventoryOverlay'))$('inventoryOverlay').classList.remove('open');});
 canvas.addEventListener('click',onCanvasClick);
 window.addEventListener('resize',resize);window.addEventListener('beforeunload',saveGame);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)saveGame();});
}
function updateDOM(dt){
 uiTimer+=dt;if(uiTimer<.18)return;uiTimer=0;
 renderPartyHealth();
}
function renderPartyHealth(){
 const root=$('partyCards');root.querySelectorAll('[data-slot]').forEach(b=>{
  const i=Number(b.dataset.slot),u=heroes[i];if(!u)return;
  const fill=b.querySelector('.healthFill'),hp=b.querySelector('.cardStats span:last-child');
  if(fill)fill.style.width=clamp(u.hp/u.maxHp,0,1)*100+'%';if(hp)hp.textContent=Math.max(0,Math.ceil(u.hp))+' HP';
 });
}
function animate(now){
 requestAnimationFrame(animate);
 if(!now)now=performance.now();
 if(now-lastFrame<1000/30)return;
 const dt=Math.min(.04,(now-lastFrame)/1000||.033);lastFrame=now;elapsed+=dt;
 if(running){worldScroll+=16*dt;updateUnits(dt,elapsed);}
 effects.forEach(()=>{});
 updateLoot(dt);drawScene(elapsed,dt);updateDOM(dt);
 saveTimer+=dt;if(saveTimer>12){saveTimer=0;saveGame();}
 if(lastToast>0){lastToast-=dt;if(lastToast<=0)$('centerToast').classList.remove('show');}
}
function startGame(){
 if(!ctx){$('bootError').classList.add('visible');$('bootErrorText').textContent='Este navegador não conseguiu criar um canvas 2D.';return;}
 loadGame();resize();resetPartyWorld();updateHud();updateComposition();updatePowerNote();renderPartyUI();updateMissionCopy();renderTavern();wireUI();
 if(offlineEarned>0){$('offlineValue').textContent='+'+fmt(offlineEarned)+' ouro · '+offlineGearEarned+' itens';showToast('Você voltou à fronteira','+'+fmt(offlineEarned)+' ouro · '+fmt(offlineXpEarned)+' XP por herói · '+offlineGearEarned+' item(ns).');}
 else $('offlineValue').textContent='Ativo';
 if(offlineEarned>0)saveGame();
 requestAnimationFrame(animate);
 setTimeout(()=>{
  if(!running&&!enemies.length)spawnWave();
  if(!tutorialSeen){showToast('Sua jornada começou','Bram está sozinho. Derrote a primeira criatura e recolha as cartas que ela deixar.');tutorialSeen=true;saveGame();}
 },450);
}
