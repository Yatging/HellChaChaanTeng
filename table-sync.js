'use strict';
window.TableSync = (() => {
  const timing={full:1500,eating:6500,empty:1500,fade:1000};
  const duration=Object.values(timing).reduce((sum,ms)=>sum+ms,0);
  const lan=new URLSearchParams(location.search).has('lan');
  if(lan)document.querySelectorAll('a[href]').forEach(a=>{
    const url=new URL(a.href);if(url.origin===location.origin){url.searchParams.set('lan','1');a.href=url}
  });
  function connect(receive){
    if(lan){
      const client=crypto.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
      const events=new EventSource('/sync/events?client='+client);
      events.onmessage=event=>{try{receive(JSON.parse(event.data))}catch(error){console.error(error)}};
      let connected=false;
      events.onopen=()=>{connected=true;send({type:'request'})};
      events.onerror=()=>{connected=false};
      let outgoing=Promise.resolve();
      function send(message){
        if(!connected)return;
        const body=JSON.stringify({client,message});
        outgoing=outgoing.then(()=>fetch('/sync/send',{method:'POST',headers:{'Content-Type':'application/json'},body,signal:AbortSignal.timeout(4000)})).catch(()=>{});
      }
      return {postMessage:send};
    }
    try{
      const channel=new BroadcastChannel('hell-cha-chaan-teng:tables:v1');
      channel.onmessage=event=>receive(event.data);
      return channel;
    }catch{return null}
  }
  return {timing,duration,transfer:1800,connect};
})();

