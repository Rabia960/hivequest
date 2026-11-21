import Phaser from 'phaser';
import './style.css';
import {getLevel,LEVEL_COUNT,WORLDS} from './levels.js';
import {watchLeaderboard,submitScore,isOnlineConfigured} from './firebase.js';

const $=id=>document.getElementById(id);
let currentLevel=1, totalScore=Number(localStorage.getItem('hivequest-score')||0), bestLocal=Number(localStorage.getItem('hivequest-best')||0), game, sceneRef, levelScore=0;
const keys={left:false,right:false,jump:false};
const palette=[['#68b8ed','#315d91','#78bd59','#89552f'],['#ffb7d4','#a65f91','#69a95d','#865044'],['#9ad8ee','#456c9b','#8ad6a5','#64528c'],['#9bdcf5','#6a9bca','#77c96a','#82523d'],['#19284e','#344b83','#6889b7','#55416f'],['#efb36c','#8c6246','#b47a3c','#75462f'],['#b9eaff','#6c9fc7','#e8f4ff','#8a9fb5'],['#ffb2a2','#b76a8b','#76bd63','#9b5b46'],['#a9ddf7','#799bc7','#8dd7a4','#80619a'],['#87a9a0','#3d6c65','#70a95a','#604a3b'],['#69d5cb','#277f80','#76c65b','#865a3e'],['#f2cb83','#c18c56','#9ab95b','#96623c'],['#c6a5e8','#785f9b','#82bd79','#76513d'],['#25345e','#5267a0','#8f8be0','#514b7a'],['#6ec8db','#387f9b','#72c8b1','#6d7995'],['#a9c6b2','#617e74','#7eb56a','#69533e'],['#f5a879','#ad644d','#82b65e','#76503d'],['#e0c38d','#9c7b54','#82a45b','#795238'],['#7e8ce0','#3f4d9b','#a2a0e8','#544b86'],['#f6d67c','#d99d46','#8dd18b','#83543a']];
class MeadowScene extends Phaser.Scene{
 constructor(){super('meadow')}
 create(){sceneRef=this;this.physics.world.setBounds(0,0,4000,560);this.cameras.main.setBounds(0,0,4000,560);this.makeTextures();this.startLevel(currentLevel);this.cursors=this.input.keyboard.createCursorKeys();this.wasd=this.input.keyboard.addKeys('W,A,S,D,SPACE');this.input.keyboard.on('keydown-ESC',()=>togglePause());}
 makeTextures(){
  const g=this.make.graphics({x:0,y:0,add:false});
  g.fillStyle(0xffd33d);g.fillRoundedRect(2,8,29,19,8);g.fillStyle(0x17243b);g.fillRect(9,8,5,19);g.fillRect(21,8,5,19);g.fillStyle(0xf7fbff);g.fillEllipse(14,5,17,9);g.fillEllipse(25,3,12,8);g.fillStyle(0x17243b);g.fillRect(26,12,3,3);g.fillStyle(0xffa4b7);g.fillRect(27,17,3,2);g.generateTexture('bee',36,32);g.clear();
  g.fillStyle(0x89552f);g.fillRect(0,9,48,28);g.fillStyle(0x4d9b4b);g.fillRect(0,4,48,9);g.fillStyle(0x9bd46a);g.fillRect(0,4,48,3);g.fillStyle(0x6d432c);g.fillRect(5,17,8,6);g.fillRect(23,25,9,7);g.fillStyle(0xc28a52);g.fillRect(7,16,4,3);g.generateTexture('soil',48,40);g.clear();
  g.fillStyle(0xfff3a4);g.fillCircle(12,12,5);g.fillStyle(0xff82b4);for(let i=0;i<6;i++){let a=i*Math.PI/3;g.fillCircle(12+Math.cos(a)*8,12+Math.sin(a)*8,5)}g.fillStyle(0x4a9c55);g.fillRect(10,17,4,16);g.generateTexture('flower',24,36);g.clear();
  g.fillStyle(0xffd34e);g.fillRoundedRect(4,2,12,23,5);g.fillStyle(0xfff3a0);g.fillRect(8,5,4,15);g.generateTexture('coin',20,27);g.clear();
  g.fillStyle(0x805c9d);g.fillRoundedRect(2,5,26,22,9);g.fillStyle(0xffffff);g.fillCircle(10,13,4);g.fillCircle(21,13,4);g.fillStyle(0x17243b);g.fillCircle(11,14,2);g.fillCircle(22,14,2);g.generateTexture('bug',30,30);g.clear();
  g.fillStyle(0xd99a35);g.fillRoundedRect(2,2,54,58,16);g.fillStyle(0xffd36a);g.fillRoundedRect(7,0,44,20,9);g.fillStyle(0x3b2d39);g.fillEllipse(29,38,17,22);g.generateTexture('hive',58,62);g.destroy();
 }
 startLevel(n){
  this.physics.world.resume();this.physics.world.colliders.destroy();this.children.removeAll();this.level=getLevel(n);levelScore=0;this.collected=0;this.hearts=3;
  const colors=palette[this.level.theme];this.cameras.main.setBackgroundColor(colors[0]);this.add.rectangle(480,270,960,540,colors[0]).setScrollFactor(0);
  for(let i=0;i<9;i++){this.add.ellipse(i*210+40,365-(i%3)*30,280,150,Phaser.Display.Color.HexStringToColor(colors[1]).color,.55);}
  this.platforms=this.physics.add.staticGroup();const count=this.level.platforms+3;let x=0;const groundY=480;
  for(let i=0;i<count;i++){let width=i===0||i===count-1?350:Phaser.Math.Between(145,220);let y=i===0||i===count-1?groundY:Phaser.Math.Between(300,420);if(i>0)x+=Phaser.Math.Between(90,145);const p=this.platforms.create(x,y,'soil').setOrigin(0,0);p.displayWidth=width;p.displayHeight=75;p.refreshBody();for(let j=0;j<Math.ceil(width/48);j++)this.add.image(x+j*48+24,y+18,'soil').setOrigin(.5,.5).setDisplaySize(48,40).setDepth(-1);x+=width;}
  this.endX=x-130;this.flowers=this.physics.add.staticGroup();const flowerCount=this.level.flowers;for(let i=0;i<flowerCount;i++){let fx=140+i*(this.endX-280)/(flowerCount-1);let fy=Phaser.Math.Between(235,390);let f=this.flowers.create(fx,fy,'flower');f.body.setSize(22,28).setOffset(1,5);f.setData('taken',false);this.tweens.add({targets:f,y:fy-6,duration:650+Math.random()*400,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
  this.coins=this.physics.add.staticGroup();for(let i=0;i<Math.min(4+this.level.difficulty,10);i++){let c=this.coins.create(230+i*(this.endX-400)/Math.max(1,Math.min(4+this.level.difficulty,10)-1),Phaser.Math.Between(175,300),'coin');c.setData('taken',false);this.tweens.add({targets:c,angle:360,duration:1800,repeat:-1});}
  this.enemies=this.physics.add.group();for(let i=0;i<this.level.enemyCount;i++){let e=this.enemies.create(650+i*300,Phaser.Math.Between(300,390),'bug');e.setVelocityX(55+this.level.difficulty*13);e.setBounce(1);e.setCollideWorldBounds(true);e.setData('min',e.x-100);e.setData('max',e.x+100);}
  this.bee=this.physics.add.sprite(70,350,'bee').setScale(1.15);this.bee.setCollideWorldBounds(true);this.bee.setBounce(0);this.bee.body.setSize(27,22).setOffset(4,6);this.bee.setDepth(5);
  this.hive=this.physics.add.staticImage(this.endX,groundY-34,'hive');this.hive.refreshBody();
  this.physics.add.collider(this.bee,this.platforms);this.physics.add.overlap(this.bee,this.flowers,(b,f)=>this.collectFlower(f));this.physics.add.overlap(this.bee,this.coins,(b,c)=>this.collectCoin(c));this.physics.add.collider(this.bee,this.enemies,()=>this.hitEnemy());
  this.cameras.main.startFollow(this.bee,true,.09,.09);this.cameras.main.setDeadzone(160,90);
  $('world-label').textContent=`WORLD ${String(this.level.world).padStart(2,'0')} · ${this.level.worldName.toUpperCase()}`;$('level-label').textContent=`LEVEL ${String(n).padStart(2,'0')} / 100`;$('quest-title').textContent=this.level.title;$('quest-copy').textContent=this.level.story;
  this.updateHUD();this.showToast(`WORLD ${this.level.world}: ${this.level.worldName}`);
 }
 collectFlower(f){if(f.getData('taken'))return;f.setData('taken',true);f.disableBody(true,true);this.collected++;levelScore+=100;this.spark(f.x,f.y,0xffe57a);this.updateHUD();this.showToast('Nectar +100 🍯');}
 collectCoin(c){if(c.getData('taken'))return;c.setData('taken',true);c.disableBody(true,true);levelScore+=50;this.spark(c.x,c.y,0xffd34e);this.updateHUD();}
 hitEnemy(){if(this.bee.invulnerable)return;this.hearts--;this.bee.invulnerable=true;this.bee.setVelocityY(-260);this.bee.setTint(0xff9b9b);this.time.delayedCall(1100,()=>{if(this.bee.active){this.bee.clearTint();this.bee.invulnerable=false;}});this.updateHUD();if(this.hearts<=0)this.endLevel(false);}
 spark(x,y,color){for(let i=0;i<8;i++){let p=this.add.rectangle(x,y,5,5,color);this.tweens.add({targets:p,x:x+Phaser.Math.Between(-35,35),y:y+Phaser.Math.Between(-45,15),alpha:0,duration:450,onComplete:()=>p.destroy()});}}
 updateHUD(){$('hearts').textContent='♥ '.repeat(this.hearts);$('nectar').textContent=`${this.collected}/${this.level.flowers}`;$('score').textContent=totalScore+levelScore;$('progress-bar').style.width=`${this.collected/this.level.flowers*100}%`;$('progress-copy').textContent=`${this.collected} of ${this.level.flowers} flowers collected`;}
 showToast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove('show'),1300);}
 update(){if(!this.bee||!this.bee.active||!this.physics.world.isActive())return;const left=this.cursors.left.isDown||this.wasd.A.isDown||keys.left,right=this.cursors.right.isDown||this.wasd.D.isDown||keys.right,jump=Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.wasd.W)||Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)||keys.jump;
  if(left){this.bee.setVelocityX(-210);this.bee.setFlipX(true);}else if(right){this.bee.setVelocityX(210);this.bee.setFlipX(false);}else this.bee.setVelocityX(this.bee.body.velocity.x*.84);
  if(jump&&(this.bee.body.blocked.down||this.bee.body.touching.down))this.bee.setVelocityY(-390);
  this.enemies.children.iterate(e=>{if(!e)return;if(e.x<e.getData('min'))e.setVelocityX(Math.abs(e.body.velocity.x));if(e.x>e.getData('max'))e.setVelocityX(-Math.abs(e.body.velocity.x));});
  if(this.bee.y>600)this.endLevel(false);
  if(this.bee.x>this.endX-30){if(this.collected>=this.level.flowers)this.endLevel(true);else this.showToast(`Find ${this.level.flowers-this.collected} more blooms!`);}
 }
 endLevel(success){if(this.finished)return;this.finished=true;this.physics.world.pause();if(success){totalScore+=levelScore;bestLocal=Math.max(bestLocal,totalScore);localStorage.setItem('hivequest-best',bestLocal);localStorage.setItem('hivequest-score',totalScore);submitScore({score:totalScore,level:currentLevel,world:this.level.world}).catch(console.error);if(currentLevel<LEVEL_COUNT){showScreen('LEVEL COMPLETE!',`You restored ${this.level.worldName}! ${currentLevel%5===0?'A new world theme is unlocked!':'The next trail awaits.'}`,`CONTINUE TO LEVEL ${currentLevel+1}`);}else showScreen('THE ETERNAL BLOOM!',`You brought all 20 gardens back to life. Final score: ${totalScore}.`,'PLAY AGAIN');}else{showScreen('TRY AGAIN, LITTLE BEE',`Bibi needs another flight. You collected ${this.collected} of ${this.level.flowers} blooms.`,'RETRY LEVEL');}}
}
function showScreen(title,copy,button){$('screen-title').textContent=title;$('screen-copy').textContent=copy;$('play').textContent=button;$('start-screen').style.display='grid';}
function togglePause(){if(!sceneRef)return;let s=sceneRef;if(s.physics.world.isPaused){s.physics.world.resume();$('start-screen').style.display='none';}else{s.physics.world.pause();showScreen('PAUSED', 'The meadow is waiting. Take a breath, then continue your adventure.','RESUME');}}
function launch(){game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:540,pixelArt:true,roundPixels:true,backgroundColor:'#75c6ed',physics:{default:'arcade',arcade:{gravity:{y:850},debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[MeadowScene]});}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));if(id==='profile-screen'){ $('profile-score').textContent=totalScore.toLocaleString();$('profile-level').textContent=currentLevel;$('profile-worlds').textContent=(Math.floor(currentLevel/5)+1);} }
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
$('brand-home').addEventListener('click',()=>showPage('home-screen'));
const worldEmojis=['🌼','🌸','💎','🌈','🌙','🍂','❄️','🍬','☁️','🍄','🌴','🌵','🍃','⭐','🫧','⚙️','🐉','🏛️','🌌','🌻'];
function renderWorlds(){const grid=$('world-grid');grid.innerHTML='';for(let i=0;i<20;i++){const unlocked=i<(Math.floor(currentLevel/5)+1);const card=document.createElement('button');card.className='world-card '+(unlocked?'':'locked')+(Math.floor((currentLevel-1)/5)===i?' current':'');card.style.setProperty('--w1',palette[i][0]);card.style.setProperty('--w2',palette[i][1]);const start=i*5+1;card.innerHTML=`<div class="world-art">${worldEmojis[i]}</div><div class="world-info"><b>${String(i+1).padStart(2,'0')} · ${WORLDS[i][0]}</b><small>${unlocked?'Levels '+start+'–'+(start+4)+' · Explore world':'🔒 Complete previous world'}</small></div>`;card.disabled=!unlocked;card.addEventListener('click',()=>beginLevel(Math.max(start,Math.min(currentLevel,start+4))));grid.appendChild(card);}}
function beginLevel(n){currentLevel=n;showPage('game-screen');if(sceneRef){sceneRef.finished=false;sceneRef.startLevel(currentLevel);showScreen('LEVEL BRIEFING',getLevel(currentLevel).story,'START LEVEL');}}
renderWorlds();$('wallet').textContent=String(Math.floor(totalScore/10)).padStart(3,'0');
$('start-adventure').addEventListener('click',()=>beginLevel(currentLevel));
$('back-to-map').addEventListener('click',()=>{renderWorlds();showPage('worlds-screen');});
$('play').addEventListener('click',()=>{const label=$('play').textContent;if(label.includes('CONTINUE')){beginLevel(Math.min(100,currentLevel+1));}else if(label==='PLAY AGAIN'&&currentLevel===100){totalScore=0;localStorage.setItem('hivequest-score','0');beginLevel(1);}else if(label.includes('RETRY')){sceneRef.finished=false;sceneRef.startLevel(currentLevel);}else if(label==='RESUME'){sceneRef.physics.world.resume();} $('start-screen').style.display='none';});
$('pause').addEventListener('click',togglePause);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false));});
$('player-status').textContent=isOnlineConfigured()?'Connecting to live leaderboard…':'Online leaderboard needs Firebase setup · Local play is ready';
watchLeaderboard(rows=>{$('leader-list').innerHTML=rows.length?rows.map(r=>`<li>${escapeHtml(r.displayName||'Meadow Bee')} — ${Number(r.score||0).toLocaleString()} pts <small>(Lv ${r.level||1})</small></li>`).join(''):'<li class="muted">No scores yet. Be the first!</li>';$('player-status').textContent='Live global top 10 · Anonymous player sign-in';},()=>{$('player-status').textContent='Leaderboard connection failed. Check Firebase setup.';});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
launch();showPage('home-screen');
