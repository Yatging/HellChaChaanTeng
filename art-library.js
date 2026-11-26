'use strict';
(()=>{
 const data=window.ArtLibrary,grid=document.querySelector('#asset-grid'),dialog=document.querySelector('#preview');
 const groups=[
 ['13','單品上桌','Single servings'],['03','成品餐點','Finished meals'],['14','新版備料盤','Prep trays'],['15','新版烹調動畫','Cooking loops'],['16','配套餐具','Empty settings'],['12','內容投影 v2','Contents only'],['all','全部','All'],['01','顧客','Customers'],['02','背景','Backgrounds'],['04','飲品','Drinks'],['05','大盤原料','Bulk ingredients'],['06','餐具鍋具','Cookware'],['07','烹飪狀態','Cooking states'],['08','動畫幀','Animation frames'],['09','生熟原料','Raw & cooked'],['10','原圖存檔','Archive'],['11','總覽圖','Contact sheets']
 ];
 const sources={'imagegen':'新生成 / ImageGen','new-vector-art':'延續既有畫風繪製 / Original illustration style','existing-vector-export':'既有繪圖獨立匯出 / Existing art export','supplied-original':'提供的原圖 / Supplied original','existing-archive':'既有素材存檔 / Existing asset archive','preview':'分組總覽 / Contact sheet'};
 const ingredients={egg:['雞蛋','Egg'],rice:['米飯','Rice'],macaroni:['通粉','Macaroni'],scrambled:['炒蛋','Scrambled egg'],ham:['火腿','Ham']};
 let category=groups.find(([id])=>id===new URLSearchParams(location.search).get('category'))?.[0]||'all',timer=null,sequence=[],current=null;
 const $=s=>document.querySelector(s);
 const url=asset=>data.folder+'/'+asset.file.split('/').map(encodeURIComponent).join('/');
 function names(asset){
  const englishNames={
   'customer_01_red_polo.png':'Neighbour in a red polo',
   'customer_02_newspaper_man.png':'Newspaper reader',
   'customer_03_construction_worker.png':'Construction worker',
   'customer_04_hair_rollers.png':'Neighbour with hair rollers',
   'background_customer_original.png':'Original customer background'
  };
  if(englishNames[asset.file.split('/').pop()])return [asset.zh,englishNames[asset.file.split('/').pop()]];
  if(asset.file.startsWith('08_')){
   const file=asset.file.split('/'),ingredient=Object.keys(ingredients).find(k=>file[1].endsWith('_'+k)),i=Number(file[2].match(/\d+/)[0])+1;
   return [ingredients[ingredient][0]+' · 動畫 '+i+'/12',ingredients[ingredient][1]+' · Frame '+i+' of 12'];
  }
  if(asset.file.startsWith('07_')){
   const file=asset.file.split('/').pop(),ingredient=Object.keys(ingredients).find(k=>file.includes('_'+k+'_'));
   const state=file.includes('01_raw')?['生料入鍋','Raw in cookware']:file.includes('02_cooking')?['烹調中','Cooking']:['鍋內完成','Cooked in cookware'];
   return [ingredients[ingredient][0]+' · '+state[0],ingredients[ingredient][1]+' · '+state[1]];
  }
  if(asset.file.startsWith('09_')){
   const id=Object.keys(ingredients).find(k=>asset.file.includes('_'+k+'_')),raw=asset.file.includes('_raw');
   return [(raw?'生料 · ':'熟料 · ')+ingredients[id][0],(raw?'Raw ':'Cooked ')+ingredients[id][1]];
  }
  if(asset.file.startsWith('10_'))return ['原圖存檔',asset.en];
  if(asset.file.startsWith('11_'))return ['分組總覽',asset.file.split('/').pop().replace('contact_','').replace('.png','')];
  return [asset.zh,asset.en];
 }
 function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n}
 const assets=[...data.assets].sort((a,b)=>a.file.localeCompare(b.file));
 const buttons=new Map();
 for(const [id,zh,en]of groups){
  const count=id==='all'?assets.length:assets.filter(a=>a.file.startsWith(id+'_')).length;
  const button=el('button','',zh+' '+count);button.type='button';button.title=en;button.setAttribute('aria-pressed',String(id===category));
  button.onclick=()=>{category=id;render()};$('#filters').append(button);buttons.set(id,button);
 }
 function render(){
  const query=$('#search').value.trim().toLowerCase();
  const list=assets.filter(a=>(category==='all'||a.file.startsWith(category+'_'))&&[...names(a),a.file,a.zh,a.en].join(' ').toLowerCase().includes(query));
  if($('#sort').value==='name')list.sort((a,b)=>a.file.split('/').pop().localeCompare(b.file.split('/').pop()));
  const frag=document.createDocumentFragment();
  for(const a of list){
   const [zh,en]=names(a),card=el('article','asset-card'),button=el('button','asset-image'),img=el('img');
   button.type='button';button.setAttribute('aria-label','預覽 '+zh+' / '+en);
   img.src=url(a);img.alt=zh+' / '+en;img.loading='lazy';img.decoding='async';
   button.append(img);button.onclick=()=>open(a);
   const copy=el('div','asset-copy');copy.append(el('h2','',zh),el('p','english',en),el('span','asset-meta',a.width+' × '+a.height+' · '+(a.transparent?'透明 PNG':'PNG')),el('span','asset-file',a.file.split('/').pop()));
   const download=el('a','asset-download','下載 PNG');download.href=url(a);download.download=a.file.split('/').pop();download.setAttribute('aria-label','下載 '+a.file.split('/').pop());copy.append(download);
   card.append(button,copy);frag.append(card);
  }
  grid.replaceChildren(frag);$('#result-count').textContent='顯示 '+list.length+' / '+assets.length+' 張 · Showing '+list.length+' assets';
  $('#no-results').hidden=list.length>0;
  for(const [id,b]of buttons)b.setAttribute('aria-pressed',String(id===category));
 }
 function show(asset){
  current=asset;const [zh,en]=names(asset);
  $('#preview-title').textContent=zh;$('#preview-en').textContent=en;$('#preview-image').src=url(asset);$('#preview-image').alt=zh;
  $('#preview-file').textContent=asset.file;
  $('#preview-size').textContent=asset.width+' × '+asset.height+' px';
  $('#preview-alpha').textContent=asset.transparent?'透明背景 / Transparent':'完整底圖 / Opaque background';
  $('#preview-source').textContent=sources[asset.group]||asset.group;
  $('#preview-download').href=url(asset);$('#preview-download').download=asset.file.split('/').pop();
  const fps=sequence[0]?.animation?.fps||4;
  $('#frame-status').textContent=sequence.length?(sequence.indexOf(asset)>=0?'第 '+(sequence.indexOf(asset)+1)+' / '+sequence.length+' 幀 · '+fps+' fps': '生料 → 冒泡循環（任意時長）→ 完成'):'';
 }
 const isCooking=a=>/^(12|15)_/.test(a?.file||'');
 function stop(){clearInterval(timer);timer=null;$('#play-animation').textContent=isCooking(current)?'開始冒泡循環 / Start loop':'播放動畫 / Play'}
 function open(asset){
  stop();current=asset;
  const root=asset.file.split('/').slice(0,2).join('/');
  sequence=asset.file.startsWith('08_')?assets.filter(a=>a.file.split('/').slice(0,-1).join('/')===asset.file.split('/').slice(0,-1).join('/')):isCooking(asset)?assets.filter(a=>a.file.startsWith(root+'/loop/')):[];
  $('#animation-controls').hidden=!sequence.length;
  $('#stage-controls').hidden=!isCooking(asset)||!sequence.length;
  show(asset);stop();dialog.showModal();$('#close-preview').focus();
 }
 $('#play-animation').onclick=()=>{
  if(timer){stop();return}
  $('#play-animation').textContent='暫停 / Pause';
  const fps=sequence[0]?.animation?.fps||4;
  timer=setInterval(()=>show(sequence[(sequence.indexOf(current)+1)%sequence.length]),1000/fps);
 };
 for(const [button,file] of [['raw-stage','00_raw.png'],['cooked-stage','02_cooked.png']]){
  $('#'+button).onclick=()=>{
   const root=current.file.split('/').slice(0,2).join('/');
   stop();show(assets.find(a=>a.file===root+'/'+file));
  };
 }
 $('#close-preview').onclick=()=>dialog.close();
 dialog.addEventListener('close',stop);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
 $('#search').addEventListener('input',render);$('#sort').addEventListener('change',render);render();
})();

