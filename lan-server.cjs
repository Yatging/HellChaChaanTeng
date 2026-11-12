'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const root=__dirname,port=Number(process.env.PORT||8080);
const clients=new Map();
let owner=null;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
function broadcast(message,except){
  const payload='data: '+JSON.stringify(message)+'\n\n';
  for(const [id,response] of clients)if(id!==except)response.write(payload);
}
function launchPage(){
  const ips=Object.values(os.networkInterfaces()).flat().filter(i=>i.family==='IPv4'&&!i.internal).map(i=>i.address);
  return '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>地獄茶記 · 局域網</title><style>body{font:18px/1.7 system-ui;background:#fff5df;color:#21473d;max-width:900px;margin:40px auto;padding:24px}a{color:inherit}li{margin:14px 0}code{background:#eee6ce;padding:5px}</style><h1>三路投影 · LAN</h1><p>所有電腦連到同一網絡。只開一個顧客頁作為控制端，保持視窗運行。三台電腦各開下列一個投影頁。</p><p>其他電腦的入口</p>'+ips.map(ip=>'<p><code>http://'+ip+':'+port+'/</code></p>').join('')+'<ol><li><a target="_blank" href="/index.html?lan=1">顧客與控制 / Customers & control</a></li><li><a target="_blank" href="/tables.html?lan=1&view=stove&projection">投影 1 · 左側灶台</a></li><li><a target="_blank" href="/tables.html?lan=1&view=tables&projection">投影 2 · 上方四桌</a></li><li><a target="_blank" href="/tables.html?lan=1&view=ingredients&projection">投影 3 · 右側原料</a></li></ol><p><a href="/tables.html?lan=1">完整布局</a> · <a href="/menu.html?lan=1">餐牌</a></p>';
}
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  res.setHeader('Cache-Control','no-store');
  if(url.pathname==='/sync/events'&&req.method==='GET'){
    const id=url.searchParams.get('client');
    if(!id||id.length>100){res.writeHead(400);res.end();return}
    clients.get(id)?.end();
    res.writeHead(200,{'Content-Type':'text/event-stream','Connection':'keep-alive'});
    res.write(': connected\n\n');clients.set(id,res);
    req.on('close',()=>{if(clients.get(id)===res)clients.delete(id);if(owner===id)owner=null});
    return;
  }
  if(url.pathname==='/sync/send'&&req.method==='POST'){
    if(req.headers.origin && req.headers.origin!=='http://'+req.headers.host){res.writeHead(403);res.end();return}
    let body='',size=0;
    req.on('data',chunk=>{size+=chunk.length;if(size>65536){req.destroy();return}body+=chunk});
    req.on('end',()=>{
      try{
        const {client,message}=JSON.parse(body);
        if(!clients.has(client)||!message||!['tables','request','judge','vessel','kitchen-mode'].includes(message.type))throw Error();
        if(message.type==='tables'){
          if(owner&&owner!==client){res.writeHead(409);res.end();return}
          owner=client;
        }
        broadcast(message,client);res.writeHead(204);res.end();
      }catch{res.writeHead(400);res.end()}
    });return;
  }
  if(req.method!=='GET'){res.writeHead(405);res.end();return}
  if(url.pathname==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(launchPage());return}
  let file;
  try{file=path.resolve(root,'.'+decodeURIComponent(url.pathname))}catch{res.writeHead(400);res.end();return}
  const relative=path.relative(root,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||!types[path.extname(file)]){res.writeHead(404);res.end();return}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404);res.end();return}
    res.setHeader('Content-Type',types[path.extname(file)]);res.end(data);
  });
});
setInterval(()=>{for(const response of clients.values())response.write(': heartbeat\n\n')},5000).unref();
server.listen(port,'0.0.0.0',()=>{
  console.log('Open http://localhost:'+port+'/');
  for(const info of Object.values(os.networkInterfaces()).flat())if(info.family==='IPv4'&&!info.internal)console.log('Other computers: http://'+info.address+':'+port+'/');
});
server.on('error',error=>{console.error(error.message);process.exitCode=1});

