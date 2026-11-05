// Shared by the printed-style menu and the six-customer projection.
'use strict';
window.TeaMenu = (() => {
  const stock = {
    bread: ['方包', 'Bread'], macaroni: ['通粉', 'Macaroni'],
    ham: ['火腿', 'Ham'], luncheon: ['午餐肉', 'Luncheon meat'], egg: ['蛋', 'Egg']
  };
  const sets = [
    {code:'A', zh:'腿蛋治', en:'Ham & egg sandwich', base:'bread', filling:'ham'},
    {code:'B', zh:'餐蛋治', en:'Luncheon meat & egg sandwich', base:'bread', filling:'luncheon'},
    {code:'C', zh:'腿蛋通', en:'Ham & egg macaroni soup', base:'macaroni', filling:'ham'},
    {code:'D', zh:'餐蛋通', en:'Luncheon meat & egg macaroni soup', base:'macaroni', filling:'luncheon'}
  ];
  const orders = sets.flatMap(set => {
    const extra = set.filling === 'ham' ? '加腿' : '加餐肉';
    const options = [
      ['double-egg','孖蛋','double egg','egg',2],
      ['no-egg','走蛋','no egg','egg',0],
      ['extra-filling',extra,'extra '+stock[set.filling][1].toLowerCase(),set.filling,2]
    ];
    if(set.base==='macaroni') options.push(['extra-base','加底','extra macaroni','macaroni',2]);
    return options.map(([modifier,zh,en,key,qty]) => ({
      setCode:set.code, modifier, requestZh:zh, requestEn:en,
      text:set.code+'餐，'+set.zh+'，'+zh+'，唔該！',
      english:'Set '+set.code+' · '+set.en+' · '+en,
      ingredients:{[set.base]:1,[set.filling]:1,egg:1,[key]:qty},
      requirements:['set-'+set.code,modifier]
    }));
  });
  return {stock,sets,orders};
})();

