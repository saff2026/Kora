/* =================== الدخيل على نفس الجهاز (تمرير الجوال) =================== */
const RINGL={
  setup(){
    const saved=store.get('ringer:names',['','','','']);
    screen('الدخيل','ringer','<div class="stack" style="margin-top:14px"><div class="card"><h3 class="disp">لعبة جماعية بتمرير الجوال</h3><p class="muted small">من ٣ إلى ١٠ لاعبين. اكتب الأسماء.</p><div id="rnames">'+saved.map((n,i)=>'<input class="field rn" style="margin-top:6px" placeholder="اسم اللاعب '+AR(i+1)+'" value="'+esc(n)+'">').join('')+'</div><div class="btns" style="margin-top:8px"><button class="btn sec" onclick="RINGL.addName()">+ لاعب</button></div><button class="btn block" style="margin-top:12px" onclick="RINGL.begin()">ابدأ الجولة</button></div></div>');
  },
  addName(){if($$('.rn').length>=10)return;const i=document.createElement('input');i.className='field rn';i.style.marginTop='6px';i.placeholder='اسم اللاعب';$('#rnames').appendChild(i);i.focus();},
  begin(){
    const names=$$('.rn').map(i=>i.value.trim()).filter(Boolean);
    if(names.length<3){toast('تحتاج ٣ لاعبين على الأقل');return;}
    store.set('ringer:names',names);
    const score=this.st&&this.st.names.join()===names.join()?this.st.score:names.map(()=>0);
    const pool=D.famous.slice(0,400);const p=pool[Math.floor(Math.random()*pool.length)];
    this.st={names,score,secret:p.q,ringer:Math.floor(Math.random()*names.length),step:'reveal',i:0,shown:false,votes:[],vi:0};
    this.draw();
  },
  draw(){
    const st=this.st,p=D.byQ[st.secret];let body='';
    if(st.step==='reveal'){
      if(st.i>=st.names.length){st.step='clues';return this.draw();}
      body=!st.shown?'<div class="card result"><div class="em">📱</div><h3>سلّم الجوال إلى '+esc(st.names[st.i])+'</h3><p>لا تدع أحدًا يرى الشاشة.</p><button class="btn block" onclick="RINGL.st.shown=true;RINGL.draw()">أنا '+esc(st.names[st.i])+'، اكشف</button></div>':
        (st.i===st.ringer?'<div class="card result"><div class="em">🕵️</div><h3>أنت الدخيل!</h3><p>لا تعرف اللاعب. اندمج مع الآخرين وحاول معرفته من تلميحاتهم.</p><button class="btn block" onclick="RINGL.nextReveal()">تم، أخفِ الشاشة</button></div>':
         '<div class="card result"><div class="em">⚽</div><p>اللاعب السري:</p><h3>'+flag(p.nat)+' '+esc(p.n)+'</h3><p>'+esc(tName(p.mainClub))+'</p><button class="btn block" onclick="RINGL.nextReveal()">حفظته، أخفِ الشاشة</button></div>');
    } else if(st.step==='clues'){
      const start=Math.floor(Math.random()*st.names.length);
      body='<div class="card"><h3 class="disp">جولة التلميحات</h3><p class="muted">كل لاعب يقول تلميحًا قصيرًا عن اللاعب السري بالترتيب، بدون أن يجعله واضحًا جدًا. الدخيل يحاول أن يندمج.</p><ol>'+st.names.map((n,k)=>'<li>'+esc(st.names[(start+k)%st.names.length])+'</li>').join('')+'</ol><p class="muted small">يمكنكم عمل جولتين من التلميحات قبل التصويت.</p><button class="btn block" onclick="RINGL.st.step=\'vote\';RINGL.st.shown=false;RINGL.draw()">انتقلوا للتصويت</button></div>';
    } else if(st.step==='vote'){
      if(st.vi>=st.names.length){this.tally();return;}
      const v=st.names[st.vi];
      body=!st.shown?'<div class="card result"><div class="em">🗳️</div><h3>سلّم الجوال إلى '+esc(v)+'</h3><button class="btn block" onclick="RINGL.st.shown=true;RINGL.draw()">أنا '+esc(v)+'</button></div>':
        '<div class="card"><h3 class="disp">'+esc(v)+': من الدخيل؟</h3>'+st.names.map((n,k)=>k===st.vi?'':'<button class="opt" onclick="RINGL.vote('+k+')">'+esc(n)+'</button>').join('')+'</div>';
    } else if(st.step==='guess'){
      body='<div class="card"><h3 class="disp">انكشف الدخيل: '+esc(st.names[st.ringer])+'</h3><p class="muted">آخر فرصة: إذا عرف اللاعب السري يفوز بـ٣ نقاط.</p>'+acHTML('rg','من هو اللاعب السري؟')+'<button class="btn danger block" style="margin-top:10px" onclick="RINGL.guess(null)">لا أعرف</button></div>';
    } else if(st.step==='result'){
      body='<div class="card result pop"><div class="em">'+(st.rw?'🕵️':'🛡️')+'</div><h3>'+esc(st.msg)+'</h3><p>اللاعب السري كان: <b>'+esc(p.n)+'</b></p></div><div class="card"><h3 class="disp" style="margin-bottom:6px">النقاط</h3>'+st.names.map((n,k)=>'<div class="tagrow" style="padding:4px 0"><span>'+esc(n)+'</span><b class="num">'+AR(st.score[k])+'</b></div>').join('')+'<button class="btn block" style="margin-top:12px" onclick="RINGL.begin2()">جولة جديدة</button></div>';
    }
    screen('الدخيل','ringer','<div class="stack" style="margin-top:12px">'+body+'</div>');
    if(st.step==='guess')bindAC($('#rg'),$('#rgL'),x=>this.guess(x));
  },
  begin2(){const st=this.st;const pool=D.famous.slice(0,400);st.secret=pool[Math.floor(Math.random()*pool.length)].q;st.ringer=Math.floor(Math.random()*st.names.length);st.step='reveal';st.i=0;st.shown=false;st.votes=[];st.vi=0;this.draw();},
  nextReveal(){this.st.i++;this.st.shown=false;this.draw();},
  vote(k){this.st.votes.push(k);this.st.vi++;this.st.shown=false;this.draw();},
  tally(){
    const st=this.st,cnt=st.names.map((n,k)=>st.votes.filter(v=>v===k).length),mx=Math.max(...cnt);
    const top=cnt.map((c,k)=>c===mx?k:-1).filter(k=>k>=0);
    if(top.length===1&&top[0]===st.ringer){st.step='guess';}
    else{const missed=st.votes.filter((v,k)=>k!==st.ringer&&v!==st.ringer).length;st.score[st.ringer]+=missed;st.rw=true;st.msg='الدخيل '+st.names[st.ringer]+' نجا! +'+missed;st.step='result';}
    this.draw();
  },
  guess(p){
    const st=this.st;
    if(p&&p.q===st.secret){st.score[st.ringer]+=3;st.rw=true;st.msg='الدخيل عرف اللاعب وخطف الفوز! +٣';}
    else{st.rw=false;st.msg='فاز الفريق!';st.votes.forEach((v,k)=>{if(v===st.ringer)st.score[k]+=1;});}
    st.step='result';this.draw();
  },
};
