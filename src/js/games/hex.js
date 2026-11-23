/* =================== أدوات لوحة الخلايا السداسية =================== */
const HEX={
  ROWS:[4,5,4,5,4,5,4], // ٣١ خلية
  cells(){
    if(this._c)return this._c;const out=[];
    this.ROWS.forEach((n,r)=>{for(let c=0;c<n;c++)out.push({r,c,i:out.length});});
    out.forEach(a=>{a.nb=out.filter(b=>{
      if(b===a)return false;
      if(b.r===a.r)return Math.abs(b.c-a.c)===1;
      if(Math.abs(b.r-a.r)!==1)return false;
      return this.ROWS[a.r]===4?(b.c===a.c||b.c===a.c+1):(b.c===a.c-1||b.c===a.c);
    }).map(b=>b.i);});
    return this._c=out;
  },
  html(cls,label,onclick,width){
    const W=Math.min(width||360,560),w=Math.floor(W/5.2),h=w*1.1547;
    const cells=this.cells();
    const body=cells.map(c=>{const x=(this.ROWS[c.r]===4?w/2:0)+c.c*w*1.02,y=c.r*h*0.77;return '<button class="hx '+cls(c.i)+'" style="left:'+x+'px;top:'+y+'px" onclick="'+onclick+'('+c.i+')">'+label(c.i)+'</button>';}).join('');
    return '<div class="hexwrap"><div class="hexb" style="--hw:'+w+'px;width:'+(5*w*1.02)+'px;height:'+(6*h*0.77+h)+'px">'+body+'</div></div>';
  },
  /* لوحة منطقية: كل خلية تُختار بحيث تشترك مع جاراتها في لاعبين، فتتكوّن سلاسل يمكن ربطها */
  board(r){
    const C=allCats();const pool=[].concat(C.club,C.nat,C.lg,C.aw.filter(c=>c.n>=8));
    const cells=this.cells(),N=cells.length;
    const LIM={club:16,nat:8,lg:5,aw:3};
    for(let attempt=0;attempt<30;attempt++){
      const out=new Array(N).fill(null),used=new Set(),cnt={club:0,nat:0,lg:0,aw:0};
      // ترتيب الملء: من المركز إلى الأطراف
      const start=Math.floor(N/2),order=[start],seen=new Set([start]);
      for(let i=0;i<order.length;i++)for(const nb of cells[order[i]].nb)if(!seen.has(nb)){seen.add(nb);order.push(nb);}
      let ok=true;
      for(const ci of order){
        const placed=cells[ci].nb.filter(x=>out[x]).map(x=>out[x]);
        const cand=[];
        for(const c of pool){
          if(used.has(catKey(c))||cnt[c.k]>=LIM[c.k])continue;
          if(!placed.length){cand.push([r(),c]);continue;}
          const ov=placed.map(p=>catOverlap(c,p));
          const linked=ov.filter(v=>v>=3).length;
          // يجب أن تتصل بجارتين على الأقل (أو بكل الجيران إن كانوا أقل)، وألا تكون معزولة
          if(linked<Math.min(2,placed.length))continue;
          const score=ov.reduce((a,v)=>a+Math.min(v,12),0)+linked*6+r()*10;
          cand.push([score,c]);
        }
        if(!cand.length){ok=false;break;}
        cand.sort((a,b)=>b[0]-a[0]);
        const pick=cand[Math.floor(r()*Math.min(5,cand.length))][1];
        out[ci]=pick;used.add(catKey(pick));cnt[pick.k]++;
      }
      if(ok)return out;
    }
    return pickN(pool,N,r);
  },
  width(){return Math.min(window.innerWidth-60,560);}
};
function shortCat(c){const l=catLabel(c);return esc(l.replace('لعب في ','دوري ').replace(/^نادي /,''));}

/* =================== خريطة الحرارة (The Heatmap) =================== */
const HEAT={
  start(mode){
    mode=mode||this.mode||'daily';this.mode=mode;
    const fresh=()=>({cats:HEX.board(rng(seedFor('heat',mode))),heat:{},used:[],score:0,moves:0,done:false});
    this.st=mode==='daily'?dayState('heat',fresh):fresh();this.sel=null;this.draw();
  },
  save(){if(this.mode==='daily')saveDay('heat',this.st);},
  draw(){
    const st=this.st,claimed=Object.keys(st.heat).length;
    const board=HEX.html(i=>{const h=st.heat[i]||0;return (this.sel===i?'sel ':'')+(h?'h'+Math.min(5,h):'');},i=>shortCat(st.cats[i]),'HEAT.pick',HEX.width());
    const dens=claimed?(Object.values(st.heat).reduce((a,b)=>a+b,0)/claimed):0;
    let top;
    if(st.done)top=resultCard({em:'🔥',title:'نقاطك: '+AR(st.score),sub:'في '+AR(st.moves)+' حركة · كثافة الحرارة '+AR(dens.toFixed(1)),daily:this.mode==='daily',game:'heat',share:'HEAT.share()',again:"HEAT.start('free')",againLabel:'لوحة جديدة'});
    else top='<div class="card"><div class="tagrow"><span class="pill a num">'+AR(st.score)+' نقطة</span><span class="muted small">'+AR(claimed)+' / ٣١ · '+AR(st.moves)+' حركة</span></div><p class="muted small" style="margin:8px 0 0">اختر خلية ثم اذكر لاعبًا يحققها. ينتشر اختيارك عبر الخلايا المتصلة التي يحققها اللاعب نفسه.</p><div style="text-align:center"><button class="btn danger small" onclick="HEAT.end()">إنهاء</button></div></div>';
    screen('خريطة الحرارة','heat',modeSeg('HEAT',this.mode)+'<div class="stack" style="margin-top:12px">'+top+'<div class="card" style="padding:10px">'+board+'</div></div>');
  },
  pick(i){
    const st=this.st;if(st.done)return;if(st.heat[i]){toast('هذه الخلية محجوزة، ابدأ من خلية فارغة');return;}
    this.sel=i;this.draw();
    pickPlayerSheet(shortCat(st.cats[i]),'اذكر لاعبًا يحقق هذه الفئة.',p=>this.play(i,p),{isUsed:p=>st.used.includes(p.q)});
  },
  play(i,p){
    const st=this.st,cells=HEX.cells();this.sel=null;
    if(!catTest(st.cats[i])(p)){toast('✗ '+p.n+' لا يحقق الفئة');st.moves++;this.save();this.draw();return;}
    st.used.push(p.q);
    const seen=new Set([i]),q=[i];
    while(q.length){const x=q.shift();for(const n of cells[x].nb){if(!seen.has(n)&&catTest(st.cats[n])(p)){seen.add(n);q.push(n);}}}
    let nw=0,re=0;seen.forEach(x=>{if(st.heat[x]){re++;}else nw++;st.heat[x]=(st.heat[x]||0)+1;});
    const pts=nw*(nw+1)/2+re;st.score+=pts;st.moves++;
    toast('🔥 '+AR(seen.size)+' خلايا · +'+AR(pts));
    if(Object.keys(st.heat).length===31)this.end();
    this.save();this.draw();
  },
  end(){const st=this.st;st.done=true;if(this.mode==='daily')recordResult('heat',Object.keys(st.heat).length===31,st.score);this.save();this.draw();},
  share(){share('تحدّي الكورة · خريطة الحرارة #'+DAYNO+'\n🔥 '+this.st.score+' نقطة في '+this.st.moves+' حركة');}
};
registerGame({id:'heat',name:'خريطة الحرارة',desc:'سخّن اللوحة بسلاسل من الخلايا المتصلة',color:'linear-gradient(160deg,#E4572E,#7C1D0F)',ic:'⬢',obj:HEAT,
 help:'<h3>طريقة لعب «خريطة الحرارة»</h3><ol><li>كل خلية فيها فئة: نادٍ، منتخب، دوري، أو جائزة.</li><li>اختر خلية فارغة واذكر لاعبًا يحققها.</li><li>ينتشر اللاعب عبر الخلايا المتصلة التي يحقق فئاتها، ويتوقف عند فئة لا يحققها.</li><li>نقاط الخلايا الجديدة تتضاعف: ١ خلية = ١، ٢ = ٣، ٣ = ٦، ٤ = ١٠ وهكذا.</li><li>الخلايا المحجوزة التي يمر بها اللاعب تسخن أكثر وتضيف نقطة لكل منها.</li><li>املأ اللوحة كاملة. لا يمكن تكرار اللاعب.</li></ol>'});

