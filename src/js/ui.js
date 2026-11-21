/* =================== واجهة على طريقة Apple =================== */
const SVG=(d,o)=>'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="'+((o&&o.w)||2)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
/* رموز الألعاب: رسوم بسيطة بأسلوب SF Symbols */
const GLYPH={
  m11:'<rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M4 12h16"/><circle cx="12" cy="12" r="3"/><path d="M8.5 21.5v-3.5h7v3.5M8.5 2.5V6h7V2.5"/>',
  who:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/><path d="M10.6 6.6c.2-.9.8-1.4 1.6-1.4.9 0 1.5.6 1.5 1.4 0 1.2-1.5 1.3-1.5 2.4M12.2 10.6v.1" stroke-width="1.6"/>',
  grid:'<rect x="3" y="3" width="5" height="5" rx="1.3"/><rect x="9.5" y="3" width="5" height="5" rx="1.3"/><rect x="16" y="3" width="5" height="5" rx="1.3"/><rect x="3" y="9.5" width="5" height="5" rx="1.3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.3" fill="#fff"/><rect x="16" y="9.5" width="5" height="5" rx="1.3"/><rect x="3" y="16" width="5" height="5" rx="1.3"/><rect x="9.5" y="16" width="5" height="5" rx="1.3"/><rect x="16" y="16" width="5" height="5" rx="1.3"/>',
  career:'<circle cx="5" cy="18" r="2"/><circle cx="12" cy="11" r="2"/><circle cx="19" cy="5" r="2"/><path d="M6.5 16.5l4-4M13.6 9.6l3.8-3.3"/>',
  tena:'<path d="M9 5h11M9 12h11M9 19h11"/><path d="M4 4.2l1.2-.7V7M3.6 11.3c.3-.6.8-.9 1.4-.9.7 0 1.2.4 1.2 1 0 .9-2.5 1.6-2.6 2.8h2.7M3.7 17.4c.4-.4.9-.6 1.4-.6.6 0 1.1.4 1.1.9s-.5.9-1.1.9c.7 0 1.2.4 1.2 1s-.6 1-1.3 1c-.5 0-1-.2-1.3-.6" stroke-width="1.5"/>',
  word:'<rect x="2.5" y="7" width="5.5" height="10" rx="1.5"/><rect x="9.25" y="7" width="5.5" height="10" rx="1.5" fill="#fff"/><rect x="16" y="7" width="5.5" height="10" rx="1.5"/>',
  conn:'<path d="M10 14a4 4 0 0 0 5.7 0l3.5-3.5a4 4 0 0 0-5.7-5.7L12 6.3"/><path d="M14 10a4 4 0 0 0-5.7 0l-3.5 3.5a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
  pies:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 2.5a7 7 0 0 1 6.5 6.5H15z" fill="#fff"/>',
  mines:'<circle cx="11" cy="14" r="6.5"/><path d="M15.5 9.5l2-2M17 4l.5 1.6M20.5 6.5l-1.6.5M19.5 3.5l-1 1"/><path d="M8.5 12.5a3 3 0 0 1 2-2" stroke-width="1.5"/>',
  rare:'<path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18M9 3l3 18 3-18" stroke-width="1.4"/>',
  fans:'<path d="M3 10v4a1 1 0 0 0 1 1h2l6 4V5L6 9H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  lista:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M10 2.5h4M18.5 6l1.3-1.3"/>',
  ctx:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2" fill="#fff"/>',
  bingo:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.6" fill="#fff"/><circle cx="16" cy="8" r="1.6"/><circle cx="12" cy="12" r="1.6" fill="#fff"/><circle cx="8" cy="16" r="1.6"/><circle cx="16" cy="16" r="1.6" fill="#fff"/>',
  gegen:'<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" fill="#fff"/>',
  heat:'<path d="M12 22c4 0 7-2.8 7-6.8 0-3.4-2.2-5.8-3.6-7.4-.3 1.9-1.2 3-2.4 3.6.4-3.2-.9-6.6-4-8.9.2 3.4-1.4 5.4-2.8 7.2C5 11.4 5 13 5 15.2 5 19.2 8 22 12 22z"/><path d="M12 22c-1.7 0-3-1.3-3-3.1 0-1.9 1.6-3 2.4-4.6.9 1.2 3.6 2.4 3.6 4.6 0 1.8-1.3 3.1-3 3.1z" fill="#fff"/>',
  pack:'<rect x="7.5" y="3" width="12" height="16" rx="2.2" transform="rotate(8 13.5 11)"/><rect x="4.5" y="5" width="12" height="16" rx="2.2" fill="#fff" fill-opacity=".25"/>',
  quiz:'<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7v.5h6V16c0-.7.3-1.3.8-1.7A6.5 6.5 0 0 0 12 2.5z"/>',
  ttt:'<path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke-width="1.4" stroke-opacity=".7"/><path d="M4.3 4.3l2.4 2.4M6.7 4.3L4.3 6.7"/><circle cx="18" cy="12" r="1.7"/><path d="M10.8 16.8l2.4 2.4M13.2 16.8l-2.4 2.4"/>',
  poss:'<path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z"/><path d="M12 2.5v19M3.8 7.25l16.4 9.5" stroke-width="1.4" stroke-opacity=".75"/><path d="M12 12l8.2-4.75V16.75L12 21.5z" fill="#fff" fill-opacity=".35"/>',
  ringer:'<path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z"/><circle cx="12" cy="12" r="2.8" fill="#fff"/><path d="M4 20L20 4"/>',
  draft:'<rect x="5" y="4" width="14" height="17.5" rx="2.5"/><path d="M9 4V2.5h6V4"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/>'
};
const TINT={
  m11:['#34C759','#0B7A3B'],who:['#5E5CE6','#3634A3'],grid:['#FF9F0A','#E0610A'],career:['#FF453A','#B3122B'],tena:['#BF5AF2','#7D2AE8'],
  word:['#30D158','#0E8C3A'],conn:['#64D2FF','#0A84FF'],pies:['#FF375F','#FF9F0A'],mines:['#FF453A','#3A0B0B'],rare:['#8E8E93','#2C2C2E'],
  fans:['#FF9F0A','#FF375F'],lista:['#40C8E0','#0A7EA4'],ctx:['#32ADE6','#1E3A8A'],bingo:['#FF2D92','#8A1C7C'],gegen:['#FFD60A','#FF9500'],
  heat:['#FF9500','#C2190F'],pack:['#FFD60A','#A8741A'],quiz:['#AF52DE','#5E5CE6'],ttt:['#0A84FF','#30D158'],poss:['#30D158','#FF453A'],
  ringer:['#5856D6','#1C1C3A'],draft:['#2C2C2E','#000000']
};
function icon(id,cls){const t=TINT[id]||['#8E8E93','#3A3A3C'];return '<span class="ico'+(cls?' '+cls:'')+'" style="background:linear-gradient(155deg,'+t[0]+','+t[1]+')">'+SVG(GLYPH[id]||'')+'</span>';}
const TABICON={
  today:'<rect x="3.5" y="4.5" width="17" height="16" rx="3"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4"/><rect x="7" y="12.5" width="4" height="4" rx="1" fill="currentColor"/>',
  games:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  friends:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M17.5 14.6c2.3.3 3.7 1.9 4 4.4"/>',
  me:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>'
};
const tabSvg=k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+TABICON[k]+'</svg>';
const CHEV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';

/* =================== تسجيل الألعاب =================== */
const GAMES=[];const HELP={};
function registerGame(g){GAMES.push(g);HELP[g.id]=g.help;}
const gameById=id=>GAMES.find(g=>g.id===id);
const DAILY=()=>GAMES.filter(g=>!g.multi);

/* =================== إحصاءات اليوم والحلقات =================== */
function todayStats(){
  const list=DAILY();let played=0,won=0,streak=0;
  list.forEach(g=>{
    const s=store.get('stats:'+g.id,{p:0,w:0,cur:0,best:0,last:-1});
    if(dailyDone(g.id)||s.last===DAY)played++;
    if(s.last===DAY&&s.cur>0)won++;
    if(s.last>=DAY-1)streak=Math.max(streak,s.cur||0);
  });
  return {played,won,streak,total:list.length};
}
function ringsSVG(v){ // v: [0..1]x3
  const R=[42,31,20],W=9.5,C=['var(--ring1)','var(--ring2)','var(--ring3)'];
  return '<svg viewBox="0 0 100 100" aria-hidden="true">'+R.map((r,i)=>{const len=2*Math.PI*r,p=Math.min(1,Math.max(0,v[i]));
    return '<circle cx="50" cy="50" r="'+r+'" style="stroke:'+C[i]+'" stroke-width="'+W+'" fill="none" class="ring-bg"/><circle cx="50" cy="50" r="'+r+'" style="stroke:'+C[i]+'" stroke-width="'+W+'" fill="none" stroke-linecap="round" stroke-dasharray="'+len.toFixed(1)+'" stroke-dashoffset="'+(len*(1-Math.max(p,0.001))).toFixed(1)+'" transform="rotate(-90 50 50)" class="ring-fg"/>';}).join('')+'</svg>';
}
function ringsCard(){
  const t=todayStats();
  return '<button class="rings rise" onclick="go(\'me\')" aria-label="تقدّمك اليوم">'+ringsSVG([t.played/t.total,t.played?t.won/t.played:0,t.streak/7])+
    '<div class="leg"><div><span class="c1">ألغاز اليوم</span><b class="num">'+AR(t.played)+' <small>من '+AR(t.total)+'</small></b></div>'+
    '<div><span class="c2">انتصارات</span><b class="num">'+AR(t.won)+' <small>من '+AR(t.played)+'</small></b></div>'+
    '<div><span class="c3">أطول سلسلة</span><b class="num">'+AR(t.streak)+'<small> أيام</small></b></div></div></button>';
}

/* =================== عناصر مشتركة للألعاب =================== */
function navHTML(title,id){
  const back=CUR_TAB==='today'?'اليوم':CUR_TAB==='games'?'الألعاب':CUR_TAB==='friends'?'الأصدقاء':'إنجازاتي';
  return '<div class="nav" id="nav"><div class="in"><button class="nbtn" onclick="go(CUR_TAB)" aria-label="رجوع">'+CHEV+back+'</button><div class="t">'+esc(title)+'</div><div class="nbtn end"><button class="ibtn" aria-label="طريقة اللعب" onclick="openSheet(HELP[\''+id+'\'])">؟</button></div></div></div>';
}
function screen(title,id,body){
  const g=gameById(id);
  $('#app').innerHTML=navHTML(title,id)+'<div class="ghead">'+icon(id)+'<div style="min-width:0"><h1>'+esc(title)+'</h1><p>'+esc(g?g.desc:'')+'</p></div></div>'+body;
  $('#tabbar').hidden=true;
}
function modeSeg(obj,mode,labels){
  labels=labels||['تحدّي اليوم','لعب حر'];
  return '<div class="seg" role="tablist"><button role="tab" class="'+(mode==='daily'?'on':'')+'" onclick="'+obj+'.start(\'daily\')">'+labels[0]+'</button><button role="tab" class="'+(mode==='free'?'on':'')+'" onclick="'+obj+'.start(\'free\')">'+labels[1]+'</button></div>';
}
function livesHTML(n,max,big){return '<div class="lives">'+Array.from({length:max},(_,i)=>'<i class="'+(i<n?'':'off')+'"'+(big?' style="width:12px;height:12px"':'')+'></i>').join('')+'</div>';}
function resultCard(o){
  return '<div class="card result pop"><div class="badge">'+o.em+'</div><h3>'+esc(o.title)+'</h3>'+(o.sub?'<p>'+o.sub+'</p>':'')+(o.daily?statsHTML(o.game):'')+
    '<div class="btns">'+(o.daily&&o.share?'<button class="btn" onclick="'+o.share+'">مشاركة النتيجة</button>':'')+(o.again?'<button class="btn sec" onclick="'+o.again+'">'+esc(o.againLabel||'جولة جديدة')+'</button>':'')+'</div></div>';
}
function fmtYears(s,e){if(!s)return '';return AR(s)+(e===s?'':'–'+(e?AR(e):''));}

/* =================== التوجيه والتبويبات =================== */
const TABS=[['today','اليوم'],['games','الألعاب'],['friends','الأصدقاء'],['me','إنجازاتي']];
let CUR_TAB='today',CUR=null;
function go(h){if(location.hash.slice(1)!==h)location.hash=h;else render();}
window.addEventListener('hashchange',render);
window.addEventListener('scroll',()=>{const n=$('#nav');if(n)n.classList.toggle('scrolled',window.scrollY>60);},{passive:true});
function tabbarHTML(){return '<div class="in">'+TABS.map(t=>'<button class="tab '+(CUR_TAB===t[0]?'on':'')+'" onclick="go(\''+t[0]+'\')">'+tabSvg(t[0])+t[1]+'</button>').join('')+'</div>';}
async function render(){
  closeSheet();
  if(CUR&&CUR.stop)try{CUR.stop();}catch(e){}
  CUR=null;
  let h=location.hash.slice(1)||'today';
  window.scrollTo(0,0);
  if(!D.ready){
    $('#app').innerHTML='<div class="loading"><div class="spin"></div>جارِ التحميل…</div>';
    try{await loadData();}catch(e){$('#app').innerHTML='<div class="loading">تعذّر تحميل البيانات. تأكد من اتصالك ثم أعد تحميل الصفحة.</div>';return;}
  }
  const g=gameById(h);
  if(g){CUR=g.obj;g.obj.start();return;}
  if(!TABS.some(t=>t[0]===h))h='today';
  CUR_TAB=h;
  const tb=$('#tabbar');tb.innerHTML=tabbarHTML();tb.hidden=false;
  ({today:renderToday,games:renderGames,friends:renderFriends,me:renderMe})[h]();
}

/* =================== اليوم =================== */
function dateLine(){return new Date().toLocaleDateString('ar-SA-u-ca-gregory-nu-arab',{weekday:'long',day:'numeric',month:'long'});}
function largeTitle(t,cap){return '<header class="lt"><div><div class="cap">'+esc(cap||dateLine())+'</div><h1>'+t+'</h1></div><button class="avatar" onclick="go(\'me\')" aria-label="إنجازاتي">'+ringsSVG((()=>{const s=todayStats();return [s.played/s.total,s.played?s.won/s.played:0,s.streak/7];})())+'</button></header>';}
function rowHTML(g){
  const done=dailyDone(g.id);
  return '<button class="row" onclick="go(\''+g.id+'\')">'+icon(g.id)+'<span class="tx"><b>'+g.name+'</b><span>'+g.desc+'</span></span><span class="get '+(done?'done':'')+'">'+(g.multi?'افتح':(done?'تم ✓':'العب'))+'</span></button>';
}
function pitchArt(){
  const m=M11.todays();const pts=m?M11.layout(m):[];
  // ملعب منظور من الأعلى مع نقاط التشكيلة
  return '<svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B3D2A"/><stop offset=".45" stop-color="#14704A"/><stop offset="1" stop-color="#1D8C5C"/></linearGradient><radialGradient id="glow" cx=".5" cy=".95" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>'+
    '<rect width="400" height="360" fill="url(#pg)"/>'+Array.from({length:6},(_,i)=>'<rect y="'+(120+i*40)+'" width="400" height="20" fill="#fff" opacity=".035"/>').join('')+'<rect width="400" height="360" fill="url(#glow)"/>'+
    '<g transform="translate(200 360) scale(1 .62) translate(-200 -360)" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" fill="none"><rect x="40" y="80" width="320" height="420" rx="4"/><path d="M40 290h320"/><circle cx="200" cy="290" r="46"/><rect x="120" y="80" width="160" height="70"/><rect x="120" y="430" width="160" height="70"/></g>'+
    pts.map(p=>{const x=40+p.x*3.2,y=360-(100-p.y)*2.05;return '<circle cx="'+x.toFixed(0)+'" cy="'+y.toFixed(0)+'" r="7" fill="#fff"/><circle cx="'+x.toFixed(0)+'" cy="'+y.toFixed(0)+'" r="13" fill="#fff" opacity=".18"/>';}).join('')+'</svg>';
}
function renderToday(){
  const m=M11.todays();
  const dly=DAILY().filter(g=>g.id!=='m11'&&g.group!=='more');
  const w=gameById('word'),c=gameById('conn');
  $('#app').innerHTML=largeTitle('اليوم')+ringsCard()+
   (m?'<div class="sh-row"><h2>لعبة اليوم</h2></div><button class="today rise d1" onclick="go(\'m11\')"><div class="art">'+pitchArt()+'<div class="txt"><div class="eyebrow">الناقص 11 · التحدي رقم '+AR(DAYNO)+'</div><h2>'+esc(m.me)+'</h2><p>'+esc(m.comp)+'. هل تتذكر التشكيلة الأساسية كاملة؟</p></div></div>'+
     '<div class="foot">'+icon('m11','s')+'<span class="tx"><b>الناقص 11</b><span>أكمل التشكيلة الأساسية</span></span><span class="get">'+(dailyDone('m11')?'تم ✓':'العب')+'</span></div></button>':'')+
   '<div class="duo">'+
     '<button class="mini-card rise d2" style="background:linear-gradient(160deg,#30D158,#0E6B2E)" onclick="go(\'word\')"><div><div class="eyebrow">لغز الكلمة</div><h3>كلمة اللاعب</h3></div><div class="deco">'+['ك','ـو','ر','ة'].map((x,i)=>'<i style="background:'+(i===1?'#FFD60A;color:#1c1c1e':i===2?'rgba(255,255,255,.25);color:#fff':'#fff;color:#0E6B2E')+'">'+x+'</i>').join('')+'</div></button>'+
     '<button class="mini-card rise d3" style="background:linear-gradient(160deg,#0A84FF,#1E3A8A)" onclick="go(\'conn\')"><div><div class="eyebrow">١٦ لاعبًا · ٤ روابط</div><h3>الروابط</h3></div><div class="deco">'+['#FFD60A','#8CE36B','#8FC6FF','#D3A6FF'].map(col=>'<i style="background:'+col+';width:30px"></i>').join('')+'</div></button>'+
   '</div>'+
   '<div class="sh-row"><h2>ألغاز يومية</h2><button onclick="go(\'games\')">عرض الكل</button></div><div class="list rise d4">'+dly.map(rowHTML).join('')+'</div>'+
   '<div class="sh-row"><h2>مع أصدقائك</h2><button onclick="go(\'friends\')">عرض الكل</button></div><div class="list">'+GAMES.filter(g=>g.multi).map(rowHTML).join('')+'</div>'+
   footHTML();
}
function footHTML(){return '<div class="foot">البيانات من ويكي بيانات وويكيبيديا · آخر تحديث '+esc(D.v||'')+'<br>'+AR(D.P.length)+' لاعبًا و'+AR(Object.keys(D.T).length)+' ناديًا ومنتخبًا · نتائجك محفوظة على جهازك فقط</div>';}

/* =================== الألعاب =================== */
function renderGames(){
  $('#app').innerHTML=largeTitle('الألعاب',AR(GAMES.length)+' لعبة')+
    '<div class="springboard-wrap rise"><div class="springboard">'+GAMES.map(g=>'<button onclick="go(\''+g.id+'\')">'+icon(g.id)+'<span>'+g.name+'</span></button>').join('')+'</div></div>'+
    '<div class="sh-row"><h2>كل الألعاب</h2></div><div class="list">'+GAMES.map(rowHTML).join('')+'</div>'+footHTML();
}
/* =================== الأصدقاء =================== */
function renderFriends(){
  const meta={ttt:['لاعبان','نفس الجهاز','وضع السرقة'],poss:['لاعبان','ساعة لكل لاعب','٣١ خلية'],ringer:['٣ إلى ١٠ لاعبين','تمرير الجوال','تصويت سري']};
  $('#app').innerHTML=largeTitle('الأصدقاء','العبوا معًا على جهاز واحد')+
    GAMES.filter(g=>g.multi).map((g,i)=>{const t=TINT[g.id];return '<button class="fcard rise d'+(i+1)+'" style="background:linear-gradient(150deg,'+t[0]+','+t[1]+')" onclick="go(\''+g.id+'\')"><div class="top">'+icon(g.id,'l')+'<div><h3>'+g.name+'</h3><p>'+g.desc+'</p></div></div><div class="meta">'+(meta[g.id]||[]).map(x=>'<span>'+x+'</span>').join('')+'</div></button>';}).join('')+footHTML();
}
/* =================== إنجازاتي =================== */
function renderMe(){
  const t=todayStats();
  const tiles=DAILY().map(g=>{const s=store.get('stats:'+g.id,{p:0,w:0,cur:0,best:0});return '<button class="stat-tile" onclick="go(\''+g.id+'\')"><div class="top">'+icon(g.id,'s')+'<span>'+g.name+'</span></div><b class="num">'+AR(s.p?Math.round(s.w*100/s.p):0)+'٪</b><small>'+AR(s.p)+' مرة · سلسلة '+AR(s.cur||0)+' · الأفضل '+AR(s.best||0)+'</small></button>';}).join('');
  $('#app').innerHTML=largeTitle('إنجازاتي')+
    '<div class="card rise" style="text-align:center;padding:22px"><div style="width:180px;max-width:60%;margin:0 auto">'+ringsSVG([t.played/t.total,t.played?t.won/t.played:0,t.streak/7])+'</div>'+
    '<div class="stats num" style="margin:16px 0 0"><div><b class="c1">'+AR(t.played)+'</b><span>لعبت اليوم</span></div><div><b class="c2">'+AR(t.won)+'</b><span>فزت اليوم</span></div><div><b class="c3">'+AR(t.streak)+'</b><span>أطول سلسلة</span></div><div><b>'+AR(t.total)+'</b><span>لغز يومي</span></div></div></div>'+
    '<div class="sh-row"><h2>نسبة الفوز في كل لعبة</h2></div><div class="statgrid">'+tiles+'</div>'+footHTML();
}
