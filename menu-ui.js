'use strict';
const {sets,drinks,temperatures,styles,preparations,modifiers,options,orders,beverages,stock}=TeaMenu;
function element(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text)node.textContent=text;
  return node;
}
function fillSelect(select,ids,labels){
  const previous=select.value;
  select.replaceChildren(...ids.map(id=>new Option(labels[id].join(' / '),id)));
  if(ids.includes(previous))select.value=previous;
}
function downloadButton(getAsset,label='↓ 下載 / Save PNG'){
  const button=element('button','art-save',label);
  button.type='button';
  button.onclick=async()=>{
    const {src,key}=getAsset();
    button.disabled=true;
    try{
      const img=new Image();img.src=src;await img.decode();
      const canvas=document.createElement('canvas');
      canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
      canvas.getContext('2d').drawImage(img,0,0);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!blob)throw Error('PNG export failed');
      const url=URL.createObjectURL(blob),link=element('a');
      link.href=url;link.download=key+'.png';document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      button.textContent=label;
    }catch{button.textContent='重試下載 / Retry PNG'}
    finally{button.disabled=false}
  };
  return button;
}
function figure(src,zh,en,getAsset){
  const fig=element('figure','asset'),img=element('img');
  img.loading='lazy';img.src=src;img.alt=zh+' / '+en;img.width=768;img.height=768;
  const foot=element('figcaption','asset-foot'),caption=element('div');
  caption.append(element('b','',zh),element('small','',en));foot.append(caption);
  if(getAsset)foot.append(downloadButton(getAsset));
  fig.append(img,foot);return fig;
}
function portions(order){
  const items=[];
  if(order.ingredients.macaroni)items.push('熟通粉 / Cooked macaroni ×1');
  if(order.ingredients.rice)items.push('白飯 / Cooked rice ×1');
  items.push('火腿 / Ham ×'+order.ingredients.ham);
  if(order.eggStyle)items.push(order.eggStyle==='boiled'?'烚蛋 / Boiled egg ×1':'炒蛋 / Scrambled egg ×1');
  return items.join(' · ');
}
const prepNotes={
  condensed:'茶走用煉奶代替淡奶和砂糖。 / Sweetened condensed milk replaces evaporated milk and sugar.',
  black:'飛沙走奶即咖啡走糖、走奶。 / Black coffee without sugar or milk.',
  extraLemon:'多加檸檬片。 / Extra slices of lemon.'
};
for(const set of sets){
  const card=document.querySelector('#set-card').content.firstElementChild.cloneNode(true);
  const find=s=>card.querySelector(s);
  find('.letter').textContent=set.code;find('h2').textContent=set.zh;find('.en').textContent=set.en;
  const variants=orders.filter(o=>o.setCode===set.code);
  find('.recipe').textContent=portions(variants[0])+(set.drink?' · 配飲品 / Choice of drink':'');
  const mod=find('.modifier'),drink=find('.drink'),temp=find('.temperature'),prep=find('.prep');
  fillSelect(mod,options(set),modifiers);
  fillSelect(drink,Object.keys(drinks),drinks);
  fillSelect(temp,Object.keys(temperatures),temperatures);
  drink.parentElement.hidden=!set.drink;
  const preview=element('figure','asset meal-art'),img=element('img'),foot=element('figcaption','save-row');
  let current;
  const full=downloadButton(()=>({src:img.src,key:current.key}),'↓ 下載此組合 / Save order PNG');
  foot.append(full);
  if(set.drink){
    foot.append(downloadButton(()=>({src:MenuArt.food(current),key:'set-'+set.code.toLowerCase()+'_'+current.modifier}),'餐點 / Dish PNG'));
    foot.append(downloadButton(()=>({src:MenuArt.drink(current.beverage),key:current.beverage.key}),'飲品 / Drink PNG'));
  }
  preview.append(img,foot);find('.ticket').after(preview);
  function update(refreshStyles=false){
    if(refreshStyles)fillSelect(prep,styles[drink.value],preparations);
    const custom=set.drink && drink.value!=='water';
    temp.parentElement.hidden=true;prep.parentElement.hidden=!custom;
    current=variants.find(o=>o.modifier===mod.value && o.drink===(set.drink?drink.value:null)
      && o.temperature===(custom?temp.value:null) && o.drinkPrep===(set.drink?prep.value:null));
    img.src=MenuArt.serving(current);img.alt=current.english;
    preview.dataset.order=current.key;
    const note=find('.style-note');note.textContent=prepNotes[current.drinkPrep]||'';note.hidden=!note.textContent;
    find('.ticket strong').textContent=current.text;find('.ticket [lang=en]').textContent=current.english;
    find('.quantities').textContent=portions(current);
  }
  drink.onchange=()=>update(true);
  mod.onchange=temp.onchange=prep.onchange=()=>update();
  update(true);document.querySelector('.grid').append(card);
}
for(const b of beverages){
  const src=MenuArt.drink(b);
  document.querySelector('#drinks .gallery').append(figure(src,b.zh,b.en,()=>({src,key:b.key})));
}
for(const [key,names] of Object.entries({...stock,pot:['煮鍋','Boiling pot'],wok:['炒鑊','Wok']})){
  const url='assets/'+key+'.png',fig=figure(url,...names);
  const a=element('a','','↓ 下載 / Save PNG');a.download=key+'.png';a.href=url;a.setAttribute('aria-label',names.join(' / ')+' PNG');
  fig.querySelector('figcaption').append(a);
  if(key==='pot')fig.append(element('p','note','×2 · 烚通粉、煮飯、烚蛋 / Boil macaroni, rice or eggs.'));
  if(key==='wok')fig.append(element('p','note','×1 · 用鑊鏟炒蛋 / Scramble eggs with the spatula.'));
  document.querySelector('#textures .gallery').append(fig);
}
const gallery=document.querySelector('#combinations');
document.querySelector('#total').textContent=orders.length+' 款 / combinations';
for(const set of sets){
  const variants=orders.filter(o=>o.setCode===set.code);
  const title=element('h3','set-heading',set.code+'餐 / Set '+set.code+' · '+set.zh+' / '+set.en);
  title.id='combinations-'+set.code.toLowerCase();
  const jump=element('a','',set.code+' ('+variants.length+')');jump.href='#'+title.id;gallery.querySelector('.jump').append(jump);
  const grid=element('div','collection');
  for(const o of variants){
    const src=MenuArt.serving(o);
    const fig=figure(src,[o.requestZh,o.beverage?.zh].filter(Boolean).join(' · '),
      [o.requestEn,o.beverage?.en].filter(Boolean).join(' · '),()=>({src,key:o.key}));
    fig.dataset.order=o.key;grid.append(fig);
  }
  gallery.append(title,grid);
}

