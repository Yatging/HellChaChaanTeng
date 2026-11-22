'use strict';
if(new URLSearchParams(location.search).has('lan')){
 document.querySelectorAll('a[href]').forEach(a=>{
  const url=new URL(a.href);if(url.origin===location.origin){url.searchParams.set('lan','1');a.href=url}
 });
}

