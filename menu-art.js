'use strict';
window.MenuArt=(()=>{
  const root='HellChaChaanTeng_ArtPack_2026-11-22/';
  const food=o=>root+'03_Food_Only/food_'+o.setCode.toLowerCase()+'_'+o.modifier.replaceAll('-','_')+'.png';
  const drink=b=>root+'04_Drinks_Only/drink_'+b.key.replaceAll('-','_')+'.png';
  const serving=o=>o.beverage?'assets/orders-v3/'+o.key+'.webp':food(o);
  const single=item=>root+'13_Single_Servings/served_'+item+'.png';
  const tray=item=>root+'14_Prep_Trays/tray_'+item+'.png';
  const cooking=(recipe,name)=>root+'15_Cooking_Contents/'+(recipe?recipe+'/':'')+name+'.png';
  const pic=(src,attrs='')=>'<image href="'+src+'" width="220" height="220" '+attrs+'/>';
  function tableSetting(o,slot){
    const b=o.beverage,f='food-bites-'+slot,d='liquid-level-'+slot;
    const clips='<defs><clipPath id="'+f+'"><path class="bite-edge" d="M0 -5 Q14 20 1 40T4 76Q20 90 3 106T5 142Q18 156 2 176T3 225H460V-5Z"/></clipPath><clipPath id="'+d+'"><rect class="drink-level" width="220" height="225"/></clipPath></defs>';
    const empty=root+'16_Empty_Settings/empty_';
    const dish=pic(empty+(o.ingredients.macaroni?'bowl':'plate')+'.png')+pic(food(o),'clip-path="url(#'+f+')"');
    const cup=b?'<g transform="translate(200.7 34.3) scale(.745)">'+pic(empty+(b.drink==='water'?'glass':'cup')+'.png')+pic(drink(b),'clip-path="url(#'+d+')"')+'</g>':'';
    return '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="'+(b?'0':'-73.33')+' 0 366.67 220">'+clips+dish+cup+'</svg>';
  }
  return {food,drink,serving,single,tray,cooking,tableSetting};
})();
