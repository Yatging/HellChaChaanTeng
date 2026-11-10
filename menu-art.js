'use strict';
window.MenuArt=(()=>{
const ink = '#263f36';
function path(d, fill='none', stroke=ink, width=2) {
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function oval(x,y,rx,ry,fill,stroke=ink,width=2) {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}
const place=(art,x,y,scale,angle=0)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">${art}</g>`;
const plate=oval(110,123,94,43,'#94ac95')+oval(110,118,95,43,'#fff2d6')+oval(110,118,84,34,'#ede5c9','#688578',1.5);
const eggs=path('M-41 8Q-49 0 -37 -7Q-39 -17 -24 -16Q-18 -28 -4 -20Q5 -28 16 -17Q34 -19 34 -8Q47 -8 43 3Q52 11 38 17Q30 26 17 21Q6 30 -4 24Q-19 29 -25 19Q-39 20 -41 8Z','#f0bd4f')
+path('M-34 -4Q-28 -13 -19 -9Q-14 -18 -3 -13M5 -10Q16 -18 24 -9M-8 3Q-1 -7 10 -2M-28 8Q-16 4 -12 12M10 12Q19 6 27 9','none','#ffe598',5)
+path('M-39 5q5 9 15 7M-3 16q7 4 15 0M26 0q9 3 13 -2','none','#c68d33',2);
const ham=path('M-35 -9Q-40 -17 -29 -21L21 -31Q29 -32 34 -27L43 -13Q47 -6 37 -3L-16 11Q-24 13 -28 5Z','#db8d82')
+path('M-37 -14Q-40 -21 -29 -25L21 -35Q29 -36 34 -31L42 -18Q46 -11 36 -8L-16 6Q-24 8 -28 0Z','#f0ad9b')
+path('M-31 -17q1 -4 8 -5l41 -9','none','#ffe1c2',2);
const pasta=path('M-12 -6Q-10 9 1 9Q10 9 14 -3L8 -7Q3 3 0 2Q-4 2 -4 -8Z','#f6d58d','#8b7044',1.3)+oval(-8,-7,4,2,'#af8650','#8b7044',1)+oval(11,-5,3.5,1.8,'#ad804c','#8b7044',1);
function soup(egg,extraHam){
  const bowl=path('M21 104Q28 147 77 159L82 167Q112 175 141 166L145 159Q188 145 198 105Z','#c0d6bd')
    +path('M30 118Q106 160 190 118M43 134Q104 166 178 136','none','#5b8979',3)
    +oval(110,102,89,34,'#fff3d8')+oval(110,103,82,27,'#deb578','#64775f',1.4);
  const noodles=[[58,97,20],[81,88,-16],[107,90,18],[137,88,-12],[163,98,16],[49,108,20],[72,115,-15],[97,120,7],[122,118,-20],[147,112,15],[173,109,-10]]
    .map(([x,y,a])=>place(pasta,x,y,.74,a)).join('');
  const strips=[[-2,0],[4,7],[10,13]].map(([x,y])=>place(path('M-30 -3L26 -8L32 -2L-25 4Z','#efaa99','#a56359',1.3),86+x,91+y,1,-12)).join('');
  return bowl+noodles+strips+(extraHam?place(strips,36,41,.8):'')+(egg?place(egg,141,96,.58):'');
}
const rice=path('M-43 17Q-49 12 -43 3Q-43 -5 -36 -7Q-35 -17 -25 -18Q-22 -28 -12 -25Q-3 -35 7 -28Q18 -31 22 -23Q34 -23 36 -13Q46 -10 43 0Q54 13 40 19Q3 36 -43 17Z','#fff3cf')
+[[-31,-3],[-15,-16],[2,-20],[22,-13],[31,0],[14,3],[-6,0],[-23,12],[4,16]].map(([x,y])=>place(path('M-4 1q3 -4 7 -2','none','#c5b38d',1.6),x,y,1)).join('');
function cup(liquid,glaze,band){
  return oval(102,160,69,18,'#a7bdae')+oval(102,157,70,17,'#f4e9cd')+oval(100,157,45,8,'#d4d4b9','#869d88',1)
    +path('M143 88Q183 73 178 103Q174 124 148 129L146 118Q163 115 165 102Q167 92 149 99Z',glaze)
    +path('M43 87L49 129Q53 153 86 158Q117 164 139 149Q150 141 153 116L156 87Z',glaze)
    +path('M47 108Q96 133 153 108L152 114Q99 140 48 114Z',band,band,1)
    +path('M56 120l4 14','none','#fff1d2',3)+oval(99,87,57,20,'#fff1d2')+oval(99,88,51,15,liquid)
    +path('M59 89q6 -8 25 -10','none','#e3b983',1.7);
}
const lemon=oval(0,0,19,17,'#f3c951','#796b3c',1.4)+oval(0,0,15,13,'#ffe49a','#fff3bf',2)
  +path('M0 0l12 -4M0 0l-1 -10M0 0l-11 -3M0 0l-8 8M0 0l7 9','none','#f8c454',1.5);
function glass(isTea){
  const top=isTea?53:73, fill=isTea?'#be773b':'#c6dfdb';
  const body=path('M66 '+top+' Q108 '+(top+15)+' 154 '+top+'L144 164Q110 180 76 164Z','#ecf3dd')
    +path('M69 '+(top+20)+'Q111 '+(top+36)+' 151 '+(top+20)+'L142 161Q109 177 78 161Z',fill,'#7b9583',1.2)
    +oval(110,top+20,41,9,isTea?'#ce8843':'#d8ece5','#728d7c',1.4)+oval(110,top,44,10,'none');
  const details=isTea?place(lemon,116,117,.9,-30)+place(lemon,106,141,.88,12)
    +path('M117 91l19 -63 6 2 -20 64Z','#c78269')+place(lemon,83,57,.75,-35)
    :path('M84 120l4 39 M97 124l2 38 M120 124l-1 38 M136 120l-3 40','none','#97bab2',2);
  return body+details+path('M74 '+(top+9)+'l4 36 M78 '+(top+50)+'l1 8','none','#fff8dd',2.8);
}

const boiled=place(oval(0,0,26,20,'#fff4d9')+oval(1,0,12,11,'#f4bb45','#cf9538',1.5),-12,0,1,-26)
  +place(oval(0,0,22,17,'#fff4d9')+oval(1,0,10,9,'#f7bc46','#cf9538',1.4),19,6,1,-28);
function dish(order){
  const egg=order.eggStyle==='scrambled'?eggs:order.eggStyle==='boiled'?boiled:'';
  const extra=order.ingredients.ham===2;
  if(order.ingredients.macaroni)return soup(egg,extra);
  if(order.ingredients.rice)return plate+place(rice,93,101,1.02)+(extra?place(ham,155,122,.76,24):'')+place(ham,145,103,.76,12)+(egg?place(egg,122,127,.81):'');
  return plate+(extra?place(ham,75,112,1.02,-18)+place(ham,82,115,1,-12):'')+place(ham,84,121,.97,-8)+place(ham,88,128,.95,-10)+place(egg,137,116,.91,-10);
}
const steam=path('M86 58q-8 -8 0 -16t0 -14M106 61q-6 -7 1 -14t1 -12','none','#779489',2.2);
const swirl=path('M75 88q9 -8 28 -5t12 6q-11 6 -24 1q-4 -3 8 -4','none','#f6d8a1',2.8);
const ice=path('M-8 -7l12 -2 6 5 -1 11 -14 1 -5 -6Z','#e6edda','#839e95',1.4)
  +path('M-7 -5l5 3 10 -1M-2 -2l-1 8','none','#fff9e4',1.3);
function beverage(b){
  if(b.drink==='water')return glass(false);
  const isLemon=b.drink==='lemonTea', condensed=b.prep==='condensed',black=b.prep==='black',extra=b.prep==='extraLemon';
  const fill=isLemon?'#b77941':black?'#48352d':condensed?'#dba671':b.drink==='coffee'?'#997051':'#bd8559';
  if(b.temperature==='hot'){
    const mug=cup(fill,b.drink==='coffee'?'#b5cbb3':'#f0e5c9',isLemon?'#bd8953':'#537b66');
    return mug+steam+(condensed?swirl:'')+(isLemon?place(lemon,111,87,.53,-12):'')+(extra?place(lemon,81,85,.52,18):'');
  }
  const tumbler=path('M65 57Q109 40 155 57L145 164Q110 181 75 164Z','#e1eddf')
    +path('M69 73Q110 83 151 73L142 162Q109 175 78 162Z',fill,'#69877b',1.4)
    +oval(110,73,41,10,fill,'#796449',1.4)
    +path('M117 91l19 -66 6 2 -20 66Z','#ce8b70')
    +place(ice,84,71,.94,7)+place(ice,106,66,.88,-18)+place(ice,133,76,.91,17)
    +oval(110,57,45,10,'none')+path('M76 83l3 32M80 123l1 9','none','#fff1d2',2.6);
  const milkRibbon=path('M87 132q15 7 30 1t24 -1M86 141q17 6 31 0','none','#f0cd9c',2.8);
  return tumbler+(isLemon?place(lemon,111,132,.81,-27):'')+(extra?place(lemon,113,103,.73,20)+place(lemon,78,57,.65,-10):'')+(condensed?milkRibbon:'');
}
function image(art,wide=false){
  const width=wide?1280:768,view=wide?'0 0 366.67 220':'0 0 220 220';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="768" viewBox="'+view+'">'+art+'</svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function serving(order){
  const food=dish(order);
  return order.beverage?image(place(food,0,0,1.06)+place(beverage(order.beverage),166,6,.96),true):image(food);
}
return {serving,food:order=>image(dish(order)),drink:b=>image(beverage(b))};
})();
