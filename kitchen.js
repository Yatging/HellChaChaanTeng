'use strict';
function createKitchen(clock=Date.now){
  const stations=['pot-1','pot-2','wok'].map(id=>({id,present:false,job:null}));
  const tickets=new Map();
  let mode='demo',time=clock();
  const canHeat=s=>mode==='demo'||s.present;
  function assign(){
    for(const s of stations){
      if(s.job||!canHeat(s))continue;
      const type=s.id==='wok'?'wok':'pot';
      const next=[...tickets.values()].filter(t=>t.steps[t.index]?.station===type && !stations.some(other=>other.job===t))
        .sort((a,b)=>a.queued-b.queued||a.slot-b.slot)[0];
      if(next)s.job=next;
    }
  }
  function advance(until=clock()){
    assign();
    while(time<until){
      const heating=stations.filter(s=>s.job&&canHeat(s));
      if(!heating.length){time=until;break}
      const delta=Math.min(until-time,...heating.map(({job})=>job.steps[job.index].ms-job.elapsed));
      time+=delta;
      for(const s of heating){
        const job=s.job;job.elapsed+=delta;
        if(job.elapsed>=job.steps[job.index].ms){
          job.index++;job.elapsed=0;job.queued=time;s.job=null;
        }
      }
      assign();
    }
  }
  function add(id,slot,order){
    advance();
    const steps=[];
    if(order.ingredients.macaroni)steps.push({item:'macaroni',station:'pot',ms:8200});
    if(order.ingredients.rice)steps.push({item:'rice',station:'pot',ms:9200});
    if(order.eggStyle==='boiled')steps.push({item:'boiled',station:'pot',ms:6800});
    if(order.eggStyle==='scrambled')steps.push({item:'scrambled',station:'wok',ms:6200});
    steps.push({item:'ham',station:'wok',ms:order.ingredients.ham===2?4600:3500});
    tickets.set(id,{id,slot,steps,index:0,elapsed:0,queued:time,ham:order.ingredients.ham});assign();
  }
  function remove(id){
    advance();
    for(const s of stations)if(s.job?.id===id)s.job=null;
    tickets.delete(id);assign();
  }
  function ready(id){const job=tickets.get(id);return !!job&&job.index===job.steps.length}
  function snapshot(){
    return {mode,at:time,stations:stations.map(s=>{
      const t=s.job,step=t?.steps[t.index];
      return {id:s.id,present:s.present,running:!!t&&canHeat(s),task:t?{
        orderId:t.id,slot:t.slot,item:step.item,duration:step.ms,elapsed:t.elapsed,quantity:step.item==='ham'?t.ham:1
      }:null};
    }),portions:[...tickets.values()].map(t=>({orderId:t.id,slot:t.slot,done:t.steps.slice(0,t.index).map(step=>step.item)})),ready:[...tickets.keys()].filter(ready)};
  }
  function setMode(value){
    if(!['demo','sensor'].includes(value))return false;
    advance();mode=value;assign();return true;
  }
  function setVesselPresent(id,present){
    const station=stations.find(s=>s.id===id);
    if(!station||typeof present!=='boolean')return false;
    advance();station.present=present;assign();return true;
  }
  return {add,remove,advance,ready,snapshot,setMode,setVesselPresent};
}

