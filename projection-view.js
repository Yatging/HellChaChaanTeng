'use strict';
(()=>{
  const views={
    stove:{rect:[0,160,320,640],name:'左側灶台 / Stove'},
    tables:{rect:[160,0,640,160],name:'上方四桌 / Tables'},
    ingredients:{rect:[800,160,160,640],name:'右側原料 / Ingredients'}
  };
  const view=views[new URLSearchParams(location.search).get('view')];
  if(!view)return;
  const [x,y,w,h]=view.rect,plan=document.querySelector('.plan'),crop=document.createElement('div');
  crop.className='crop';
  crop.style.width='min(100cqw, '+100*w/h+'cqh)';
  crop.style.aspectRatio=w+'/'+h;
  plan.before(crop);crop.append(plan);
  Object.assign(plan.style,{width:960/w*100+'%',height:800/h*100+'%',left:-x/w*100+'%',top:-y/h*100+'%'});
  document.querySelector('h1').textContent=view.name;
  document.title=view.name+' · 地獄茶記';
})();

