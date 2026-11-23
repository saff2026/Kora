/* =================== باك 11 (بطاقات المقارنة) =================== */
const PACK={
  STATS:[['apps','مباريات مع الأندية',p=>totals(p).apps],['goals','أهداف مع الأندية',p=>totals(p).goals],['caps','مباريات دولية',p=>p.nt?p.nt[1]:null],['ig','أهداف دولية',p=>p.nt?p.nt[2]:null],['h','الطول (سم)',p=>p.h],['nc','عدد الأندية',p=>new Set(p.car.map(c=>c[0])).size]],
  pool(){return D.famous.slice(0,1200).filter(p=>this.STATS.every(s=>s[2](p)!=null));},
  start(mode,hard){
    mode=mode||this.mode||'daily';this.mode=mode;if(hard!==undefined)this.hard=hard;
    const r=rng(seedFor('pack'+(this.hard?'h':''),mode));
    const pool=this.pool();const cards=pickN(this.hard?pool.slice(300):pool.slice(0,500),12,r).map(p=>p.q);
    const statIdx=cards.map(()=>pickN([0,1,2,3,4,5],5,r));
    const fresh=()=>({cards,statIdx,i:0,yellow:false,done:false,win:false,hist:[]});
    const key='pack'+(this.hard?'h':'');
    this.st=mode==='daily'?(()=>{let s=store.get('day:'+key,null);if(!s||s.day!==DAY)s=Object.assign({day:DAY},fresh());return s;})():fresh();
    this.key=key;this.sel=null;this.draw();
  },
  save(){if(this.mode==='daily'){store.set('day:'+this.key,this.st);store.set('day:pack',{day:DAY,done:this.st.done});}},
  card(q,si,show,gold,mark){
    const p=D.byQ[q];
    return '<div class="tcard'+(gold?' gold':'')+'"><div class="mt">'+esc(p.pos||'')+' · '+flag(p.nat)+'</div><div class="nm">'+esc(p.n)+'</div><div class="mt">'+esc(tName(p.mainClub))+'</div>'+
      si.map(k=>{const s=this.STATS[k],v=s[2](p);const cls=mark&&mark.k===k?mark.c:(show&&this.sel===k?'sel':'');return '<button class="st '+cls+'" '+(show?'onclick="PACK.sel='+k+';PACK.draw()"':'disabled')+'><span>'+s[1]+'</span><b class="num">'+(show||mark?AR(v):'؟')+'</b></button>';}).join('')+'</div>';
  },
  draw(){
    const st=this.st;
    let body;
    if(st.done){
      body=resultCard({em:st.win?'🥇':'🟥',title:st.win?'أكملت البطاقات الـ١١!':'طُردت!',sub:'وصلت إلى البطاقة '+AR(Math.min(st.i+1,11))+' من ١١',daily:this.mode==='daily',game:'pack',share:'PACK.share()',again:"PACK.start('free')",againLabel:'رزمة جديدة'});
    } else {
      const a=st.cards[st.i],b=st.cards[st.i+1],si=st.statIdx[st.i];
      body='<div class="tagrow"><span class="pill a num">البطاقة '+AR(st.i+1)+' / ١١</span><span>'+(st.yellow?'<span class="yc"></span> إنذار':'')+'</span></div>'+
        '<div class="cards2">'+this.card(a,si,true,false,st.lastMark)+this.card(b,si,false,st.i===10)+'</div>'+
        '<p class="muted small" style="text-align:center;margin:0">اختر رقمًا من البطاقة اليمنى تتوقع أنه أكبر من أو يساوي الرقم نفسه في البطاقة اليسرى.</p>'+
        '<button class="btn block" '+(this.sel==null?'disabled':'')+' onclick="PACK.go()">تأكيد الاختيار</button>';
    }
    const modes='<div class="chips" style="margin:10px 0"><button class="chip '+(!this.hard?'on':'')+'" onclick="PACK.start(PACK.mode,false)">عادي</button><button class="chip '+(this.hard?'on':'')+'" onclick="PACK.start(PACK.mode,true)">صعب</button></div>';
    screen('باك 11','pack',modeSeg('PACK',this.mode)+modes+'<div class="stack">'+body+'</div>');
  },
  go(){
    const st=this.st,k=this.sel;if(k==null)return;const s=this.STATS[k];
    const va=s[2](D.byQ[st.cards[st.i]]),vb=s[2](D.byQ[st.cards[st.i+1]]);
    const ok=va>=vb;st.hist.push(ok?1:0);
    toast((ok?'✓ صح: ':'✗ خطأ: ')+AR(va)+' مقابل '+AR(vb));
    if(!ok){if(st.yellow){st.done=true;st.win=false;}else st.yellow=true;}
    if(!st.done){st.i++;if(st.i>=11){st.done=true;st.win=true;}}
    if(st.done&&this.mode==='daily')recordResult('pack',st.win);
    st.lastMark=null;this.sel=null;this.save();this.draw();
  },
  share(){share('تحدّي الكورة · باك 11 #'+DAYNO+'\n'+this.st.hist.map(x=>x?'🟩':'🟨').join('')+(this.st.win?' 🥇':' 🟥'));}
};
registerGame({id:'pack',name:'باك 11',desc:'بطاقات مقارنة أرقام اللاعبين',color:'linear-gradient(160deg,#C9A24A,#6b4f12)',ic:'🃏',obj:PACK,
 help:'<h3>طريقة لعب «باك 11»</h3><ol><li>أمامك بطاقتا لاعبين، الأولى أرقامها ظاهرة والثانية مخفية.</li><li>اختر رقمًا من البطاقة الأولى تتوقع أنه <b>أكبر من أو يساوي</b> الرقم نفسه في البطاقة الثانية.</li><li>إذا أصبت تنتقل للبطاقة التالية.</li><li>أول خطأ = إنذار 🟨، والثاني = طرد 🟥.</li><li>تجاوز ١١ بطاقة والبطاقة الذهبية لتفوز.</li></ol><p class="muted small">الأرقام لمسيرة اللاعب كاملة من صندوق معلوماته في ويكيبيديا: مباريات الدوري وأهدافه، والمباريات الدولية مع المنتخب الأول.</p>'});
