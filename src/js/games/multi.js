/* =================== الألعاب الجماعية: نفس الجهاز أو أونلاين =================== */
const mpNow=()=>MP.mode==='online'?Online.now():Date.now();
const LINES3=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function namesInputs(prefix,labels){return labels.map((l,i)=>'<label class="small muted" for="'+prefix+i+'">'+l+'</label><input class="field" id="'+prefix+i+'" maxlength="20" value="'+esc(i===0&&MP.name()?MP.name():'اللاعب '+AR(i+1))+'" style="margin:6px 0 12px">').join('');}

/* ---------- إكس-أو الكورة ---------- */
const TTT={
  id:'ttt',title:'إكس-أو الكورة',minPlayers:2,maxPlayers:2,localDesc:'لاعبان يتبادلان نفس الجوال',
  start(){MP.menu(this);},
  stop(){MP.stop();},
  localSetup(){
    screen(this.title,this.id,'<div class="stack" style="margin-top:14px"><div class="card">'+namesInputs('tn',['اسم لاعب ✕','اسم لاعب ◯'])+this.lobbyOptions()+'</div><button class="btn block" onclick="TTT.localBegin()">ابدأ</button></div>');
  },
  localBegin(){const names=[0,1].map(i=>($('#tn'+i).value.trim()||'اللاعب '+AR(i+1)));MP.mode='local';this.st=this.initState(names,this.readLobbyOptions());this.draw();},
  lobbyOptions(){return '<label style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" id="tsteal" style="width:20px;height:20px"> وضع السرقة (٣ سرقات لكل لاعب)</label>';},
  readLobbyOptions(){const o={steal:!!($('#tsteal')&&$('#tsteal').checked)};this.lastOpts=o;return o;},
  initState(names,o){const g=buildGrid(rng(Math.floor(Math.random()*4e9)),3,3,{minFame:30});return {names:names.slice(0,2),rows:g.rows,cols:g.cols,cell:{},turn:0,steal:o&&o.steal?[3,3]:0,done:false,win:-1};},
  fix(s){s.cell=s.cell||{};return s;},
  sets(){const k=JSON.stringify([this.st.rows,this.st.cols]);if(this._k!==k){this._k=k;this._sets=gridSets(this.st);}return this._sets;},
  line(s){for(const l of LINES3){const o=l.map(i=>s.cell['k'+i]?s.cell['k'+i].o:null);if(o[0]!=null&&o[0]===o[1]&&o[1]===o[2])return o[0];}return null;},
  draw(){
    const st=this.fix(this.st),mk=['✕','◯'],col=['#0A84FF','#FF453A'];
    let h='<div class="bx"><div></div>'+st.cols.map(c=>'<div class="hd">'+catHead(c)+'</div>').join('');
    for(let i=0;i<3;i++){h+='<div class="hd">'+catHead(st.rows[i])+'</div>';for(let j=0;j<3;j++){const k=i*3+j,c=st.cell['k'+k];h+='<button class="cl '+(c?'ok':'empty')+'" style="'+(c?'background:'+col[c.o]+';color:#fff':'')+'" onclick="TTT.open('+k+')">'+(c?'<div><div style="font-size:1.5rem;font-weight:800">'+mk[c.o]+'</div>'+esc(D.byQ[c.q].n)+'</div>':'+')+'</button>';}}
    h+='</div>';
    const head='<div style="display:flex;gap:8px">'+[0,1].map(k=>'<div class="card" style="flex:1;text-align:center;padding:10px;'+(st.turn===k&&!st.done?'box-shadow:0 0 0 2.5px '+col[k]:'')+'"><div style="font-size:1.4rem;font-weight:800;color:'+col[k]+'">'+mk[k]+'</div><b>'+esc(st.names[k]||'…')+'</b>'+(st.steal?'<div class="small muted">سرقات: '+AR(st.steal[k])+'</div>':'')+'</div>').join('')+'</div>';
    const msg=st.done?'<div class="card result pop"><div class="badge">🏆</div><h3>'+(st.win<0?'تعادل!':'فاز '+esc(st.names[st.win]))+'</h3>'+this.againBtn()+'</div>':
      '<div class="card tagrow"><span>'+MP.statusLine(st.turn,st.names)+'</span>'+(MP.isMine(st.turn)?'<button class="btn ghost small" onclick="TTT.pass()">تمرير الدور</button>':'')+'</div>';
    screen(this.title,this.id,'<div class="stack" style="margin-top:12px">'+head+msg+'<div class="card" style="padding:12px">'+h+'</div></div>');
  },
  againBtn(){return (MP.mode!=='online'||(MP.room&&MP.room.host===Online.uid))?'<button class="btn block" onclick="MP.again()">مباراة جديدة</button>':'<p class="muted small">بانتظار المضيف لبدء مباراة جديدة</p>';},
  open(k){
    const st=this.st;if(st.done)return;if(!MP.isMine(st.turn)){toast('ليس دورك');return;}
    const c=st.cell['k'+k];
    if(c){if(c.o===st.turn){toast('هذه خانتك');return;}if(!st.steal||!st.steal[st.turn]){toast('الخانة محجوزة');return;}}
    const a=st.rows[Math.floor(k/3)],b=st.cols[k%3],turn=st.turn;
    pickPlayerSheet(esc(catLabel(a))+' × '+esc(catLabel(b)),c?'سرقة: اذكر لاعبًا مختلفًا عن '+esc(D.byQ[c.q].n):'اذكر لاعبًا يحقق الشرطين',p=>this.play(k,p,turn),{isUsed:p=>c&&c.q===p.q});
  },
  async play(k,p,turn){
    const ok=this.sets()[k].includes(p.q);
    const done=await MP.act(s=>{
      this.fix(s);if(s.done||s.turn!==turn)return false;const c=s.cell['k'+k];
      if(ok){if(c){if(c.o===turn||!s.steal||!s.steal[turn])return false;s.steal[turn]--;}s.cell['k'+k]={o:turn,q:p.q};}
      const w=this.line(s);if(w!=null){s.done=true;s.win=w;}
      else if(Object.keys(s.cell).length===9&&!(s.steal&&(s.steal[0]||s.steal[1]))){s.done=true;s.win=-1;}
      if(!s.done)s.turn=1-turn;
    });
    if(done)toast(ok?'✓ '+p.n:'✗ '+p.n+' لا يحقق الشرطين، الدور ينتقل');
  },
  pass(){const t=this.st.turn;MP.act(s=>{if(s.done||s.turn!==t)return false;s.turn=1-t;});}
};
registerGame({id:'ttt',name:'إكس-أو الكورة',desc:'إكس-أو بأسئلة كرة قدم ضد صديقك',obj:TTT,multi:true,
 help:'<h3>طريقة لعب «إكس-أو الكورة»</h3><ol><li>العب على نفس الجوال، أو <b>أونلاين</b>: أنشئ غرفة وأرسل الرابط لصديقك.</li><li>الشبكة ٣×٣، وكل صف وعمود شرط.</li><li>في دورك اختر خانة واذكر لاعبًا يحقق شرطيها لتضع علامتك. الخطأ ينقل الدور.</li><li>أول من يكمل ثلاثًا في صف أو عمود أو قطر يفوز.</li><li>في <b>وضع السرقة</b> لكل لاعب ٣ سرقات: يأخذ خانة خصمه بلاعب مختلف.</li></ol>'});

/* ---------- الاستحواذ ---------- */
const POSS={
  id:'poss',title:'الاستحواذ',minPlayers:2,maxPlayers:2,localDesc:'لاعبان يتبادلان نفس الجوال',CLOCK:180,
  start(){MP.menu(this);},
  stop(){MP.stop();clearInterval(this._iv);},
  localSetup(){screen(this.title,this.id,'<div class="stack" style="margin-top:14px"><div class="card">'+namesInputs('pn',['اسم اللاعب الأخضر','اسم اللاعب الأحمر'])+'<p class="muted small" style="margin:0">لكل لاعب ساعة ٣ دقائق تعمل في دوره فقط.</p></div><button class="btn block" onclick="POSS.localBegin()">ابدأ المباراة</button></div>');},
  localBegin(){const names=[0,1].map(i=>($('#pn'+i).value.trim()||'اللاعب '+AR(i+1)));MP.mode='local';this.st=this.initState(names);this.draw();},
  initState(names){return {names:names.slice(0,2),cats:HEX.board(rng(Math.floor(Math.random()*4e9))),own:{},turn:0,clock:[this.CLOCK,this.CLOCK],t0:mpNow(),used:[],done:false};},
  fix(s){s.own=s.own||{};s.used=s.used||[];return s;},
  left(s,k){return (k===s.turn&&!s.done)?s.clock[k]-(mpNow()-s.t0)/1000:s.clock[k];},
  passIn(s){const now=mpNow();s.clock[s.turn]=Math.max(0,s.clock[s.turn]-(now-s.t0)/1000);const o=1-s.turn;
    if(s.clock[o]>0)s.turn=o;else if(s.clock[s.turn]<=0)s.done=true;s.t0=now;
    if(Object.keys(s.own).length>=31)s.done=true;},
  fmt(x){x=Math.max(0,Math.ceil(x));return AR(Math.floor(x/60))+':'+AR(String(x%60).padStart(2,'0'));},
  loop(){
    clearInterval(this._iv);
    this._iv=setInterval(()=>{const s=this.st;if(!s||s.done)return;
      const l=this.left(s,s.turn);const e=$('#pc'+s.turn);if(e)e.textContent=this.fmt(l);
      if(l<=0&&!this._exp){this._exp=true;const t=s.turn;closeSheet();MP.act(x=>{this.fix(x);if(x.done||x.turn!==t||this.left(x,t)>0.3)return false;x.clock[t]=0;this.passIn(x);}).then(()=>{this._exp=false;toast('انتهى وقت '+s.names[t]);});}
    },250);
  },
  draw(){
    const st=this.fix(this.st),cnt=[0,0];Object.values(st.own).forEach(o=>cnt[o]++);
    const board=HEX.html(i=>st.own['c'+i]===0?'a':st.own['c'+i]===1?'b':'',i=>shortCat(st.cats[i]),'POSS.pick',HEX.width());
    const col=['#30D158','#FF453A'];
    const side=k=>'<div class="card" style="flex:1;text-align:center;padding:10px;'+(st.turn===k&&!st.done?'box-shadow:0 0 0 2.5px '+col[k]:'')+'"><b style="color:'+col[k]+'">'+esc(st.names[k]||'…')+'</b><div class="big-num num">'+AR(cnt[k])+'</div><div class="small num muted" id="pc'+k+'">'+this.fmt(this.left(st,k))+'</div></div>';
    let msg;
    if(st.done){const w=cnt[0]===cnt[1]?null:(cnt[0]>cnt[1]?0:1);msg='<div class="card result pop"><div class="badge">🏆</div><h3>'+(w==null?'تعادل!':'فاز '+esc(st.names[w]))+'</h3><p>'+AR(cnt[0])+' – '+AR(cnt[1])+'</p>'+TTT.againBtn()+'</div>';}
    else msg='<div class="muted small" style="text-align:center">'+MP.statusLine(st.turn,st.names)+(MP.isMine(st.turn)?': اختر خلية محايدة':'')+'</div>';
    screen(this.title,this.id,'<div class="stack" style="margin-top:12px"><div style="display:flex;gap:8px">'+side(0)+side(1)+'</div>'+msg+'<div class="card" style="padding:10px">'+board+'</div></div>');
    this.loop();
  },
  pick(i){
    const st=this.st;if(st.done)return;if(!MP.isMine(st.turn)){toast('ليس دورك');return;}
    if(st.own['c'+i]!==undefined){toast('اختر خلية محايدة');return;}
    const turn=st.turn;
    pickPlayerSheet(shortCat(st.cats[i]),'اذكر لاعبًا يحقق الفئة. الخلايا الملاصقة التي يحققها تصبح لك أيضًا.',p=>this.play(i,p,turn),{isUsed:p=>st.used.includes(p.q)});
  },
  async play(i,p,turn){
    const cells=HEX.cells(),st=this.st,ok=catTest(st.cats[i])(p);let n=0,stolen=0;
    const fit=cells[i].nb.filter(x=>catTest(st.cats[x])(p));
    const done=await MP.act(s=>{
      this.fix(s);if(s.done||s.turn!==turn||s.own['c'+i]!==undefined)return false;
      n=0;stolen=0;
      if(ok){s.used.push(p.q);s.own['c'+i]=turn;n=1;for(const x of fit){if(s.own['c'+x]!==turn){if(s.own['c'+x]!==undefined)stolen++;s.own['c'+x]=turn;n++;}}}
      this.passIn(s);
    });
    if(done)toast(!ok?'✗ خطأ، الدور ينتقل':(stolen?'🔁 +'+AR(n)+' خلايا، منها '+AR(stolen)+' من الخصم':'+'+AR(n)+(n>1?' خلايا':' خلية')));
  }
};
registerGame({id:'poss',name:'الاستحواذ',desc:'نافس صديقك على السيطرة على اللوحة',obj:POSS,multi:true,
 help:'<h3>طريقة لعب «الاستحواذ»</h3><ol><li>العب على نفس الجوال، أو <b>أونلاين</b> بإرسال رابط الغرفة.</li><li>في دورك اختر خلية محايدة واذكر لاعبًا يحقق فئتها.</li><li>كل خلية مجاورة يحقق اللاعب فئتها تصبح لك أيضًا، حتى لو كانت لخصمك.</li><li>اللوحة مرتبة بحيث تشترك الخلايا المتجاورة في لاعبين، فابحث عن لاعب يربط أكبر عدد منها.</li><li>لكل لاعب ساعة ٣ دقائق تعمل في دوره فقط، والخطأ ينقل الدور.</li><li>عند امتلاء الخلايا الـ٣١ يفوز صاحب العدد الأكبر.</li></ol>'});

/* ---------- الدخيل ---------- */
const RING={
  id:'ringer',title:'الدخيل',minPlayers:3,maxPlayers:10,localDesc:'تمرير الجوال بين ٣ إلى ١٠ لاعبين',
  start(){MP.menu(this);},
  stop(){MP.stop();},
  localSetup(){MP.mode='local';RINGL.setup();},
  initState(names,o,prev){
    const n=names.length,pool=D.famous.slice(0,400),r=Math.random;
    return {names,score:prev&&prev.score&&prev.score.length===n?prev.score:new Array(n).fill(0),round:prev?(prev.round||1)+1:1,
      secret:pool[Math.floor(r()*pool.length)].q,ringer:Math.floor(r()*n),phase:'reveal',ready:{},order:shuffled([...Array(n).keys()],r),clues:[],ci:0,votes:{},msg:''};
  },
  fix(s){s.ready=s.ready||{};s.clues=s.clues||[];s.votes=s.votes||{};s.score=s.score||[];return s;},
  me(){return MP.seat;},
  draw(){
    const st=this.fix(this.st),me=this.me(),n=st.names.length,p=D.byQ[st.secret],isR=me===st.ringer;
    const host=MP.room&&MP.room.host===Online.uid;
    let body='';
    const clueList=st.clues.length?'<div class="card"><b>التلميحات</b>'+st.clues.map(c=>'<div class="tagrow" style="padding:8px 0;border-top:.5px solid var(--sep);margin-top:6px"><span class="muted small">'+esc(st.names[c.s])+'</span><span style="font-weight:600">'+esc(c.t)+'</span></div>').join('')+'</div>':'';
    if(st.phase==='reveal'){
      const ready=!!st.ready['s'+me],nr=Object.keys(st.ready).length;
      body=(isR?'<div class="card result"><div class="badge">🕵️</div><h3>أنت الدخيل!</h3><p>لا تعرف اللاعب السري. اندمج مع الآخرين وحاول معرفته من تلميحاتهم.</p></div>':
        '<div class="card result"><div class="badge">⚽</div><p>اللاعب السري</p><h3>'+flag(p.nat)+' '+esc(p.n)+'</h3><p>'+esc(tName(p.mainClub))+'</p></div>')+
        '<button class="btn block" '+(ready?'disabled':'')+' onclick="RING.ready()">'+(ready?'بانتظار البقية ('+AR(nr)+' من '+AR(n)+')':'جاهز')+'</button>';
    } else if(st.phase==='clues'){
      const cur=st.order[st.ci%n],mine=cur===me,roundN=Math.floor(st.ci/n)+1;
      body='<div class="card"><div class="tagrow"><b>جولة التلميحات '+AR(roundN)+' من ٢</b><span class="pill">'+(isR?'أنت الدخيل 🕵️':esc(p.n))+'</span></div><p class="muted small" style="margin:6px 0 0">'+(mine?'دورك: اكتب تلميحًا قصيرًا عن اللاعب دون أن تجعله واضحًا جدًا.':'دور <b>'+esc(st.names[cur])+'</b> في كتابة التلميح.')+'</p>'+
        (mine?'<form id="rcf" style="display:flex;gap:8px;margin-top:10px" autocomplete="off"><input class="field" id="rci" maxlength="40" placeholder="تلميحك…"><button class="btn" type="submit">أرسل</button></form>':'')+
        (host&&!mine?'<button class="btn ghost small" onclick="RING.skipClue()">تخطّي دور '+esc(st.names[cur])+'</button>':'')+'</div>'+clueList;
    } else if(st.phase==='vote'){
      const voted=st.votes['s'+me]!=null,nv=Object.keys(st.votes).length;
      body=(voted?'<div class="card muted" style="text-align:center"><div class="spin"></div>صوّتّ. بانتظار البقية ('+AR(nv)+' من '+AR(n)+')</div>':
        '<div class="card"><h3 class="disp" style="font-size:20px;margin-bottom:10px">من الدخيل؟</h3>'+st.names.map((nm,k)=>k===me?'':'<button class="opt" onclick="RING.vote('+k+')">'+esc(nm)+'</button>').join('')+'</div>')+clueList;
    } else if(st.phase==='guess'){
      body='<div class="card"><h3 class="disp" style="font-size:20px">انكشف الدخيل: '+esc(st.names[st.ringer])+'</h3>'+(isR?'<p class="muted">آخر فرصة: إن عرفت اللاعب السري تأخذ ٣ نقاط.</p>'+acHTML('rg','من هو اللاعب السري؟')+'<button class="btn danger block" style="margin-top:8px" onclick="RING.guess(null)">لا أعرف</button>':'<p class="muted">بانتظار تخمينه الأخير…</p>')+'</div>'+clueList;
    } else {
      body='<div class="card result pop"><div class="badge">'+(st.rw?'🕵️':'🛡️')+'</div><h3>'+esc(st.msg)+'</h3><p>اللاعب السري: <b>'+esc(p.n)+'</b> · الدخيل: <b>'+esc(st.names[st.ringer])+'</b></p></div>'+
        '<div class="card"><b>النقاط</b>'+st.names.map((nm,k)=>'<div class="tagrow" style="padding:8px 0;border-top:.5px solid var(--sep);margin-top:6px"><span>'+esc(nm)+(k===me?' (أنت)':'')+'</span><b class="num">'+AR(st.score[k]||0)+'</b></div>').join('')+'</div>'+TTT.againBtn();
    }
    screen(this.title,this.id,'<div class="stack" style="margin-top:12px"><div class="muted small" style="text-align:center">الجولة '+AR(st.round||1)+' · '+AR(n)+' لاعبين</div>'+body+'</div>');
    if(st.phase==='clues'&&$('#rcf'))$('#rcf').addEventListener('submit',e=>{e.preventDefault();this.clue($('#rci').value);});
    if(st.phase==='guess'&&isR)bindAC($('#rg'),$('#rgL'),x=>this.guess(x));
  },
  ready(){const me=this.me();MP.act(s=>{this.fix(s);if(s.phase!=='reveal')return false;s.ready['s'+me]=true;if(Object.keys(s.ready).length>=s.names.length)s.phase='clues';});},
  clue(t){t=String(t||'').trim().slice(0,40);if(!t){toast('اكتب تلميحًا');return;}const me=this.me(),ci=this.st.ci;
    MP.act(s=>{this.fix(s);const n=s.names.length;if(s.phase!=='clues'||s.ci!==ci||s.order[ci%n]!==me)return false;s.clues.push({s:me,t});s.ci++;if(s.ci>=n*2)s.phase='vote';});},
  skipClue(){const ci=this.st.ci;MP.act(s=>{this.fix(s);const n=s.names.length;if(s.phase!=='clues'||s.ci!==ci)return false;s.ci++;if(s.ci>=n*2)s.phase='vote';});},
  vote(k){const me=this.me();MP.act(s=>{this.fix(s);if(s.phase!=='vote'||s.votes['s'+me]!=null)return false;s.votes['s'+me]=k;if(Object.keys(s.votes).length>=s.names.length)this.tally(s);});},
  tally(s){
    const n=s.names.length,cnt=new Array(n).fill(0);Object.values(s.votes).forEach(v=>cnt[v]++);
    const mx=Math.max(...cnt),top=cnt.map((c,k)=>c===mx?k:-1).filter(k=>k>=0);
    if(top.length===1&&top[0]===s.ringer){s.phase='guess';return;}
    const missed=Object.entries(s.votes).filter(([v,t])=>+v.slice(1)!==s.ringer&&t!==s.ringer).length;
    s.score[s.ringer]=(s.score[s.ringer]||0)+missed;s.rw=true;s.msg='الدخيل '+s.names[s.ringer]+' نجا! +'+missed;s.phase='result';
  },
  guess(p){
    MP.act(s=>{this.fix(s);if(s.phase!=='guess')return false;
      if(p&&p.q===s.secret){s.score[s.ringer]=(s.score[s.ringer]||0)+3;s.rw=true;s.msg='الدخيل عرف اللاعب وخطف الفوز! +٣';}
      else{s.rw=false;s.msg='فاز الفريق!';Object.entries(s.votes).forEach(([v,t])=>{if(t===s.ringer){const k=+v.slice(1);s.score[k]=(s.score[k]||0)+1;}});}
      s.phase='result';});
  }
};
registerGame({id:'ringer',name:'الدخيل',desc:'لعبة جماعية: اكتشفوا من لا يعرف اللاعب السري',obj:RING,multi:true,
 help:'<h3>طريقة لعب «الدخيل»</h3><ol><li>من ٣ إلى ١٠ لاعبين: بتمرير جوال واحد، أو <b>أونلاين</b> كل واحد من جواله.</li><li>كل لاعب يرى اللاعب السري، إلا واحدًا: <b>الدخيل</b>.</li><li>تتبادلون تلميحات قصيرة (جولتان). الفريق يحاول كشف الدخيل دون أن يجعل اللاعب واضحًا جدًا.</li><li>بعدها يصوّت كل لاعب سرًّا.</li><li>إذا لم يحصل الدخيل على أكثر الأصوات يفوز ويأخذ نقطة عن كل من لم يصوّت عليه.</li><li>إذا كُشف، له فرصة أخيرة لتخمين اللاعب: إن أصاب أخذ ٣ نقاط، وإن أخطأ أخذ كل من صوّت عليه نقطة.</li></ol>'});
