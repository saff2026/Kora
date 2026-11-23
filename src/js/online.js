/* =================== اللعب أونلاين: غرف لعب مشتركة عبر Firebase =================== */
/* إعدادات مشروع Firebase الخاص بالموقع (معلومات عامة وليست كلمة سر) */
const FB_CONFIG=null;
const MOCK=/[?&]mock=1/.test(location.search); // للاختبار فقط: غرف وهمية داخل المتصفح

function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('script '+src));document.head.appendChild(s);});}

const Online={
  uid:null,offset:0,db:null,_ready:null,
  available(){return !!FB_CONFIG||MOCK;},
  init(){
    if(this._ready)return this._ready;
    this._ready=(async()=>{
      if(MOCK){
        let u=null;try{u=sessionStorage.getItem('kora:mockuid');}catch(e){}
        if(!u){u='u'+Math.random().toString(36).slice(2,9);try{sessionStorage.setItem('kora:mockuid',u);}catch(e){}}
        this.uid=u;this.bc=new BroadcastChannel('kora-mock');return;
      }
      const V='https://www.gstatic.com/firebasejs/9.23.0/';
      await loadScript(V+'firebase-app-compat.js');
      await Promise.all([loadScript(V+'firebase-auth-compat.js'),loadScript(V+'firebase-database-compat.js')]);
      if(!firebase.apps.length)firebase.initializeApp(FB_CONFIG);
      const cred=await firebase.auth().signInAnonymously();
      this.uid=cred.user.uid;this.db=firebase.database();
      this.db.ref('.info/serverTimeOffset').on('value',s=>{this.offset=s.val()||0;});
    })();
    this._ready.catch(()=>{this._ready=null;});
    return this._ready;
  },
  now(){return Date.now()+this.offset;},
  /* مراقبة غرفة: تستدعي cb عند كل تغيير */
  watch(code,cb){
    if(MOCK){
      const k='kora:mockroom:'+code,read=()=>{let v=null;try{v=JSON.parse(localStorage.getItem(k));}catch(e){}cb(v);};
      const h=e=>{if(e.data===code)read();};this.bc.addEventListener('message',h);
      this._lw=this._lw||{};(this._lw[code]=this._lw[code]||[]).push(read);read();
      return ()=>{this.bc.removeEventListener('message',h);this._lw[code]=(this._lw[code]||[]).filter(f=>f!==read);};
    }
    const ref=this.db.ref('kora/rooms/'+code),h=s=>cb(s.val());ref.on('value',h);
    return ()=>ref.off('value',h);
  },
  /* تعديل ذرّي: fn تستلم الغرفة الحالية وترجع الجديدة (أو undefined للإلغاء) */
  async tx(code,fn){
    if(MOCK){
      const k='kora:mockroom:'+code;let cur=null;try{cur=JSON.parse(localStorage.getItem(k));}catch(e){}
      const nx=fn(cur?JSON.parse(JSON.stringify(cur)):null);if(nx===undefined)return {committed:false,val:cur};
      localStorage.setItem(k,JSON.stringify(nx));this.bc.postMessage(code);setTimeout(()=>((this._lw||{})[code]||[]).forEach(f=>f()),0);
      return {committed:true,val:nx};
    }
    const r=await this.db.ref('kora/rooms/'+code).transaction(cur=>{const nx=fn(cur);return nx===undefined?undefined:nx;},undefined,false);
    return {committed:r.committed,val:r.snapshot.val()};
  }
};

/* =================== إطار الألعاب الجماعية (نفس الجهاز أو أونلاين) =================== */
const MP={
  mode:null,game:null,code:null,room:null,seat:null,unsub:null,
  name(){return store.get('name','');},
  setName(n){store.set('name',n);},
  link(code){return location.href.split('#')[0].split('?')[0]+(MOCK?'?mock=1':'')+'#join-'+code;},
  stop(){if(this.unsub){this.unsub();this.unsub=null;}clearInterval(this._iv);this.mode=null;this.code=null;this.room=null;this.seat=null;},
  isMine(seat){return this.mode!=='online'||seat===this.seat;},
  /* يطبّق تغييرًا على حالة اللعبة: مباشرة على نفس الجهاز، أو كمعاملة على الغرفة أونلاين */
  async act(mut){
    const g=this.game;
    if(this.mode!=='online'){const r=mut(g.st);g.draw();return r!==false;}
    let ok=false;
    await Online.tx(this.code,room=>{if(!room||!room.s)return undefined;const r=mut(room.s);if(r===false)return undefined;ok=true;room.rev=(room.rev||0)+1;return room;});
    return ok;
  },
  /* شاشة الاختيار بين نفس الجهاز والأونلاين */
  menu(g){
    this.stop();this.game=g;
    const online=Online.available();
    screen(g.title,g.id,'<div class="stack" style="margin-top:14px">'+
      '<button class="row card" style="padding:16px" onclick="MP.game.localSetup()"><span class="ico" style="background:linear-gradient(155deg,#8E8E93,#3A3A3C)">'+SVG('<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18.5h3"/>')+'</span><span class="tx"><b>على نفس الجهاز</b><span>'+esc(g.localDesc)+'</span></span><svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M15 6l-6 6 6 6"/></svg></button>'+
      '<button class="row card" style="padding:16px" '+(online?'onclick="MP.onlineMenu()"':'disabled')+'><span class="ico" style="background:linear-gradient(155deg,#64D2FF,#0A84FF)">'+SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>')+'</span><span class="tx"><b>أونلاين مع أصدقائك</b><span>'+(online?'كل واحد من جواله، أرسل لهم رابط الغرفة':'غير متاح حاليًا')+'</span></span><svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M15 6l-6 6 6 6"/></svg></button></div>');
  },
  onlineMenu(){
    const g=this.game;
    screen(g.title,g.id,'<div class="stack" style="margin-top:14px"><div class="card"><label class="small muted" for="mpName">اسمك</label><input class="field" id="mpName" maxlength="20" placeholder="اكتب اسمك" value="'+esc(this.name())+'" style="margin-top:6px"></div>'+
      '<button class="btn block" onclick="MP.create()">إنشاء غرفة جديدة</button>'+
      '<div class="card"><label class="small muted" for="mpCode">أو ادخل غرفة صديقك</label><div style="display:flex;gap:8px;margin-top:6px"><input class="field" id="mpCode" maxlength="5" placeholder="رمز الغرفة" style="text-transform:uppercase;letter-spacing:3px;direction:ltr;text-align:center" autocomplete="off" autocapitalize="characters"><button class="btn" onclick="MP.join($(\'#mpCode\').value)">دخول</button></div></div></div>');
  },
  readName(){const i=$('#mpName');const n=(i?i.value:this.name()).trim().slice(0,20);if(!n){toast('اكتب اسمك أولًا');if(i)i.focus();return null;}this.setName(n);return n;},
  async create(){
    const n=this.readName();if(!n)return;const g=this.game;
    try{await Online.init();}catch(e){toast('تعذّر الاتصال، تأكد من الإنترنت');return;}
    const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for(let t=0;t<6;t++){
      const code=Array.from({length:5},()=>A[Math.floor(Math.random()*A.length)]).join('');
      const r=await Online.tx(code,cur=>{if(cur&&cur.created&&Online.now()-cur.created<864e5)return undefined;return {g:g.id,host:Online.uid,created:Online.now(),phase:'lobby',players:{[Online.uid]:{n,seat:0}},rev:0};});
      if(r.committed){this.enter(code);return;}
    }
    toast('حاول مرة أخرى');
  },
  async join(code,fromLink){
    code=String(code||'').trim().toUpperCase();if(!/^[A-Z2-9]{5}$/.test(code)){toast('رمز الغرفة ٥ حروف وأرقام');return;}
    let n=this.name();if(!fromLink||!n){n=this.readName();if(!n)return;}
    try{await Online.init();}catch(e){toast('تعذّر الاتصال، تأكد من الإنترنت');return;}
    let why='';
    const r=await Online.tx(code,cur=>{
      if(!cur||!cur.g){why='الغرفة غير موجودة';return undefined;}
      if(cur.players&&cur.players[Online.uid])return cur; // عودة لنفس الغرفة
      const g=gameById(cur.g);const seats=Object.values(cur.players||{}).map(p=>p.seat);
      if(cur.phase!=='lobby'){why='بدأت المباراة في هذه الغرفة';return undefined;}
      if(seats.length>=g.obj.maxPlayers){why='الغرفة ممتلئة';return undefined;}
      let s=0;while(seats.includes(s))s++;
      cur.players=cur.players||{};cur.players[Online.uid]={n,seat:s};return cur;
    });
    if(!r.committed){toast(why||'تعذّر الدخول');return;}
    const g=gameById(r.val.g);
    if(location.hash.slice(1)!==g.id){history.replaceState(null,'','#'+g.id);}
    this.game=g.obj;CUR=g.obj;this.enter(code);
  },
  enter(code){
    if(this.unsub)this.unsub();
    this.mode='online';this.code=code;
    this.unsub=Online.watch(code,room=>this.onRoom(room));
  },
  onRoom(room){
    if(!room){screen(this.game.title,this.game.id,'<div class="card result"><h3>انتهت الغرفة</h3><button class="btn block" onclick="MP.menu(MP.game)">رجوع</button></div>');return;}
    this.room=room;const me=room.players&&room.players[Online.uid];this.seat=me?me.seat:null;
    const g=this.game;
    if(room.phase==='lobby'||!room.s)return this.lobby(room);
    g.st=room.s;g.draw();
  },
  players(room){return Object.entries(room.players||{}).map(([u,p])=>({u,n:p.n,seat:p.seat})).sort((a,b)=>a.seat-b.seat);},
  lobby(room){
    const g=this.game,ps=this.players(room),host=room.host===Online.uid,link=this.link(this.code);
    const msg='تعال العب معي «'+g.title+'» في تحدّي الكورة 👇\n'+link;
    screen(g.title,g.id,'<div class="stack" style="margin-top:14px"><div class="card" style="text-align:center"><div class="muted small">رمز الغرفة</div><div class="big-num" style="direction:ltr;letter-spacing:6px;font-size:44px;margin:6px 0">'+this.code+'</div>'+
      '<div class="btns" style="margin-top:8px"><a class="btn" style="text-decoration:none;background:#25D366" href="https://wa.me/?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">واتساب</a><button class="btn sec" onclick="MP.copy()">نسخ الرابط</button></div>'+
      '<p class="muted small" style="margin:10px 0 0;direction:ltr;overflow-wrap:anywhere">'+esc(link)+'</p></div>'+
      '<div class="card"><div class="tagrow"><b>اللاعبون</b><span class="pill num">'+AR(ps.length)+' / '+AR(g.maxPlayers)+'</span></div>'+ps.map(p=>'<div class="tagrow" style="padding:10px 0;border-top:.5px solid var(--sep);margin-top:8px"><span>'+esc(p.n)+(p.u===room.host?' <span class="pill a">المضيف</span>':'')+(p.u===Online.uid?' <span class="pill">أنت</span>':'')+'</span></div>').join('')+'</div>'+
      (host?(g.lobbyOptions?g.lobbyOptions():'')+'<button class="btn block" '+(ps.length<g.minPlayers?'disabled':'')+' onclick="MP.begin()">'+(ps.length<g.minPlayers?'بانتظار '+AR(g.minPlayers-ps.length)+' لاعب على الأقل…':'ابدأ المباراة')+'</button>':'<div class="card muted" style="text-align:center"><div class="spin"></div>بانتظار أن يبدأ المضيف…</div>')+'</div>');
  },
  async copy(){try{await navigator.clipboard.writeText(this.link(this.code));toast('تم نسخ رابط الغرفة');}catch(e){toast('انسخ الرابط الظاهر تحت الرمز');}},
  async begin(){
    const g=this.game,room=this.room;if(!room||room.host!==Online.uid)return;
    const names=this.players(room).map(p=>p.n);const opts=g.readLobbyOptions?g.readLobbyOptions():{};
    const s=g.initState(names,opts);
    await Online.tx(this.code,cur=>{if(!cur)return undefined;cur.phase='play';cur.s=s;cur.rev=(cur.rev||0)+1;return cur;});
  },
  async again(){
    const g=this.game;
    if(this.mode!=='online'){g.st=g.initState(g.st.names,g.lastOpts||{});g.draw();return;}
    const room=this.room;if(!room||room.host!==Online.uid){toast('المضيف يبدأ المباراة الجديدة');return;}
    const s=g.initState(this.players(room).map(p=>p.n),g.lastOpts||{},g.st);
    await Online.tx(this.code,cur=>{if(!cur)return undefined;cur.s=s;cur.rev=(cur.rev||0)+1;return cur;});
  },
  statusLine(turn,names){
    if(this.mode==='online')return turn===this.seat?'<b style="color:var(--accent)">دورك الآن</b>':'دور <b>'+esc(names[turn])+'</b>، انتظر…';
    return 'دور <b>'+esc(names[turn])+'</b>';
  }
};
