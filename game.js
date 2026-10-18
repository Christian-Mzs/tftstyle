import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = id => document.getElementById(id);
const troop = {
  tank: { name: 'Tanques', short: 'TANQUES', color: 0x77aee8, css: 'tank', emoji: '🛡' },
  air: { name: 'Aeronaves', short: 'AERONAVES', color: 0xb59be9, css: 'air', emoji: '🪽' },
  missile: { name: 'Mísseis', short: 'MÍSSEIS', color: 0xe4a96e, css: 'missile', emoji: '✦' }
};
const beats = { tank: 'missile', missile: 'air', air: 'tank' };
const heroRoster = [
 {id:'bram',name:'Bram',title:'Sentinela de Ferro',emoji:'🛡️',troop:'tank',role:'Guardião',style:'melee',hp:260,damage:20,rate:1.35,range:1.65,speed:2.25,armor:7},
 {id:'helga',name:'Helga',title:'Quebra-escudos',emoji:'⚒️',troop:'tank',role:'Atacante',style:'melee',hp:175,damage:34,rate:1.25,range:1.75,speed:2.35,armor:3},
 {id:'orwen',name:'Orwen',title:'Porta-estandarte',emoji:'🔰',troop:'tank',role:'Suporte',style:'support',hp:190,damage:9,rate:2.5,range:5,speed:1.9,armor:4},
 {id:'dorn',name:'Dorn',title:'Muralha Rúnica',emoji:'🪨',troop:'tank',role:'Especialista',style:'melee',hp:245,damage:16,rate:1.55,range:1.6,speed:1.85,armor:10},
 {id:'maela',name:'Maela',title:'Médica de Campanha',emoji:'🌿',troop:'tank',role:'Suporte',style:'support',hp:165,damage:12,rate:2.6,range:5.4,speed:1.95,armor:2},
 {id:'lyra',name:'Lyra',title:'Olho do Crepúsculo',emoji:'🏹',troop:'air',role:'Atiradora',style:'ranged',hp:142,damage:25,rate:1.05,range:5.8,speed:2.8,armor:1},
 {id:'kael',name:'Kael',title:'Lâmina Alada',emoji:'🪽',troop:'air',role:'Guardião',style:'melee',hp:185,damage:22,rate:1.1,range:1.6,speed:3.2,armor:3},
 {id:'suri',name:'Suri',title:'Harmonista',emoji:'🎶',troop:'air',role:'Suporte',style:'support',hp:150,damage:12,rate:2.4,range:5.5,speed:2.7,armor:1},
 {id:'vex',name:'Vex',title:'Dançarino Sombrio',emoji:'🗡️',troop:'air',role:'Especialista',style:'melee',hp:155,damage:29,rate:0.95,range:1.55,speed:3.05,armor:1},
 {id:'aerin',name:'Aerin',title:'Falcão Cinzento',emoji:'🦅',troop:'air',role:'Atacante',style:'ranged',hp:135,damage:22,rate:0.85,range:5.4,speed:2.85,armor:1},
 {id:'nyx',name:'Nyx',title:'Oráculo de Cinzas',emoji:'🔮',troop:'missile',role:'Arcanista',style:'ranged',hp:150,damage:33,rate:1.55,range:5.7,speed:2.0,armor:1,aoe:true},
 {id:'torq',name:'Torq',title:'Artífice do Cerco',emoji:'💣',troop:'missile',role:'Guardião',style:'melee',hp:205,damage:20,rate:1.4,range:1.8,speed:1.9,armor:5},
 {id:'elion',name:'Elion',title:'Condutor de Éter',emoji:'✨',troop:'missile',role:'Suporte',style:'support',hp:160,damage:10,rate:2.4,range:5.5,speed:2.0,armor:2},
 {id:'mira',name:'Mira',title:'Tecelã de Ruína',emoji:'☄️',troop:'missile',role:'Especialista',style:'ranged',hp:145,damage:24,rate:1.2,range:5.5,speed:2.0,armor:1},
 {id:'zara',name:'Zara',title:'Lança-tempestades',emoji:'⚡',troop:'missile',role:'Atacante',style:'ranged',hp:140,damage:30,rate:1.35,range:5.5,speed:2.15,armor:1}
];
const enemyTypes = [
 {name:'Cão-de-brasa',troop:'air',role:'assaltante',hp:92,damage:13,speed:2.45,range:1.3,rate:1.25,color:0xb85c44,kind:'hound'},
 {name:'Brutamonte de musgo',troop:'tank',role:'bruto',hp:195,damage:17,speed:1.35,range:1.6,rate:1.7,color:0x5f8065,kind:'brute'},
 {name:'Acólito carbonizado',troop:'missile',role:'conjurador',hp:100,damage:19,speed:1.15,range:4.5,rate:1.8,color:0x835f9e,kind:'caster'},
 {name:'Batedor corrompido',troop:'air',role:'assaltante',hp:105,damage:15,speed:2.2,range:1.4,rate:1.15,color:0x9f6d49,kind:'scout'},
 {name:'Cavaleiro vazio',troop:'tank',role:'guardião',hp:225,damage:21,speed:1.4,range:1.7,rate:1.55,color:0x657c8c,kind:'knight'}
];
const initialParty = ['bram','helga','orwen','lyra','aerin'];
const STORE_KEY = 'frontier-heroes-save-v1';
let gold = 1250, wave = 1, selectedSlot = 0, partyIds = [...initialParty], items = [], tacticalCard = false;
let equipment = {}, heroProgress = {}, nextItemId = 1, firstGearCollected = false, tutorialSeen = false;
let running = false, cleared = false, lastToast = 0, elapsed = 0, offlineEarned = 0, offlineXpEarned = 0;
let heroes = [], enemies = [], projectiles = [], effects = [], loot = [], allUnits = [];
let clock = new THREE.Clock();
const unitPositions = [[-4.4,-1.55],[-3.4,0.2],[-5.6,0.05],[-4.5,1.65],[-6.0,-2.05]];
let scene, camera, renderer, controls, worldRoot, lootTargets = [], lastSave = 0, sceneReady = false;

function fmt(n){return Math.floor(n).toLocaleString('pt-BR');}
function compInfo(){
  const count={tank:0,air:0,missile:0};
  partyIds.forEach(id=>{const h=heroRoster.find(x=>x.id===id);if(h)count[h.troop]++;});
  const values=Object.values(count).sort((a,b)=>b-a);let bonus=0,label='Sem bônus',short='';
  if(values[0]===5){bonus=20;label='5 do mesmo tipo';short='formação pura';}
  else if(values[0]===4){bonus=tacticalCard?20:15;label=tacticalCard?'4 + 1 · Carta Tática':'4 do mesmo tipo';short=tacticalCard?'carta equipada':'formação especializada';}
  else if(values[0]===3){bonus=values[1]===2?10:5;label=values[1]===2?'3 + 2':'3 do mesmo tipo';short=values[1]===2?'formação mista':'especialização parcial';}
  return {count,bonus,label,short};
}
function progressFor(id){
  if(!heroProgress[id]||typeof heroProgress[id]!=='object')heroProgress[id]={level:1,xp:0};
  heroProgress[id].level=Math.max(1,Math.floor(heroProgress[id].level||1));
  heroProgress[id].xp=Math.max(0,Math.floor(heroProgress[id].xp||0));
  return heroProgress[id];
}
function xpNeeded(level){return 70+(Math.max(1,level)-1)*35;}
function grantHeroXp(id,amount){
  const p=progressFor(id);p.xp+=Math.max(0,Math.floor(amount));let levels=0;
  while(p.xp>=xpNeeded(p.level)){p.xp-=xpNeeded(p.level);p.level++;levels++;}
  return levels;
}
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
function makeItem(){
  const eligible=wave<3?gearPool.filter(x=>x.setId==='veilguard'||x.setId===null):gearPool;
  const base=eligible[Math.floor(Math.random()*eligible.length)];
  const item={...base,id:'item-'+(nextItemId++),foundAt:Date.now()};
  // Small rolls keep two items of the same family from being identical.
  item.attackPct=Math.max(0,(item.attackPct||0)+(Math.random()*.02));
  item.hpPct=Math.max(0,(item.hpPct||0)+(Math.random()*.02));
  return item;
}
function getEquippedItems(heroId){
  const slots=equipment[heroId]||{};
  return Object.keys(slots).map(slot=>items.find(it=>it.id===slots[slot])).filter(Boolean);
}
function getGearBonus(heroId){
  const gear=getEquippedItems(heroId);
  let attackPct=0,hpPct=0,armor=0;const sets={};
  gear.forEach(it=>{
    attackPct+=it.attackPct||0;hpPct+=it.hpPct||0;armor+=it.armor||0;
    if(it.setId)sets[it.setId]=(sets[it.setId]||0)+1;
  });
  if((sets.veilguard||0)>=2)hpPct+=.08;
  if((sets.veilguard||0)>=3)attackPct+=.10;
  if((sets.hunt||0)>=2)attackPct+=.08;
  if((sets.ash||0)>=2)hpPct+=.10;
  return {attackPct,hpPct,armor,sets,gear};
}
function heroDataAtLevel(id){
  const base=heroRoster.find(h=>h.id===id);
  if(!base)return null;
  const p=progressFor(id),gear=getGearBonus(id),n=p.level-1;
  return {...base,level:p.level,hp:Math.round(base.hp*(1+n*.06)*(1+gear.hpPct)),damage:Math.round(base.damage*(1+n*.045)*(1+gear.attackPct)),armor:base.armor+Math.floor(n*.25)+gear.armor};
}
function refreshHeroWorldStats(){
  heroes.forEach(unit=>{
    const currentRatio=unit.maxHp>0?unit.hp/unit.maxHp:1;
    const newData=heroDataAtLevel(unit.data.id);if(!newData)return;
    unit.data=newData;unit.maxHp=newData.hp;
    unit.hp=Math.max(1,Math.min(newData.hp,newData.hp*currentRatio));
    unit.bar.max=newData.hp;setHealthBar(unit);
  });
  renderPartyUI();updatePowerNote();
}
function saveGame(){
  try{localStorage.setItem(STORE_KEY,JSON.stringify({gold,wave,partyIds,items,equipment,heroProgress,tacticalCard,nextItemId,firstGearCollected,tutorialSeen,savedAt:Date.now()}));}catch(e){}
}
function loadGame(){
  try{
    const s=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    if(!s)return;
    if(Number.isFinite(s.gold))gold=Math.max(0,s.gold);
    if(Number.isFinite(s.wave))wave=Math.max(1,s.wave);
    if(Array.isArray(s.partyIds)&&s.partyIds.length===5&&s.partyIds.every(id=>heroRoster.some(h=>h.id===id))&&new Set(s.partyIds).size===5)partyIds=[...s.partyIds];
    if(Array.isArray(s.items))items=s.items.filter(it=>it&&it.id&&it.slot).slice(-60);
    if(s.equipment&&typeof s.equipment==='object')equipment=s.equipment;
    if(s.heroProgress&&typeof s.heroProgress==='object')heroProgress=s.heroProgress;
    tacticalCard=!!s.tacticalCard;firstGearCollected=!!s.firstGearCollected;tutorialSeen=!!s.tutorialSeen;
    nextItemId=Math.max(1,Number(s.nextItemId)||1,items.reduce((max,it)=>Math.max(max,Number(String(it.id).replace('item-',''))+1||1),1));
    const mins=Math.min(720,Math.max(0,(Date.now()-(s.savedAt||Date.now()))/60000));
    if(mins>=2){
      offlineEarned=Math.floor(mins*(26+Math.min(20,wave*1.5)));
      gold+=offlineEarned;
      offlineXpEarned=Math.floor(mins*1.35);
      partyIds.forEach(id=>grantHeroXp(id,offlineXpEarned));
    }
  }catch(e){}
}
function mat(color,roughness=.7,metalness=.05,extra={}){return new THREE.MeshStandardMaterial({color,roughness,metalness,...extra});}
function mesh(geo,material,parent,pos,scale){
  const m=new THREE.Mesh(geo,material);if(pos)m.position.set(pos[0],pos[1],pos[2]);if(scale)m.scale.set(scale[0],scale[1],scale[2]);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function pointLight(color,intensity,distance,parent,pos){const l=new THREE.PointLight(color,intensity,distance,2);l.position.set(...pos);parent.add(l);return l;}
function groundDisc(radius,color,y,opacity=1){
  const m=mesh(new THREE.CircleGeometry(radius,72),new THREE.MeshStandardMaterial({color,roughness:.88,transparent:opacity<1,opacity,side:THREE.DoubleSide}),worldRoot,[0,y,0]);
  m.rotation.x=-Math.PI/2;return m;
}
function buildEnvironment(){
  worldRoot=new THREE.Group();scene.add(worldRoot);
  const ground=mesh(new THREE.PlaneGeometry(38,30),mat(0x1a2e26,.98),worldRoot,[0,-.22,0]);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;
  // The combat clearing: weathered stone with concentric rune rings.
  groundDisc(8.6,0x26372c,-.11,1);
  groundDisc(7.85,0x344137,-.095,1);
  groundDisc(7.25,0x293932,-.075,1);
  for(let r=2.35;r<=7;r+=1.15){
    const ring=mesh(new THREE.TorusGeometry(r,.018,4,96),mat(r>6.5?0x8b7950:0x64775d,.75,.2,{emissive:r>6.5?0x292012:0x0c1c11,emissiveIntensity:.55}),worldRoot,[0,-.045,0]);
    ring.rotation.x=Math.PI/2;
  }
  for(let i=0;i<28;i++){
    const a=i*Math.PI*2/28,r=7.05;
    const rune=mesh(new THREE.BoxGeometry(.16,.025,.47),mat(i%2?0x61765c:0x9b8a59,.7,.15),worldRoot,[Math.cos(a)*r,-.035,Math.sin(a)*r]);
    rune.rotation.y=-a;
  }
  // Rubble in a loose ring around the arena.
  const stoneMat=[mat(0x586254),mat(0x3d4d43),mat(0x6b6c57)];
  for(let i=0;i<35;i++){
    const a=i*2.399, r=7.9+(i%4)*.42, x=Math.cos(a)*r, z=Math.sin(a)*r;
    const s=.16+(i%5)*.055;
    const rock=mesh(new THREE.DodecahedronGeometry(1,0),stoneMat[i%stoneMat.length],worldRoot,[x,s*.55,z],[s*1.35,s*.75,s]);
    rock.rotation.set(a*.45,a,a*.3);
  }
  // Broken monoliths and low-poly pines frame the battlefield.
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4+.12, r=9.7, x=Math.cos(a)*r,z=Math.sin(a)*r;
    const h=1.1+(i%3)*.5;
    const p=mesh(new THREE.CylinderGeometry(.22,.33,h,6),mat(0x4a594c,.92),worldRoot,[x,h/2-.1,z]);
    p.rotation.z=(i%2?.12:-.1);p.rotation.x=(i%3-.8)*.08;
    mesh(new THREE.BoxGeometry(.62,.12,.62),mat(0x7d795c),worldRoot,[x,h-.08,z]);
    mesh(new THREE.TorusGeometry(.43,.035,5,32),mat(0x9a8655,.6,.3,{emissive:0x2a1d0b}),worldRoot,[x,.04,z]).rotation.x=Math.PI/2;
  }
  const pineMat=[mat(0x243f30),mat(0x294735),mat(0x34503a)];
  for(let i=0;i<82;i++){
    const a=i*2.399963, r=9.5+(i%9)*.62, x=Math.cos(a)*r,z=Math.sin(a)*r*.78;
    const s=.65+(i%5)*.1, trunkH=1.1*s;
    mesh(new THREE.CylinderGeometry(.09*s,.17*s,trunkH,5),mat(0x594737),worldRoot,[x,trunkH/2-.1,z]);
    for(let layer=0;layer<3;layer++){
      const h=(1.2-layer*.17)*s,rad=(.75-layer*.12)*s;
      mesh(new THREE.ConeGeometry(rad,h,6),pineMat[(i+layer)%pineMat.length],worldRoot,[x,(.66+layer*.49)*s,z]);
    }
    if(i%5===0){const crystal=mesh(new THREE.OctahedronGeometry(.16*s),mat(i%10?0x739f86:0xd4a868,.3,.2,{emissive:i%10?0x193e2b:0x563512,emissiveIntensity:1.5}),worldRoot,[x,.75*s,z]);crystal.rotation.y=a;}
  }
  // Small moss patches, grass blades and amber mushrooms.
  const grassMats=[mat(0x436244),mat(0x344f3e),mat(0x65714a)];
  for(let i=0;i<170;i++){
    const x=(Math.random()-.5)*31,z=(Math.random()-.5)*24,r=Math.hypot(x,z);
    if(r<8.2)continue;
    const h=.12+Math.random()*.26;
    const blade=mesh(new THREE.ConeGeometry(.055,h,3),grassMats[i%3],worldRoot,[x,h/2-.17,z]);
    blade.rotation.z=(Math.random()-.5)*.7;blade.rotation.x=(Math.random()-.5)*.7;
  }
  for(let i=0;i<16;i++){
    const a=i*2.1,r=8.3+(i%4)*.4,x=Math.cos(a)*r,z=Math.sin(a)*r;
    mesh(new THREE.CylinderGeometry(.055,.075,.25,5),mat(0xc5ad75),worldRoot,[x,-.02,z]);
    const cap=mesh(new THREE.SphereGeometry(.16,7,5),mat(0xc77851,.55,.0,{emissive:0x30100a}),worldRoot,[x,.13,z],[1,.53,1]);
    pointLight(0xe0a05f,.14,1.5,worldRoot,[x,.27,z]);
  }
  // Floating fireflies around the runes.
  const motes=[];
  for(let i=0;i<45;i++){
    const g=new THREE.Group();g.position.set((Math.random()-.5)*20,.4+Math.random()*3,(Math.random()-.5)*15);
    const m=mesh(new THREE.SphereGeometry(.035+Math.random()*.022,6,5),mat(i%3?0xc2dba2:0xffd38a,.3,0,{emissive:i%3?0x597d31:0x996023,emissiveIntensity:2}),g,[0,0,0]);
    const light=pointLight(i%3?0x98d88b:0xffcb76,.23,1.6,g,[0,0,0]);
    worldRoot.add(g);motes.push({g,baseY:g.position.y,phase:Math.random()*Math.PI*2});
  }
  return motes;
}

function addEyes(parent,skinMat){
  const dark=mat(0x172018,.4),glint=mat(0xf2dcb1,.3,0,{emissive:0x72552d,emissiveIntensity:.3});
  mesh(new THREE.SphereGeometry(.035,7,5),dark,parent,[-.095,1.56,.218]);
  mesh(new THREE.SphereGeometry(.035,7,5),dark,parent,[.095,1.56,.218]);
  mesh(new THREE.SphereGeometry(.012,5,4),glint,parent,[-.096,1.565,.248]);
  mesh(new THREE.SphereGeometry(.012,5,4),glint,parent,[.094,1.565,.248]);
}
function makeHeroModel(data){
  const root=new THREE.Group(),visual=new THREE.Group();root.add(visual);
  const troopColor=troop[data.troop].color, primary=mat(troopColor,.5,.22), dark=mat(0x28332c,.82,.08), trim=mat(0xd2b476,.38,.48), skin=mat(data.troop==='missile'?0xb1a1c1:data.troop==='air'?0xd1ac82:0xb9b39a,.85);
  // Small character silhouette built from faceted geometry, not UI icons.
  const cape=mesh(new THREE.ConeGeometry(.42,.88,5),dark,visual,[0,.79,-.22]);cape.rotation.x=Math.PI;
  mesh(new THREE.CapsuleGeometry(.31,.48,4,7),primary,visual,[0,.91,0],[1.05,1.05,.82]);
  mesh(new THREE.DodecahedronGeometry(.36,0),primary,visual,[0,1.03,.065],[1.1,1,.76]);
  mesh(new THREE.BoxGeometry(.28,.07,.49),trim,visual,[0,.98,.285]);
  mesh(new THREE.SphereGeometry(.225,9,7),skin,visual,[0,1.51,.02]);
  // helmet, brow, and a subtle crest vary by troop.
  const helmet=mesh(new THREE.SphereGeometry(.255,8,6,0,Math.PI*2,0,Math.PI*.57),dark,visual,[0,1.61,0]);
  helmet.scale.set(1.15,.85,1.08);
  mesh(new THREE.BoxGeometry(.37,.075,.12),trim,visual,[0,1.52,.2]);
  addEyes(visual,skin);
  const leftLeg=new THREE.Group();leftLeg.position.set(-.17,.54,0);visual.add(leftLeg);
  mesh(new THREE.CapsuleGeometry(.105,.31,3,5),dark,leftLeg,[0,-.18,0]);
  mesh(new THREE.BoxGeometry(.25,.11,.37),trim,leftLeg,[0,-.39,.08]);
  const rightLeg=new THREE.Group();rightLeg.position.set(.17,.54,0);visual.add(rightLeg);
  mesh(new THREE.CapsuleGeometry(.105,.31,3,5),dark,rightLeg,[0,-.18,0]);
  mesh(new THREE.BoxGeometry(.25,.11,.37),trim,rightLeg,[0,-.39,.08]);
  const leftArm=new THREE.Group();leftArm.position.set(-.34,1.17,0);visual.add(leftArm);
  mesh(new THREE.CapsuleGeometry(.095,.29,3,5),primary,leftArm,[0,-.06,0]);
  const rightArm=new THREE.Group();rightArm.position.set(.34,1.17,0);visual.add(rightArm);
  mesh(new THREE.CapsuleGeometry(.095,.29,3,5),primary,rightArm,[0,-.06,0]);
  // Every unit carries a distinctive piece of gear.
  if(data.style==='ranged' || data.style==='support'){
    const staff=mesh(new THREE.CylinderGeometry(.035,.055,.94,6),trim,rightArm,[.03,-.06,.28]);staff.rotation.x=.18;
    const orb=mesh(new THREE.OctahedronGeometry(data.aoe ? .19 : .12),mat(data.troop==='missile'?0xf3ae70:data.troop==='air'?0xb6a0ff:0xa1d6c2,.25,.15,{emissive:data.troop==='missile'?0x8c3b12:0x3b2c88,emissiveIntensity:1.5}),rightArm,[.03,.39,.3]);
    pointLight(data.troopColor||troopColor,.28,1.2,rightArm,[.03,.39,.3]);
    if(data.style==='ranged' && data.id!=='nyx'){
      const bow=mesh(new THREE.TorusGeometry(.31,.035,5,12,Math.PI),trim,leftArm,[-.08,.06,.23]);bow.rotation.z=Math.PI/2;
      mesh(new THREE.CylinderGeometry(.012,.012,.53,5),dark,leftArm,[-.08,.07,.23]).rotation.z=Math.PI/2;
    }
  }else{
    const handle=mesh(new THREE.CylinderGeometry(.035,.045,.55,6),mat(0x76553a),rightArm,[.05,-.02,.27]);handle.rotation.x=Math.PI/2;
    const blade=mesh(new THREE.BoxGeometry(data.troop==='tank'?.13:.09,.07,.58),trim,rightArm,[.05,.03,.56]);
    blade.rotation.x=.22;
    const tip=mesh(new THREE.ConeGeometry(.075,.2,4),primary,rightArm,[.05,.04,.91]);tip.rotation.x=Math.PI/2;
    if(data.role==='Guardião'||data.id==='bram'||data.id==='torq'){
      const shield=mesh(new THREE.DodecahedronGeometry(.3,0),trim,leftArm,[0,-.02,.25],[.8,1.15,.35]);
      mesh(new THREE.BoxGeometry(.035,.35,.025),primary,leftArm,[0,-.02,.37]);
    }
  }
  // Troop-specific shoulder glyph.
  const sigil=mesh(new THREE.OctahedronGeometry(.095),trim,visual,[0,1.12,.35]);sigil.rotation.z=.35;
  if(data.troop==='air'){
    const wingMat=mat(0xb8a6dc,.62,0);
    for(const side of [-1,1]){const wing=mesh(new THREE.ConeGeometry(.18,.64,4),wingMat,visual,[side*.48,1.21,-.17]);wing.rotation.z=side*.74;wing.rotation.x=-.28;}
  }else if(data.troop==='missile'){
    for(const side of [-1,1]){const horn=mesh(new THREE.ConeGeometry(.08,.25,5),trim,visual,[side*.17,1.82,-.015]);horn.rotation.z=side*.28;}
  }else{
    const crest=mesh(new THREE.ConeGeometry(.09,.25,5),trim,visual,[0,1.88,-.015]);crest.rotation.z=.05;
  }
  const aura=mesh(new THREE.TorusGeometry(.47,.025,5,28),mat(troopColor,.4,.1,{emissive:troopColor,emissiveIntensity:.25}),root,[0,.035,0]);aura.rotation.x=Math.PI/2;
  const bar=makeHealthBar(root,data.hp);
  return {root,visual,leftArm,rightArm,leftLeg,rightLeg,aura,bar,data,isEnemy:false,alive:true,hp:data.hp,maxHp:data.hp,cooldown:Math.random()*.5,attackAnim:0,walkPhase:Math.random()*3,home:null,deadTimer:0};
}
function makeEnemyModel(data){
  const root=new THREE.Group(),visual=new THREE.Group();root.add(visual);
  const bodyMat=mat(data.color,.83,.02), darker=mat(new THREE.Color(data.color).multiplyScalar(.53),.9), horn=mat(0xcbbd95,.65), eyes=mat(0xf37b49,.35,.0,{emissive:0x9b280b,emissiveIntensity:2});
  mesh(new THREE.CapsuleGeometry(.35,.5,4,6),bodyMat,visual,[0,.8,0],[1.15,1,.95]);
  mesh(new THREE.DodecahedronGeometry(.34,0),bodyMat,visual,[0,.94,.02],[1.12,.86,.95]);
  mesh(new THREE.SphereGeometry(.25,8,6),darker,visual,[0,1.35,.07],[1.05,.9,.95]);
  // crooked ears, horns and glowing eyes are unique to the enemy silhouette.
  for(const side of [-1,1]){
    const ear=mesh(new THREE.ConeGeometry(.105,.32,5),horn,visual,[side*.28,1.48,.02]);ear.rotation.z=side*.62;
    mesh(new THREE.SphereGeometry(.043,6,5),eyes,visual,[side*.105,1.37,.277]);
  }
  const l= new THREE.Group();l.position.set(-.32,1.08,0);visual.add(l);mesh(new THREE.CapsuleGeometry(.1,.32,3,5),darker,l,[0,-.07,0]);
  const r= new THREE.Group();r.position.set(.32,1.08,0);visual.add(r);mesh(new THREE.CapsuleGeometry(.1,.32,3,5),darker,r,[0,-.07,0]);
  const weapon=mesh(new THREE.BoxGeometry(.12,.08,.68),horn,r,[.04,.0,.38]);weapon.rotation.x=.23;
  const leg1=new THREE.Group();leg1.position.set(-.16,.48,0);visual.add(leg1);mesh(new THREE.CapsuleGeometry(.11,.3,3,5),darker,leg1,[0,-.17,0]);
  const leg2=new THREE.Group();leg2.position.set(.16,.48,0);visual.add(leg2);mesh(new THREE.CapsuleGeometry(.11,.3,3,5),darker,leg2,[0,-.17,0]);
  if(data.kind==='caster'){
    const glow=mesh(new THREE.IcosahedronGeometry(.22,0),mat(0xcb9bff,.22,.08,{emissive:0x6f2eb0,emissiveIntensity:2}),visual,[0,1.9,.12]);glow.rotation.y=.5;
    pointLight(0xa56aff,.55,2.8,visual,[0,1.9,.12]);
  }else if(data.kind==='brute'){
    mesh(new THREE.DodecahedronGeometry(.28),darker,visual,[-.36,1.08,0],[1.1,1.2,1]);
    mesh(new THREE.DodecahedronGeometry(.28),darker,visual,[.36,1.08,0],[1.1,1.2,1]);
  }else if(data.kind==='hound'){
    mesh(new THREE.ConeGeometry(.12,.28,5),horn,visual,[-.13,1.56,-.1]);mesh(new THREE.ConeGeometry(.12,.28,5),horn,visual,[.13,1.56,-.1]);
  }
  const aura=mesh(new THREE.TorusGeometry(.42,.025,5,24),mat(troop[data.troop].color,.5,.1,{emissive:troop[data.troop].color,emissiveIntensity:.15}),root,[0,.035,0]);aura.rotation.x=Math.PI/2;
  const bar=makeHealthBar(root,data.hp);
  return {root,visual,leftArm:l,rightArm:r,leftLeg:leg1,rightLeg:leg2,aura,bar,data,isEnemy:true,alive:true,hp:data.hp,maxHp:data.hp,cooldown:Math.random()*.5,attackAnim:0,walkPhase:Math.random()*3,home:null,deadTimer:0};
}
function makeHealthBar(root,maxHp){
  const g=new THREE.Group();g.position.set(0,2.27,.02);root.add(g);
  mesh(new THREE.PlaneGeometry(.92,.095),mat(0x201a18,.8),g,[0,0,0]);
  const fill=mesh(new THREE.PlaneGeometry(.86,.053),mat(0x65c58a,.6),g,[-.005,0,.012]);
  const lost=mesh(new THREE.PlaneGeometry(.86,.053),mat(0x6a302c,.8),g,[0,0,.006]);
  return {group:g,fill,lost,max:maxHp};
}
function setHealthBar(unit){
  const ratio=Math.max(0,unit.hp/unit.maxHp);
  unit.bar.fill.scale.x=ratio;
  unit.bar.fill.position.x=-.43*(1-ratio)-.005;
  unit.bar.fill.material.color.set(ratio<.28?0xe46b5f:ratio<.55?0xd9b26a:0x77d19a);
  unit.bar.group.visible=unit.hp<unit.maxHp||running;
}
function makeCircleShadow(parent,radius,color,opacity){
  const m=mesh(new THREE.CircleGeometry(radius,20),new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false}),parent,[0,.018,0]);m.rotation.x=-Math.PI/2;return m;
}
function makeUnit(data,enemy,pos){
  const u=enemy?makeEnemyModel(data):makeHeroModel(data);
  u.isEnemy=enemy;u.root.position.set(pos[0],0,pos[1]);u.home=new THREE.Vector3(pos[0],0,pos[1]);
  u.root.rotation.y=enemy?-Math.PI/2:Math.PI/2;
  u.shadow=makeCircleShadow(u.root,enemy?.49:.52,0x000000,.23);
  scene.add(u.root);
  setHealthBar(u);
  return u;
}
function resetPartyWorld(){
  heroes.forEach(h=>scene.remove(h.root));heroes=[];
  partyIds.forEach((id,i)=>{const d=heroDataAtLevel(id);if(d)heroes.push(makeUnit(d,false,unitPositions[i]));});
  renderPartyUI();updateComposition();updatePowerNote();
}
function spawnWave(){
  heroes.forEach(h=>{
    h.alive=true;h.deadTimer=0;h.root.visible=true;h.root.scale.setScalar(1);
    h.root.position.copy(h.home);h.root.rotation.set(0,Math.PI/2,0);h.visual.position.y=0;
    h.hp=Math.max(h.hp,h.maxHp*.6);setHealthBar(h);
  });
  enemies.forEach(e=>{scene.remove(e.root);});
  enemies=[];
  projectiles.forEach(p=>{scene.remove(p.mesh);if(p.light)scene.remove(p.light);});projectiles=[];
  cleared=false;running=true;
  const count=Math.min(3+Math.floor((wave-1)*.6),7);
  const choose=[enemyTypes[(wave-1)%5],enemyTypes[(wave+1)%5],enemyTypes[(wave+2)%5],enemyTypes[(wave+3)%5],enemyTypes[(wave+4)%5]];
  for(let i=0;i<count;i++){
    let d=choose[i%choose.length];
    const hpScale=1+(wave-1)*.15;
    d={...d,hp:Math.round(d.hp*hpScale),damage:Math.round(d.damage*(1+(wave-1)*.07))};
    const z=(i-(count-1)/2)*1.6, x=5.2+Math.random()*.8;
    const pos=[x,z];
    const u=makeUnit(d,true,pos);u.hp=d.hp;u.maxHp=d.hp;u.bar.max=d.hp;setHealthBar(u);
    enemies.push(u);
  }
  $('pauseButton').textContent='Ⅱ Pausar';
  $('nextWaveButton').disabled=true;
  $('waveLabel').textContent='HORDA '+String(wave).padStart(2,'0')+' · EM COMBATE';
  $('combatStatus').textContent='Batalha em andamento';
  $('combatMessage').textContent='Seus heróis estão lutando por conta própria.';
  $('statusDot').style.background='var(--mint)';
  showToast('Em combate', 'A horda '+String(wave).padStart(2,'0')+' se aproxima.');
  renderPartyUI();saveGame();
}
function buildProjectile(start,target,color,damage,aoe,troopType,enemy){
  const geo=aoe?new THREE.IcosahedronGeometry(.16,1):new THREE.SphereGeometry(.105,8,6);
  const material=mat(color,.28,.1,{emissive:color,emissiveIntensity:1.8});
  const orb=mesh(geo,material,scene,[start.x,start.y,start.z]);
  const light=pointLight(color,.6,2.4,scene,[start.x,start.y,start.z]);
  projectiles.push({mesh:orb,light,target,damage,aoe,troopType,enemy,color,speed:aoe?7.2:10,age:0});
}
function spawnBurst(pos,color,count=12,power=1){
  for(let i=0;i<count;i++){
    const m=mesh(new THREE.IcosahedronGeometry(.035+Math.random()*.045,0),mat(color,.4,.1,{emissive:color,emissiveIntensity:1.3}),scene,[pos.x,pos.y,pos.z]);
    const dir=new THREE.Vector3(Math.random()-.5,Math.random()*.9,Math.random()-.5).normalize().multiplyScalar((.8+Math.random()*2)*power);
    effects.push({kind:'particle',mesh:m,velocity:dir,life:.45+Math.random()*.5,age:0});
  }
  const ring=mesh(new THREE.TorusGeometry(.25,.025,5,24),mat(color,.35,.15,{emissive:color,emissiveIntensity:1}),scene,[pos.x,.12,pos.z]);ring.rotation.x=Math.PI/2;
  effects.push({kind:'ring',mesh:ring,life:.4,age:0,scale:1.8,origin:pos.clone()});
}
function showDamage(pos,amount,color){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,256,128);ctx.font='bold 56px Manrope, sans-serif';ctx.textAlign='center';ctx.lineWidth=8;ctx.strokeStyle='#10120e';ctx.strokeText(String(Math.round(amount)),128,75);ctx.fillStyle=color;ctx.fillText(String(Math.round(amount)),128,75);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));sprite.position.copy(pos);sprite.scale.set(1.1,.55,1);scene.add(sprite);
  effects.push({kind:'text',mesh:sprite,life:.75,age:0,texture});
}
function makeLoot(pos,kind){
  const g=new THREE.Group();g.position.set(pos.x,.55,pos.z);
  const color=kind==='gear'?0xc39af1:kind==='relic'?0xe8c36f:0xe7bd64;
  const crystal=mesh(new THREE.OctahedronGeometry(kind==='gear'?.21:.16,0),mat(color,.24,.24,{emissive:color,emissiveIntensity:1.7}),g,[0,0,0]);
  crystal.rotation.set(.3,.4,.2);
  mesh(new THREE.TorusGeometry(.3,.018,5,24),mat(color,.35,.1,{emissive:color,emissiveIntensity:1}),g,[0,-.4,0]).rotation.x=Math.PI/2;
  const glow=pointLight(color,.9,3,g,[0,.2,0]);
  scene.add(g);loot.push({group:g,crystal,light:glow,kind,value:kind==='gold'?120+wave*22:0,phase:Math.random()*8});
  lootTargets.push(crystal);crystal.userData.lootGroup=g;
}
function applyDamage(target,damage,attacker){
  if(!target.alive)return;
  let mult=1;
  if(beats[attacker.data.troop]===target.data.troop)mult=1.2;
  else if(beats[target.data.troop]===attacker.data.troop)mult=.82;
  const armor=target.data.armor||0;
  const real=Math.max(1,damage*mult-armor*.35);
  target.hp-=real;
  showDamage(target.root.position.clone().add(new THREE.Vector3((Math.random()-.5)*.3,2.45+(Math.random()*.2),.15)),real,mult>1?'#ffe49d':'#ffffff');
  target.attackAnim=Math.max(target.attackAnim,.2);
  spawnBurst(target.root.position.clone().add(new THREE.Vector3(0,1.15,0)),mult>1?0xf4cb78:attacker.data.troop==='missile'?0xc7a1ff:0xf0eee0,6,.5);
  if(target.hp<=0)killUnit(target);
  setHealthBar(target);
}
function healUnit(target,amount){
  if(!target.alive)return;
  target.hp=Math.min(target.maxHp,target.hp+amount);
  showDamage(target.root.position.clone().add(new THREE.Vector3(0,2.45,.15)),'+'+Math.round(amount),'#a4f3bf');
  spawnBurst(target.root.position.clone().add(new THREE.Vector3(0,1,0)),0x83e4ac,8,.55);setHealthBar(target);
}
function killUnit(target){
  if(!target.alive)return;
  target.alive=false;target.deadTimer=.0;
  spawnBurst(target.root.position.clone().add(new THREE.Vector3(0,.6,0)),target.isEnemy?0xffa66e:0x9ddbbc,18,1);
  if(target.isEnemy){
    if(!firstGearCollected&&!loot.some(l=>l.kind==='gear'))makeLoot(target.root.position,'gear');
    else if(Math.random()<.43)makeLoot(target.root.position,'gold');
    else if(Math.random()<.18)makeLoot(target.root.position,'gear');
  }
  saveGame();
}
function attackUnit(attacker,target){
  attacker.cooldown=attacker.data.rate;
  attacker.attackAnim=.38;
  if(attacker.data.style==='support'&&!attacker.isEnemy){
    const ally=heroes.filter(h=>h.alive&&h.hp<h.maxHp*.86).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    if(ally){healUnit(ally,attacker.data.id==='maela'?28:attacker.data.id==='suri'?18:23);return;}
  }
  const damage=attacker.data.damage*(attacker.isEnemy?1:1);
  if(attacker.data.style==='ranged'||attacker.data.style==='support'||(attacker.isEnemy&&attacker.data.range>3)){
    const p=attacker.root.position.clone().add(new THREE.Vector3(0,1.18,0));
    buildProjectile(p,target,attacker.isEnemy?0xff956d:troop[attacker.data.troop].color,damage,!!attacker.data.aoe,attacker.data.troop,attacker.isEnemy);
  }else{
    applyDamage(target,damage,attacker);
  }
}
function updateProjectiles(dt){
  for(let i=projectiles.length-1;i>=0;i--){
    const p=projectiles[i];
    if(!p.target.alive){scene.remove(p.mesh);scene.remove(p.light);projectiles.splice(i,1);continue;}
    const dest=p.target.root.position.clone().add(new THREE.Vector3(0,1.1,0));
    const dir=dest.clone().sub(p.mesh.position);const d=dir.length();
    if(d<p.speed*dt+.18){
      if(p.aoe){
        const squad=p.enemy?heroes:enemies;
        squad.filter(u=>u.alive&&u.root.position.distanceTo(p.target.root.position)<2.1).forEach(u=>applyDamage(u,p.damage*.72,{data:{troop:p.troopType}}));
      }else applyDamage(p.target,p.damage,{data:{troop:p.troopType}});
      spawnBurst(dest,p.color,10,.75);scene.remove(p.mesh);scene.remove(p.light);projectiles.splice(i,1);
    }else{
      dir.normalize();p.mesh.position.addScaledVector(dir,p.speed*dt);p.mesh.rotation.x+=dt*7;p.mesh.rotation.z+=dt*5;p.light.position.copy(p.mesh.position);
    }
  }
}
function nearestAlive(list,from){let best=null,distance=Infinity;for(const u of list){if(!u.alive)continue;const d=u.root.position.distanceTo(from.root.position);if(d<distance){distance=d;best=u;}}return {unit:best,distance};}
function updateUnits(dt,time){
  const activeHeroes=heroes.filter(h=>h.alive),activeEnemies=enemies.filter(e=>e.alive);
  for(const u of [...heroes,...enemies]){
    if(!u.alive){
      u.deadTimer+=dt;u.root.rotation.z+=(u.isEnemy?1:-1)*dt*1.5;u.root.scale.setScalar(Math.max(.05,1-u.deadTimer*1.65));u.shadow.visible=false;u.bar.group.visible=false;continue;
    }
    u.cooldown-=dt;u.walkPhase+=dt*(u.data.speed||2);
    const targets=u.isEnemy?activeHeroes:activeEnemies;
    if(!targets.length||!running){
      u.visual.position.y=Math.sin(time*2.1+u.walkPhase)*.035;
      u.leftArm.rotation.x=Math.sin(time*1.1+u.walkPhase)*.035;
      u.rightArm.rotation.x=Math.sin(time*1.2+u.walkPhase+1)*.035;
      continue;
    }
    // Support units stay with the group when an ally needs help; otherwise they still contribute damage.
    const result=nearestAlive(targets,u),target=result.unit;
    if(!target)continue;
    const dx=target.root.position.x-u.root.position.x,dz=target.root.position.z-u.root.position.z;
    const dist=Math.hypot(dx,dz);
    const desired=Math.max(1.25,(u.data.range||1.5)*.72);
    const canMove=u.data.style!=='support'&&dist>desired;
    if(canMove){
      const step=Math.min(dist-desired,(u.data.speed||2)*dt);
      u.root.position.x+=dx/(dist||1)*step;
      u.root.position.z+=dz/(dist||1)*step;
    }else if(!u.isEnemy&&u.data.style==='support'&&dist>3.9){
      const step=Math.min(dist-3.5,(u.data.speed||2)*dt*.6);
      u.root.position.x+=dx/(dist||1)*step;u.root.position.z+=dz/(dist||1)*step;
    }
    const ndx=target.root.position.x-u.root.position.x,ndz=target.root.position.z-u.root.position.z;
    u.root.rotation.y=Math.atan2(ndx,ndz);
    u.bar.group.rotation.y=-u.root.rotation.y;
    const moving=canMove||(!u.isEnemy&&u.data.style==='support'&&dist>3.9);
    const stride=moving?Math.sin(u.walkPhase*5)*.58:0;
    u.leftLeg.rotation.x=stride;u.rightLeg.rotation.x=-stride;
    u.visual.position.y=moving?Math.abs(Math.sin(u.walkPhase*5))*.07:Math.sin(time*2.0+u.walkPhase)*.025;
    u.aura.material.opacity=.8+Math.sin(time*2+u.walkPhase)*.15;
    if(u.attackAnim>0){u.attackAnim-=dt;const pulse=Math.max(0,u.attackAnim/.38);u.rightArm.rotation.x=-pulse*1.55;u.leftArm.rotation.x=pulse*.34;u.visual.rotation.z=(u.isEnemy?-.1:.1)*pulse;}
    else{u.rightArm.rotation.x=Math.sin(time*1.15+u.walkPhase)*.035;u.leftArm.rotation.x=Math.sin(time+u.walkPhase+1)*.03;u.visual.rotation.z=THREE.MathUtils.damp(u.visual.rotation.z,0,8,dt);}
    if(result.distance<=Math.max(u.data.range||1.5,1.4)&&u.cooldown<=0)attackUnit(u,target);
  }
}
function updateEffects(dt){
  for(let i=effects.length-1;i>=0;i--){
    const e=effects[i];e.age+=dt;const p=e.age/e.life;
    if(e.kind==='particle'){e.mesh.position.addScaledVector(e.velocity,dt);e.velocity.y-=1.8*dt;e.mesh.scale.setScalar(Math.max(.001,1-p));}
    else if(e.kind==='ring'){const s=1+p*3;e.mesh.scale.set(s,1,s);e.mesh.material.opacity=1-p;}
    else if(e.kind==='text'){e.mesh.position.y+=dt*.75;e.mesh.material.opacity=1-p;e.mesh.scale.set(1.1+p*.22,.55+p*.12,1);}
    if(p>=1){
      if(e.group){scene.remove(e.group);e.group.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(o.material)o.material.dispose();}});}
      else{scene.remove(e.mesh);if(e.mesh.material){if(e.mesh.material.map)e.mesh.material.map.dispose();e.mesh.material.dispose();}if(e.texture)e.texture.dispose();}
      effects.splice(i,1);
    }
  }
}
function updateLoot(dt,time){
  for(let i=loot.length-1;i>=0;i--){
    const l=loot[i];l.phase+=dt;
    l.group.position.y=.52+Math.sin(l.phase*2.25)*.12;l.group.rotation.y+=dt*.72;l.crystal.rotation.x+=dt*.45;
    l.light.intensity=.65+Math.sin(l.phase*4)*.25;
  }
}
let environmentMotes=[];
function onWaveClear(){
  if(cleared)return;
  cleared=true;running=false;
  const clearedWave=wave;
  const aliveHeroes=heroes.filter(h=>h.alive).length;
  const reward=160+wave*48+aliveHeroes*14;gold+=reward;
  const xpReward=24+clearedWave*8;
  let levelsGained=0;
  partyIds.forEach(id=>{levelsGained+=grantHeroXp(id,xpReward);});
  refreshHeroWorldStats();
  if(wave%3===0){makeLoot(new THREE.Vector3(1.1,.1,-.5),'relic');}
  $('pauseButton').textContent='⚔ Recomeçar';
  $('nextWaveButton').disabled=false;
  $('waveLabel').textContent='HORDA '+String(wave).padStart(2,'0')+' · CONCLUÍDA';
  $('combatStatus').textContent='Área segura';
  $('combatMessage').textContent='Horda eliminada. Clique nos cristais para recolher o loot.';
  $('statusDot').style.background='var(--gold)';
  showToast('Horda eliminada','+'+fmt(reward)+' ouro · +'+fmt(xpReward)+' XP por herói'+(levelsGained?' · '+levelsGained+' nível(is) conquistado(s)':''));
  wave++;updateHud();saveGame();
}
function updateHud(){
  $('goldValue').textContent=fmt(gold);$('waveValue').textContent=String(wave).padStart(2,'0');
  $('teamCount').textContent=partyIds.length+' / 5';
}
function updateComposition(){
  const c=compInfo();$('bonusValue').textContent='+'+c.bonus+'%';$('bonusLabel').textContent=c.label+' · '+c.short;
  $('typeChips').innerHTML=['tank','air','missile'].map(k=>'<span class="chip"><span class="'+troop[k].css+'">'+troop[k].emoji+'</span> '+c.count[k]+' '+troop[k].name+'</span>').join('');
}
function updatePowerNote(){
  const c=compInfo();const power=partyIds.reduce((s,id)=>s+(heroDataAtLevel(id)?.damage||0),0)*(1+c.bonus/100);
  $('combatMessage').textContent='Poder de ataque '+fmt(power)+'. '+c.label+' — os heróis mantêm funções variadas dentro da mesma tropa.';
}
function renderPartyUI(){
  const root=$('partyCards');
  root.innerHTML=partyIds.map((id,i)=>{
    const h=heroRoster.find(x=>x.id===id);const unit=heroes[i];const ratio=unit?Math.max(0,unit.hp/unit.maxHp):1;const p=progressFor(id);
    return '<button class="heroCard '+(selectedSlot===i?'active':'')+'" data-slot="'+i+'"><div class="cardTop"><span class="heroGlyph">'+h.emoji+'</span><span><strong>'+h.name+'</strong><small>NV. '+p.level+' · '+h.role+'</small></span></div><div class="healthTrack"><div class="healthFill" style="width:'+(ratio*100)+'%"></div></div><div class="cardStats"><span class="affinity '+h.troop+'">'+troop[h.troop].name+'</span><span>'+Math.ceil(unit?.hp||heroDataAtLevel(id).hp)+' HP</span></div></button>';
  }).join('');
  root.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{selectedSlot=Number(b.dataset.slot);renderPartyUI();$('slotPrompt').textContent='Substituindo o espaço '+(selectedSlot+1)+'. Escolha um herói diferente.';}));
}
function renderRoster(){
  const root=$('rosterGrid');
  root.innerHTML=heroRoster.map(h=>{
    const inTeam=partyIds.includes(h.id);
    return '<button class="rosterPick" data-hero="'+h.id+'" '+(inTeam?'disabled':'')+'><span class="emoji">'+h.emoji+'</span><strong>'+h.name+'</strong><small class="'+h.troop+'">'+troop[h.troop].name+'</small><div class="role">'+h.role+' · '+h.style+'</div><div class="role">'+(inTeam?'Já está na equipe':'Selecionar para o espaço '+(selectedSlot+1))+'</div></button>';
  }).join('');
  root.querySelectorAll('[data-hero]').forEach(b=>b.addEventListener('click',()=>replaceHero(b.dataset.hero)));
}
function replaceHero(id){
  if(running){showToast('Combate em andamento','Pause a batalha antes de trocar os heróis.');return;}
  if(partyIds.includes(id))return;
  partyIds[selectedSlot]=id;
  $('rosterOverlay').classList.remove('open');
  resetPartyWorld();updateHud();saveGame();
  showToast('Equipe atualizada',heroRoster.find(h=>h.id===id).name+' entrou no espaço '+(selectedSlot+1)+'.');
}
function showToast(title,message){
  $('toastTitle').textContent=title;$('toastText').textContent=message;
  $('centerToast').classList.add('show');lastToast=3.2;
}
function pickLoot(l){
  if(!l)return;
  if(l.kind==='gold'){
    gold+=l.value;showToast('Ouro recolhido','+'+fmt(l.value)+' moedas adicionadas ao inventário.');
  }else if(l.kind==='relic'&&!tacticalCard){
    tacticalCard=true;showToast('Relíquia encontrada','Carta Tática: 4 + 1 mantém o bônus de +20%.');updateComposition();
  }else{
    const item=makeItem();items.push(item);if(items.length>60)items.shift();
    if(!firstGearCollected)firstGearCollected=true;
    showToast('Equipamento encontrado',item.name+' ('+item.rarity+') · '+slotNames[item.slot]+'. Abra Equipamentos para comparar e equipar.');
  }
  const idx=loot.indexOf(l);if(idx>=0)loot.splice(idx,1);
  scene.remove(l.group);lootTargets=loot.map(x=>x.crystal);
  updateHud();saveGame();
}
function onPointerDown(e){
  const rect=renderer.domElement.getBoundingClientRect();
  const m=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);
  const ray=new THREE.Raycaster();ray.setFromCamera(m,camera);
  const hits=ray.intersectObjects(lootTargets,false);
  if(hits.length){
    const g=hits[0].object.userData.lootGroup,l=loot.find(x=>x.group===g);if(l)pickLoot(l);
  }
}
function initScene(){
  scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1713);scene.fog=new THREE.FogExp2(0x0b1914,.022);
  camera=new THREE.PerspectiveCamera(43,window.innerWidth/window.innerHeight,.1,100);
  camera.position.set(0,14.5,19.5);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.id='gameCanvas';renderer.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;display:block;outline:none;z-index:0;touch-action:pan-y';
  $('gameRoot').appendChild(renderer.domElement);
  const hemi=new THREE.HemisphereLight(0xb7d9c3,0x243027,2.0);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffd9a0,3.1);key.position.set(-6,13,8);key.castShadow=true;key.shadow.mapSize.set(1536,1536);key.shadow.camera.left=-13;key.shadow.camera.right=13;key.shadow.camera.top=13;key.shadow.camera.bottom=-13;key.shadow.bias=-.00045;scene.add(key);
  const fill=new THREE.DirectionalLight(0x8aaeff,1.1);fill.position.set(8,8,-8);scene.add(fill);
  const rim=new THREE.PointLight(0x4a9d80,2.4,20);rim.position.set(0,4,-5);scene.add(rim);
  environmentMotes=buildEnvironment();
  controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.25,0);controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=15;controls.maxDistance=29;controls.minPolarAngle=.42;controls.maxPolarAngle=1.28;controls.maxAzimuthAngle=1.15;controls.minAzimuthAngle=-1.15;controls.enablePan=false;controls.rotateSpeed=.42;controls.zoomSpeed=.65;
  resetPartyWorld();updateHud();updateComposition();
  renderer.domElement.addEventListener('pointerdown',onPointerDown);
  window.addEventListener('resize',onResize);
  sceneReady=true;
}
function onResize(){if(!renderer||!camera)return;camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));}
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;
  elapsed+=dt;
  controls.update();
  if(running){
    updateUnits(dt,time);updateProjectiles(dt);
    if(enemies.length&&enemies.every(e=>!e.alive))onWaveClear();
    if(heroes.every(h=>!h.alive)){running=false;cleared=true;$('combatStatus').textContent='Grupo derrotado';$('combatMessage').textContent='Reorganize a equipe antes de tentar novamente.';$('pauseButton').textContent='↻ Tentar de novo';$('nextWaveButton').disabled=false;showToast('Equipe derrotada','Abra o elenco e ajuste os cinco heróis.');}
  }else{
    updateUnits(dt,time);updateProjectiles(dt);
  }
  updateEffects(dt);updateLoot(dt,time);
  environmentMotes.forEach(m=>{m.g.position.y=m.baseY+Math.sin(time*.55+m.phase)*.22;m.g.position.x+=Math.sin(time*.12+m.phase)*dt*.025;});
  if(lastToast>0){lastToast-=dt;if(lastToast<=0)$('centerToast').classList.remove('show');}
  if(elapsed-lastSave>12){saveGame();lastSave=elapsed;}
  if(heroes.length)$('partyCards').querySelectorAll('[data-slot]').forEach((b,i)=>{const fill=b.querySelector('.healthFill'),unit=heroes[i],hp=b.querySelector('.cardStats span:last-child');if(fill&&unit){fill.style.width=(Math.max(0,unit.hp/unit.maxHp)*100)+'%';hp.textContent=Math.ceil(unit.hp)+' HP';}});
  renderer.render(scene,camera);
}
function wireUI(){
  $('inventoryButton').addEventListener('click',()=>{
    if(running){showToast('Combate em andamento','Pause a batalha para equipar itens.');return;}
    renderInventory();$('inventoryOverlay').classList.add('open');
  });
  $('closeInventory').addEventListener('click',()=>$('inventoryOverlay').classList.remove('open'));
  $('inventoryOverlay').addEventListener('click',e=>{if(e.target===$('inventoryOverlay'))$('inventoryOverlay').classList.remove('open');});
  $('pauseButton').addEventListener('click',()=>{
    if(running){running=false;$('pauseButton').textContent='▶ Retomar';$('combatStatus').textContent='Combate pausado';$('combatMessage').textContent='A equipe descansa enquanto a batalha está pausada.';$('waveLabel').textContent='HORDA '+String(wave).padStart(2,'0')+' · PAUSADA';}
    else if(cleared||!enemies.length){spawnWave();}
    else{running=true;$('pauseButton').textContent='Ⅱ Pausar';$('combatStatus').textContent='Batalha em andamento';}
  });
  $('nextWaveButton').addEventListener('click',()=>{wave=Math.max(1,wave);spawnWave();});
  $('rosterButton').addEventListener('click',()=>{
    if(running){showToast('Combate em andamento','Pause a batalha para reorganizar o grupo.');return;}
    renderRoster();$('slotPrompt').textContent='Substituindo o espaço '+(selectedSlot+1)+'. Escolha um herói para ocupar essa posição.';$('rosterOverlay').classList.add('open');
  });
  $('closeRoster').addEventListener('click',()=>$('rosterOverlay').classList.remove('open'));
  $('rosterOverlay').addEventListener('click',e=>{if(e.target===$('rosterOverlay'))$('rosterOverlay').classList.remove('open');});
  $('cameraButton').addEventListener('click',()=>{camera.position.set(0,14.5,19.5);controls.target.set(0,.25,0);controls.update();});
}
loadGame();
if(offlineEarned>0)saveGame();
try{
  initScene();wireUI();
  if(offlineEarned>0){$('offlineValue').textContent='+'+fmt(offlineEarned)+' / +'+fmt(offlineXpEarned)+' XP';showToast('Você voltou à fronteira','Seus heróis acumularam '+fmt(offlineEarned)+' ouro e '+fmt(offlineXpEarned)+' XP por herói.');}
  else $('offlineValue').textContent='ativo';
  updateHud();renderPartyUI();updateComposition();updatePowerNote();animate();
  setTimeout(()=>{
    if(!running&&!enemies.length)spawnWave();
    if(!tutorialSeen){setTimeout(()=>showToast('Sua equipe luta sozinha','Observe a batalha, recolha cristais de loot e pause para trocar heróis ou equipar itens.'),1700);tutorialSeen=true;saveGame();}
  },900);
  window.addEventListener('beforeunload',saveGame);
}catch(err){
  console.error(err);$('bootError').classList.add('visible');$('bootErrorText').textContent='Erro ao criar a cena 3D: '+(err?.message||String(err))+'. Verifique a conexão e o suporte a WebGL 2.';
}
