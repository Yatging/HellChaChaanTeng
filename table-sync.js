'use strict';
window.TableSync = (() => {
  // Both projectors use the customer screen's clock and order IDs.
  const timing = {full:1500, eating:6500, empty:1500, fade:1000};
  const duration = Object.values(timing).reduce((sum,ms)=>sum+ms,0);
  function connect(receive){
    try{
      const channel=new BroadcastChannel('hell-cha-chaan-teng:tables:v1');
      channel.onmessage=event=>receive(event.data);
      return channel;
    }catch{return null}
  }
  return {timing,duration,transfer:1800,connect};
})();
