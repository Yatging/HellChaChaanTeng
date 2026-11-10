'use strict';
function createStoveView(svg,menu){
  const ns='http://www.w3.org/2000/svg';
  const sources={macaroni:240,rice:400,egg:560,ham:720};
  const burners=[['pot-1',400,'煮鍋 1'],['pot-2',560,'煮鍋 2'],['wok',720,'炒鑊']];
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>x*x*(3-2*x);
  const blend=(a,b,t)=>a+(b-a)*t;
  const icon=(id,x=0,y=0,scale=1)=>'<use href="#stove-'+id+'" transform="translate('+x+' '+y+') scale('+scale+')"/>';
  const g=(markup,parent=svg)=>{
    const node=document.createElementNS(ns,'g');node.innerHTML=markup;parent.append(node);return node;
  };
  const seeds=Array.from({length:32},(_,i)=>{
    const angle=i*2.4,r=Math.sqrt(i)*4;
    return '<ellipse cx="0" cy="0" rx="4.1" ry="1.8" transform="translate('+Math.cos(angle)*r+' '+Math.sin(angle)*r*.72+') rotate('+i*39+')" fill="#fff1cb" stroke="#ae9671" stroke-width=".8"/>';
  }).join('');
  const elbows=[[-14,-8,-20],[3,-13,12],[15,-5,70],[-8,5,40],[10,9,-35],[-20,10,5]].map(([x,y,a])=>
    '<g transform="translate('+x+' '+y+') rotate('+a+')"><path d="M-7 -5q-1 11 6 11q7 1 8 -7" fill="none" stroke="#936c37" stroke-width="7"/><path d="M-7 -5q-1 11 6 11q7 1 8 -7" fill="none" stroke="#f8d889" stroke-width="4.8"/></g>').join('');
  const label=(y,txt)=>'<g transform="translate(0 '+y+')"><rect x="-67" y="-9" width="134" height="22" rx="5" fill="#21473d"/><text y="6" font-size="12">'+txt+'</text></g>';
  svg.innerHTML='<defs>'+
    '<radialGradient id="water"><stop stop-color="#a7d8d0"/><stop offset=".78" stop-color="#79b7b1"/><stop offset="1" stop-color="#57928a"/></radialGradient>'+
    '<radialGradient id="iron"><stop stop-color="#708a78"/><stop offset="1" stop-color="#354c43"/></radialGradient>'+
    '<g id="stove-rice">'+seeds+'</g><g id="stove-macaroni">'+elbows+'</g>'+
    '<g id="stove-cooked-rice"><path d="M-24 10q-6 -6 1 -12q-1 -7 6 -8q3 -8 11 -6q7 -7 14 0q8 -1 11 7q9 2 7 10q5 9 -7 12q-27 8 -43 -3Z" fill="#fff3d3" stroke="#a39572" stroke-width="1.6"/><path d="M-16 1l4 -2m4 -7l4 -2m9 3l4 -1m3 10l4 -2m-18 6l4 -2" stroke="#c0ab80" stroke-width="2.3" stroke-linecap="round"/></g>'+
    '<g id="stove-cooked-macaroni">'+elbows.replaceAll('#f8d889','#fff1b9').replaceAll('stroke-width="4.8"','stroke-width="6.4"')+'</g>'+
    '<g id="stove-egg"><path d="M-14 5C-17 -5 -6 -24 1 -23C11 -22 20 -5 15 7Q8 24 -6 18Q-13 15 -14 5Z" fill="#d7a776" stroke="#684f3c" stroke-width="2"/><path d="M-9 0q0 -8 5 -13" fill="none" stroke="#ffe2b2" stroke-width="2.5"/></g>'+
    '<g id="stove-boiled"><ellipse rx="22" ry="15" transform="rotate(-28)" fill="#fff3d6" stroke="#827e61" stroke-width="2"/><ellipse rx="10" ry="9" fill="#ecb43b"/></g>'+
    '<g id="stove-scrambled"><path d="M-27 3q-5 -12 7 -14q5 -11 15 -5q10 -8 18 1q17 -1 16 13q7 12 -9 14q-9 8 -18 1q-12 7 -18 -1q-10 1 -11 -9Z" fill="#f5bf4d" stroke="#9c762c" stroke-width="2"/><path d="M-19 0q6 -7 12 -3m9 5q5 -7 12 -4" fill="none" stroke="#ffe4a0" stroke-width="3"/></g>'+
    '<g id="stove-ham"><path d="M-25 -5l37 -13q5 -2 8 2l8 13q2 5 -3 7l-39 12q-5 1 -7 -4l-7 -11Z" fill="#e79d91" stroke="#8c6359" stroke-width="2"/><path d="M-20 -3l32 -12" stroke="#ffd1b4" stroke-width="2"/></g>'+
    '<g id="stove-cooked-ham">'+icon('ham')+'<path d="M-11 4l11 -4m-3 8l14 -5" stroke="#ba7660" stroke-width="2"/></g></defs>';
  const guide=g('');
  guide.setAttribute('class','alignment');
  for(let i=0;i<4;i++)g('<rect x="'+(164+i*160)+'" y="5" width="152" height="149" rx="6" fill="none" stroke="#97ac9d" stroke-dasharray="5 7"/>',guide);
  for(const [id,y] of Object.entries(sources)){
    const group=g('<rect x="-66" y="-57" width="132" height="113" rx="13" fill="#f8efd7" stroke="#436754" stroke-width="3"/><rect x="-59" y="-50" width="118" height="99" rx="10" fill="none" stroke="#bdc9ad" stroke-width="2"/>'+icon(id,0,-6,1.8)+label(58,TeaMenu.stock[id].join(' / ')));
    group.setAttribute('transform','translate(880 '+y+')');
  }
  const nodes=burners.map(([id,y,name])=>{
    const wok=id==='wok';
    const handles=wok?'<path d="M42 -37l26 -24q7 -5 12 3q3 4 -1 9l-29 24" fill="#c28c5b" stroke="#344e43" stroke-width="4"/>':
      '<path d="M-53 -14h-12q-13 0 -12 15q0 13 13 13h12m105 -28h12q13 0 12 15q0 13 -13 13h-12" fill="none" stroke="#597669" stroke-width="7"/>';
    const pot=g(handles+'<circle r="60" fill="#d8dfc8" stroke="#2b4a3c" stroke-width="4"/><circle r="53" fill="url(#'+(wok?'iron':'water')+')" stroke="#486e60" stroke-width="3"/><path d="M-46 -14a49 49 0 0 1 32 -32" fill="none" stroke="#e6efcc" stroke-width="2"/><g class="inside"></g>'+label(71,name+' / '+(wok?'Wok':'Pot')));
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
  function cooked(item){return ['ham','rice','macaroni'].includes(item)?'cooked-'+item:item}
  function raw(item){return ['boiled','scrambled'].includes(item)?'egg':item}
  function pieces(item,qty){return qty===2?icon(item,-9,-7)+icon(item,9,7):icon(item)}
  function showBurner(n,s,at,now,mode){
    const t=s?.task,missing=mode==='sensor'&&!s?.present;
    n.pot.style.opacity=missing?'.55':'1';
    n.tag.style.display=t||missing?'':'none';
    const msg=missing?'放回鍋具':t?'枱 '+String(t.slot).padStart(2,'0'):'';
    const text=n.tag.lastElementChild;if(text.textContent!==msg)text.textContent=msg;
    if(!t){n.pot.dataset.phase='idle';stamp(n.inside,'idle','');stamp(n.motion,'idle','');return}
    const p=clamp((t.elapsed+(s.running?Math.max(0,now-at):0))/t.duration);
    const input=raw(t.item),done=cooked(t.item),key=t.orderId+'-'+t.item;
    n.pot.dataset.phase=p<.23?'loading':p<.84?'cooking':'unloading';
    const bubbles=Array.from({length:8},(_,i)=>'<circle cx="'+(Math.cos(i*2.4)*(25+i%3*6))+'" cy="'+(Math.sin(i*2.4)*29)+'" fill="none" stroke="#fff9de" stroke-width="1.8"/>').join('');
    stamp(n.inside,key,'<g class="heat"><circle r="49" fill="'+(n.wok?'#a57a49':'#d6edc3')+'"/><g>'+bubbles+'</g></g><g class="raw">'+pieces(input,t.quantity)+'</g><g class="done">'+pieces(done,t.quantity)+'</g>');
    const [heat,uncooked,cookedGroup]=n.inside.children;
    const cook=clamp((p-.23)/.56),inPan=p>=.23&&p<.84;
    n.inside.style.display=inPan?'':'none';
    heat.firstElementChild.setAttribute('opacity',String(cook*.36));
    for(const [i,bubble] of Array.from(heat.lastElementChild.children).entries()){
      const cycle=(p*8+i*.39)%1;bubble.setAttribute('r',String(.5+cycle*(n.wok?2:5)));
      bubble.setAttribute('opacity',String(Math.sin(cycle*Math.PI)*cook));
    }
    uncooked.setAttribute('opacity',String(1-cook));cookedGroup.setAttribute('opacity',String(cook));
    position(uncooked,0,0,1+.12*cook);
    cookedGroup.setAttribute('transform','rotate('+Math.sin(p*20)*(n.wok?12:3)+') scale('+(1.18+.32*cook)+')');
    n.motion.style.display=inPan?'none':'';
    if(inPan)return;
    const entering=p<.23;
    stamp(n.motion,key+(entering?'in':'out'),pieces(entering?input:done,t.quantity));
    const f=ease(clamp(entering?p/.23:(p-.84)/.16));
    const x=entering?blend(880,80,f):blend(80,222,f);
    const y=entering?blend(sources[input],n.y,f):blend(n.y,slotY(t.slot),f);
    position(n.motion,x,y-30*Math.sin(Math.PI*f),1.15);
  }
  function paint(k,records,now){
    for(const n of nodes)showBurner(n,k?.stations.find(s=>s.id===n.id),k?.at,now,k?.mode);
    for(let i=0;i<4;i++){
      const tray=trays[i],r=records[i],order=menu.get(r?.combination);
      const travel=r?.state==='satisfied'&&now<r.servedAt;
      const finished=k?.ready.includes(r?.orderId);
      const done=k?.portions.find(t=>t.orderId===r?.orderId)?.done||[];
      if(!order||(!travel&&(!done.length||r.state!=='waiting'))){tray.node.style.display='none';continue}
      tray.node.style.display='';
      const plated=finished||travel,key=r.orderId+'-'+(plated?'full':done.join('-'));
      if(tray.key!==key){
        tray.key=key;tray.node.replaceChildren();
        if(plated)tray.node.append(svgImg(MenuArt.serving(order),order.beverage?160:96,96));
        else tray.node.innerHTML='<ellipse rx="43" ry="20" fill="#fff2d5" stroke="#466757" stroke-width="2"/>'+
          done.map((item,j)=>icon(cooked(item),-8+j*12,-3,.75)).join('');
      }
      const t=travel?ease(clamp(1-(r.servedAt-now)/TableSync.transfer)):0;
      position(tray.node,blend(222,240+i*160,t),blend(slotY(i+1),80,t)-20*Math.sin(Math.PI*t),blend(.83,1,t));
    }
  }
  return {paint};
}

