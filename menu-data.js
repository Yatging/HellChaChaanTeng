'use strict';
window.TeaMenu = (() => {
  const stock = {macaroni:['生通粉','Dry macaroni'],rice:['生米','Uncooked rice'],ham:['火腿','Ham'],egg:['生雞蛋','Raw egg']};
  const drinks = {milkTea:['奶茶','Milk tea'],coffee:['咖啡','Coffee'],lemonTea:['檸檬茶','Lemon tea'],water:['清水','Water']};
  const temperatures = {hot:['熱','Hot']};
  const preparations = {
    regular:['照舊','Regular'],
    condensed:['茶走','Condensed milk tea'],
    black:['飛沙走奶','Black coffee, no sugar'],
    extraLemon:['加檸','Extra lemon']
  };
  const styles = {milkTea:['regular','condensed'],coffee:['regular','black'],lemonTea:['regular','extraLemon'],water:['regular']};
  const beverages=[];
  for(const drink of Object.keys(drinks)){
    for(const temperature of drink==='water'?[null]:Object.keys(temperatures)){
      for(const prep of styles[drink]){
        const prefix=temperatures[temperature]||['',''];
        let zh=drinks[drink][0],en=drinks[drink][1];
        if(prep==='condensed'){zh='茶走';en='Condensed milk tea'}
        if(prep==='black'){zh='啡飛沙走奶';en='Unsweetened black coffee'}
        if(prep==='extraLemon'){zh='檸茶加檸';en='Lemon tea, extra lemon'}
        beverages.push({drink,temperature,prep,key:[drink,temperature,prep].filter(Boolean).join('-'),
          zh:prefix[0]+zh,en:temperature?prefix[1]+' '+en.toLowerCase():en});
      }
    }
  }
  const sets = [
    {code:'A', zh:'火腿炒蛋通粉', en:'Macaroni with ham & scrambled egg', short:'腿蛋通', base:'macaroni', egg:true, drink:true},
    {code:'B', zh:'火腿炒蛋飯', en:'Rice with ham & scrambled egg', short:'腿蛋飯', base:'rice', egg:true, drink:true},
    {code:'C', zh:'火腿通粉', en:'Macaroni with ham', short:'腿通', base:'macaroni', egg:false, drink:true},
    {code:'D', zh:'火腿炒蛋', en:'Ham & scrambled egg', short:'腿蛋', base:null, egg:true, drink:false}
  ];
  const modifiers = {
    regular:['照舊','Regular'], 'no-egg':['走蛋','No egg'], boiled:['轉烚蛋','Boiled egg instead'],
    'extra-ham':['加腿','Extra ham'], 'no-egg-extra-ham':['走蛋加腿','No egg + extra ham'],
    'boiled-extra-ham':['轉烚蛋加腿','Boiled egg + extra ham']
  };
  function options(set){
    return Object.keys(modifiers).filter(id=>
      !(id.startsWith('no-egg') && !(set.base && set.egg)) && !(id.startsWith('boiled') && !set.egg));
  }
  function makeOrder(set,modifier,beverage){
    const eggStyle=!set.egg||modifier.startsWith('no-egg')?null:modifier.startsWith('boiled')?'boiled':'scrambled';
    const ingredients={ham:modifier.endsWith('extra-ham')?2:1};
    if(set.base)ingredients[set.base]=1;
    if(eggStyle)ingredients.egg=1;
    const [requestZh,requestEn]=modifiers[modifier];
    const spoken=[set.code+'餐',set.short],translated=['Set '+set.code,set.en];
    if(modifier!=='regular'){spoken.push(requestZh);translated.push(requestEn)}
    if(beverage){spoken.push(beverage.zh);translated.push(beverage.en)}
    const requirements=['set-'+set.code,modifier,'table-water'];
    if(set.base)requirements.push('cooked-'+set.base);
    if(eggStyle)requirements.push(eggStyle+'-egg');
    if(beverage){
      requirements.push('drink-'+beverage.drink);
      if(beverage.temperature)requirements.push('temperature-'+beverage.temperature);
      requirements.push('prep-'+beverage.prep);
    }
    return {key:['set-'+set.code.toLowerCase(),modifier,beverage?.key].filter(Boolean).join('_'),
      setCode:set.code,modifier,requestZh,requestEn,ingredients,eggStyle,beverage,
      drink:beverage?.drink??null,temperature:beverage?.temperature??null,drinkPrep:beverage?.prep??null,
      requirements,text:spoken.join('，')+'，唔該！',english:translated.join(' · ')};
  }
  const orders=sets.flatMap(set=>options(set).flatMap(modifier=>
    (set.drink?beverages:[null]).map(beverage=>makeOrder(set,modifier,beverage))));
  return {stock,sets,drinks,temperatures,preparations,styles,beverages,modifiers,options,orders};
})();
