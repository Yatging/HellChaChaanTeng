'use strict';
function createStoveView(svg,menu){
  const ns='http://www.w3.org/2000/svg';
  const sources={macaroni:240,rice:400,egg:560,ham:720};
  const burners=[['pot-1',400,'煮鍋 1'],['pot-2',560,'煮鍋 2'],['wok',720,'炒鑊']];
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>x*x*(3-2*x);
  const blend=(a,b,t)=>a+(b-a)*t;
  const label=(y,txt)=>'<g transform="translate(0 '+y+')"><rect x="-67" y="-9" width="134" height="22" rx="5" fill="#21473d"/><text y="6" font-size="12">'+txt+'</text></g>';
  const recipes={boiled:'pot_egg',rice:'pot_rice',macaroni:'pot_macaroni',scrambled:'wok_scrambled',ham:'wok_ham'};
  const sprite=(src,size)=>'<image href="'+src+'" width="'+size+'" height="'+size+'" x="'+(-size/2)+'" y="'+(-size/2)+'"/>';
  const g=(markup,parent=svg)=>{
    const node=document.createElementNS(ns,'g');
    node.innerHTML=markup;parent.append(node);return node;
  };
  const guide=g('');
  guide.setAttribute('class','alignment');
  for(let i=0;i<4;i++)g('<rect x="'+(164+i*160)+'" y="5" width="152" height="149" rx="6" fill="none" stroke="#97ac9d" stroke-dasharray="5 7"/>',guide);
  for(const [id,y] of Object.entries(sources)){
    const group=g(sprite(MenuArt.tray(id),145)+label(58,TeaMenu.stock[id].join(' / ')));
    group.setAttribute('transform','translate(880 '+y+')');
  }
  const nodes=burners.map(([id,y,name])=>{
    const wok=id==='wok';
    const pot=g('<g class="inside"></g>'+label(71,name+' / '+(wok?'Wok':'Pot')));
    pot.setAttribute('transform','translate(80 '+y+')');pot.dataset.station=id;
    const motion=g(''),tag=g('<rect x="-42" y="-10" width="84" height="20" rx="10" fill="#994a38"/><text y="4" font-size="11"></text>');
    tag.setAttribute('transform','translate(80 '+(y-51)+')');
    return {id,y,wok,pot,inside:pot.querySelector('.inside'),motion,tag};
  });
  const trays=Array.from({length:4},()=>({node:g('')}));
  const slotY=slot=>270+(slot-1)*129;
  const svgImg=(src,w,h)=>{const img=document.createElementNS(ns,'image');img.setAttribute('href',src);
    for(const [attr,value] of Object.entries({x:-w/2,y:-h/2,width:w,height:h}))img.setAttribute(attr,value);return img};
  function stamp(node,key,markup){
    if(node.dataset.key!==key){node.innerHTML=markup;node.dataset.key=key}
  }
  function position(node,x,y,scale=1){node.setAttribute('transform','translate('+x+' '+y+') scale('+scale+')')}
  function showBurner(n,s,k,now){
    const at=k?.at,mode=k?.mode;
    const t=s?.task,missing=mode==='sensor'&&!s?.present;
    const previous=n.active;
    if(previous && (previous.orderId!==t?.orderId||previous.item!==t?.item)){
      const portion=k?.portions.find(p=>p.orderId===previous.orderId);
      if(portion?.done.includes(previous.item))n.finish={task:previous,at:now};
    }
    n.active=t;
    n.pot.style.opacity=missing?'.55':'1';
    n.tag.style.display=t||missing?'':'none';
    const msg=missing?'放回鍋具':t?'枱 '+String(t.slot).padStart(2,'0'):'';
    const text=n.tag.lastElementChild;if(text.textContent!==msg)text.textContent=msg;
    if(n.finish && k?.portions.some(p=>p.orderId===n.finish.task.orderId)){
      const f=clamp((now-n.finish.at)/850),finished=n.finish.task;
      if(f<1){
        const img=MenuArt.cooking(recipes[finished.item],'02_cooked');
        stamp(n.inside,img,sprite(img,144));
        const plate=MenuArt.single(finished.item);
        stamp(n.motion,plate,sprite(plate,72));n.motion.style.display=f<.32?'none':'';
        const move=ease(clamp((f-.32)/.68));
        position(n.motion,blend(80,240+(finished.slot-1)*160,move),blend(n.y,80,move)-30*Math.sin(Math.PI*move));
        n.pot.dataset.phase='unloading';return;
      }
    }
    n.finish=null;
    if(!t){
      n.pot.dataset.phase='idle';
      stamp(n.inside,'idle',n.wok?'':sprite(MenuArt.cooking('','water_only'),144));
      stamp(n.motion,'idle','');return;
    }
    const p=clamp((t.elapsed+(s.running?Math.max(0,now-at):0))/t.duration);
    const recipe=recipes[t.item],elapsed=p*t.duration;
    const entering=p<.16;
    n.pot.dataset.phase=entering?'loading':'cooking';
    const frame=Math.floor(elapsed/125)%16;
    const stage=entering?'00_raw':'loop/frame_'+String(frame).padStart(2,'0');
    const surface=MenuArt.cooking(recipe,stage);
    stamp(n.inside,surface,sprite(surface,144));
    n.motion.style.display='none';
  }
  function paint(k,records,now){
    for(const n of nodes)showBurner(n,k?.stations.find(s=>s.id===n.id),k,now);
    for(let i=0;i<4;i++){
      const tray=trays[i],r=records[i],order=menu.get(r?.combination);
      const travel=r?.state==='satisfied'&&now<r.servedAt;
      const finished=k?.ready.includes(r?.orderId);
      if(!order||(!travel&&(!finished||r.state!=='waiting'))){tray.node.style.display='none';continue}
      tray.node.style.display='';
      const key=r.orderId;
      if(tray.key!==key){
        tray.key=key;tray.node.replaceChildren();
        tray.node.append(svgImg(MenuArt.serving(order),order.beverage?160:96,96));
      }
      const t=travel?ease(clamp(1-(r.servedAt-now)/TableSync.transfer)):0;
      position(tray.node,blend(222,240+i*160,t),blend(slotY(i+1),80,t)-20*Math.sin(Math.PI*t),blend(.83,1,t));
    }
  }
  return {paint};
}

