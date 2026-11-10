'use strict';
window.TeaMenu = (() => {
  const stock = {
    macaroni: ['生通粉', 'Dry macaroni'],
    rice: ['生米', 'Uncooked rice'],
    ham: ['火腿', 'Ham'],
    egg: ['生雞蛋', 'Raw egg']
  };
  const drinks = {
    milkTea: ['奶茶', 'Milk tea'], coffee: ['啡', 'Coffee'],
    lemonTea: ['0茶', 'Lemon tea'], water: ['清水', 'Water']
  };
  const sets = [
    {code:'A', zh:'火腿炒蛋通粉', en:'Macaroni with ham & scrambled egg', short:'腿蛋通', base:'macaroni', egg:true, drink:true},
    {code:'B', zh:'火腿炒蛋飯', en:'Rice with ham & scrambled egg', short:'腿蛋飯', base:'rice', egg:true, drink:true},
    {code:'C', zh:'火腿通粉', en:'Macaroni with ham', short:'腿通', base:'macaroni', egg:false, drink:true},
    {code:'D', zh:'火腿炒蛋', en:'Ham & scrambled egg', short:'腿蛋', base:null, egg:true, drink:false}
  ];
  const modifiers = {
    regular: ['照舊', 'Regular'], 'no-egg': ['走蛋', 'No egg'],
    boiled: ['轉烚蛋', 'Boiled egg instead'], 'extra-ham': ['加腿', 'Extra ham']
  };
  function options(set) {
    const ids = ['regular'];
    if (set.base && set.egg) ids.push('no-egg');
    if (set.egg) ids.push('boiled');
    return [...ids, 'extra-ham'];
  }
  function makeOrder(set, modifier, drink) {
    const eggStyle = set.egg && modifier !== 'no-egg'
      ? (modifier === 'boiled' ? 'boiled' : 'scrambled') : null;
    const ingredients = {ham: modifier === 'extra-ham' ? 2 : 1};
    if (set.base) ingredients[set.base] = 1;
    if (eggStyle) ingredients.egg = 1;
    const [requestZh,requestEn] = modifiers[modifier];
    const spoken = [set.code+'餐', set.short];
    const translated = ['Set '+set.code, set.en];
    if (modifier !== 'regular') { spoken.push(requestZh); translated.push(requestEn); }
    if (drink) { spoken.push(drinks[drink][0]); translated.push(drinks[drink][1]); }
    const requirements = ['set-'+set.code, modifier, 'table-water'];
    if (set.base) requirements.push('cooked-'+set.base);
    if (eggStyle) requirements.push(eggStyle+'-egg');
    if (drink) requirements.push('drink-'+drink);
    return {setCode:set.code, modifier, requestZh, requestEn, drink, eggStyle, ingredients,
      requirements, text:spoken.join('，')+'，唔該！', english:translated.join(' · ')};
  }
  const orders = sets.flatMap(set => options(set).flatMap(modifier =>
    (set.drink ? Object.keys(drinks) : [null]).map(drink => makeOrder(set, modifier, drink))));
  return {stock, drinks, sets, modifiers, options, orders};
})();
