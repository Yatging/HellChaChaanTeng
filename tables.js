'use strict';
(()=>{
  const menu=new Map(TeaMenu.orders.map(o=>[o.key,o]));
  const stage=document.querySelector('.stage'),status=document.querySelector('#connection');
  const stove=createStoveView(document.querySelector('.kitchen'),menu);
  let kitchen=null;
  const lanes=Array.from({length:4},(_,i)=>{
    const node=document.createElement('article');
    node.className='lane';
    node.innerHTML='<div class="setting"></div><span class="table-label"></span>';
    stage.append(node);
    return {slot:i+1,setting:node.firstChild,label:node.lastChild,record:null,drawn:null};
  });
  let host=null,hostSince=0,lastSeen=0,autoServe=true;
  const channel=TableSync.connect(message=>{
    if(message?.type!=='tables'||!Array.isArray(message.tables)||message.tables.length!==4)return;
    // Convert the host clock into this computer's local timeline.
    const offset=Number.isFinite(message.sentAt)?Date.now()-message.sentAt:0;
    message.tables=message.tables.map(r=>({...r,dueAt:r.dueAt+offset,servedAt:r.servedAt==null?null:r.servedAt+offset}));
    if(message.kitchen)message.kitchen={...message.kitchen,at:message.kitchen.at+offset};
    if(host && message.host!==host && message.hostSince<=hostSince)return;
    host=message.host;hostSince=message.hostSince;lastSeen=performance.now();autoServe=message.autoServe;
    kitchen=message.kitchen??null;
    for(const lane of lanes)lane.record=message.tables.find(r=>r.slot===lane.slot)??null;
    status.textContent='已連接顧客頁 / Connected';
    paint();
  });
  function request(){channel?.postMessage({type:'request'})}
  function setLabel(lane,state){
    const text='枱 '+String(lane.slot).padStart(2,'0')+' · '+state;
    if(lane.label.textContent!==text)lane.label.textContent=text;
  }
  function clear(lane){
    if(lane.drawn!==null){lane.setting.replaceChildren();lane.setting.removeAttribute('aria-label');lane.drawn=null}
  }
  const {full,eating,empty,fade}=TableSync.timing;
  function paint(){
    const now=Date.now();
    if(host && performance.now()-lastSeen>9000){
      host=null;hostSince=0;kitchen=null;
      for(const lane of lanes)lane.record=null;
      status.textContent='等待顧客頁 / Waiting for customer screen';
    }
    stove.paint(kitchen,lanes.map(l=>l.record),now);
    for(const lane of lanes){
      const r=lane.record,order=menu.get(r?.combination);
      const elapsed=r?.servedAt==null?Infinity:Math.max(0,now-r.servedAt);
      if(!order || r.state!=='satisfied' || now<r.servedAt || elapsed>=TableSync.duration){
        clear(lane);
        let label='空枱 / Clear';
        if(!host)label='未連接 / Offline';
        else if(r?.state==='waiting')label=autoServe?'等上菜 '+Math.max(0,Math.ceil((r.dueAt-now)/1000))+'s':'待判定 / Waiting';
        if(r?.state==='satisfied'&&now<r.servedAt)label='送餐中 / Serving';
        setLabel(lane,label);continue;
      }
      if(lane.drawn!==r.orderId){
        lane.setting.innerHTML=MenuArt.tableSetting(order,lane.slot);
        lane.setting.setAttribute('aria-label',order.english);
        lane.bite=lane.setting.querySelector('.bite-edge');
        lane.level=lane.setting.querySelector('.drink-level');
        lane.drawn=r.orderId;
      }
      const progress=Math.max(0,Math.min(1,(elapsed-full)/eating));
      // Eight bites with a brief pause between bites. The dish itself stays still.
      const step=progress*8,phase=Math.min(1,(step%1)*2.4);
      const eaten=(Math.floor(step)+phase*phase*(3-2*phase))/8;
      lane.bite.setAttribute('transform','translate('+(-16+234*eaten)+' 0)');
      lane.level.setAttribute('y',String(progress*180));
      const fadeOut=Math.max(0,(elapsed-full-eating-empty)/fade);
      lane.setting.style.opacity=String(1-fadeOut);
      setLabel(lane,progress===1?'空餐具 / Finished':progress>0?'用餐中 / Eating':'已上菜 / Served');
    }
  }
  // The host validates the ID again before accepting a physical controller's result.
  window.ChaChaanTables={
    orders:()=>lanes.filter(l=>l.record?.state==='waiting').map(l=>({...l.record})),
    judge(orderId,matched){
      if(!channel||!host||typeof matched!=='boolean'||!lanes.some(l=>l.record?.orderId===orderId && l.record.state==='waiting'))return false;
      channel.postMessage({type:'judge',host,orderId,matched});return true;
    }
  };
  window.ChaChaanKitchen={
    state:()=>kitchen?structuredClone(kitchen):null,
    setMode(mode){
      if(!host||!['demo','sensor'].includes(mode))return false;
      channel.postMessage({type:'kitchen-mode',host,mode});return true;
    },
    setVesselPresent(stationId,present){
      if(!host||!['pot-1','pot-2','wok'].includes(stationId)||typeof present!=='boolean')return false;
      channel.postMessage({type:'vessel',host,stationId,present});return true;
    }
  };
  window.addEventListener('cct:vessel',({detail})=>window.ChaChaanKitchen.setVesselPresent(detail?.stationId,detail?.present));
  if(!channel)status.textContent='請用同一瀏覽器開啟兩個 HTTPS 頁面 / Open both HTTPS pages in one browser';
  request();setInterval(request,1800);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)request()});
  function animate(){paint();requestAnimationFrame(animate)}
  animate();
  function clean(){document.body.classList.toggle('clean')}
  function fullscreen(){
    const result=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
    result.catch(()=>{document.querySelector('#fullscreen').textContent='請按 F11'});
  }
  document.querySelector('#hide').onclick=clean;
  document.querySelector('#fullscreen').onclick=fullscreen;
  window.addEventListener('keydown',event=>{
    if(event.repeat||event.ctrlKey||event.altKey||event.metaKey)return;
    if(event.key.toLowerCase()==='f')fullscreen();
    if(event.key.toLowerCase()==='h')clean();
  });
  if(new URLSearchParams(location.search).has('projection'))clean();
})();

