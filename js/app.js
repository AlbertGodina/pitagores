// app.js — Interactive widgets

// ── HINTS & SOLUTIONS ────────────────────
function initCards(){
  // Hints toggles
  document.querySelectorAll('.hints-btn').forEach(btn=>{
    const body = btn.nextElementSibling;
    btn.addEventListener('click',()=>{
      const open = body.classList.toggle('open');
      btn.innerHTML = open ? t('hide_hints') : t('show_hints');
    });
  });
  // Hint nav
  document.querySelectorAll('.hints-body').forEach(body=>{
    const pills = [...body.querySelectorAll('.hint-pill')];
    const nav = body.querySelector('.hint-nav');
    if(!nav || !pills.length) return;
    const btnP = nav.querySelector('.hn-prev');
    const btnN = nav.querySelector('.hn-next');
    const cnt  = nav.querySelector('.hn-count');
    let vis = 0;
    const upd = ()=>{
      cnt.textContent = `${vis} ${t('of')} ${pills.length}`;
      btnP.disabled = vis===0; btnN.disabled = vis===pills.length;
    };
    btnN.addEventListener('click',()=>{ if(vis<pills.length){ pills[vis].classList.add('show'); vis++; upd(); }});
    btnP.addEventListener('click',()=>{ if(vis>0){ vis--; pills[vis].classList.remove('show'); upd(); }});
    upd();
  });
  // Solution toggles
  document.querySelectorAll('.sol-btn').forEach(btn=>{
    const panel = btn.nextElementSibling;
    btn.addEventListener('click',()=>{
      const open = panel.classList.toggle('open');
      btn.innerHTML = open ? t('hide_sol') : t('show_sol');
    });
  });
}

// ── PYTHAGOREAN CALCULATOR ────────────────
function initCalc(id){
  const wrap = document.getElementById(id);
  if(!wrap) return;
  const modes = wrap.querySelectorAll('.calc-mode-row button');
  const iA = wrap.querySelector('#ci-a');
  const iB = wrap.querySelector('#ci-b');
  const iC = wrap.querySelector('#ci-c');
  const out = wrap.querySelector('.calc-out');
  const go  = wrap.querySelector('.calc-go');
  let mode = 'c';

  function applyMode(m){
    mode=m;
    modes.forEach(b=>b.classList.toggle('active',b.dataset.mode===m));
    iA.disabled = m==='a'; iB.disabled = m==='b'; iC.disabled = m==='c';
    if(m==='a'){ iA.value=''; iA.placeholder=t('calc_unknown'); iB.placeholder=''; iC.placeholder=''; }
    else if(m==='b'){ iB.value=''; iB.placeholder=t('calc_unknown'); iA.placeholder=''; iC.placeholder=''; }
    else { iC.value=''; iC.placeholder=t('calc_unknown'); iA.placeholder=''; iB.placeholder=''; }
    out.textContent=''; out.style.color='var(--green)';
  }
  modes.forEach(b=>b.addEventListener('click',()=>applyMode(b.dataset.mode)));
  applyMode('c');

  function calc(){
    const a=parseFloat(iA.value), b=parseFloat(iB.value), c=parseFloat(iC.value);
    if(mode==='c'){
      if(isNaN(a)||isNaN(b)||a<=0||b<=0){ out.textContent=t('calc_err'); out.style.color='var(--red)'; return; }
      const v=Math.sqrt(a*a+b*b);
      out.innerHTML=`c = √(${a}²+${b}²) = √${a*a+b*b} ≈ <strong>${v.toFixed(4)}</strong>`;
    } else if(mode==='a'){
      if(isNaN(b)||isNaN(c)||b<=0||c<=0){ out.textContent=t('calc_err'); out.style.color='var(--red)'; return; }
      if(c<=b){ out.textContent=t('calc_err_imp'); out.style.color='var(--red)'; return; }
      const v=Math.sqrt(c*c-b*b);
      out.innerHTML=`a = √(${c}²−${b}²) = √${c*c-b*b} ≈ <strong>${v.toFixed(4)}</strong>`;
    } else {
      if(isNaN(a)||isNaN(c)||a<=0||c<=0){ out.textContent=t('calc_err'); out.style.color='var(--red)'; return; }
      if(c<=a){ out.textContent=t('calc_err_imp'); out.style.color='var(--red)'; return; }
      const v=Math.sqrt(c*c-a*a);
      out.innerHTML=`b = √(${c}²−${a}²) = √${c*c-a*a} ≈ <strong>${v.toFixed(4)}</strong>`;
    }
    out.style.color='var(--green)';
  }
  go.addEventListener('click',calc);
  [iA,iB,iC].forEach(i=>i?.addEventListener('keydown',e=>e.key==='Enter'&&calc()));
  window.onLangChange = ()=>applyMode(mode);
}

// ── GEOBOARD ─────────────────────────────
function initGeoboard(svgId, statusId){
  const svg = document.getElementById(svgId);
  const statusEl = document.getElementById(statusId);
  if(!svg) return;
  const G=4, SP=46, OFF=26;
  let pts=[];
  const triG = document.createElementNS('http://www.w3.org/2000/svg','g');
  svg.insertBefore(triG,svg.firstChild);

  for(let r=0;r<G;r++) for(let c=0;c<G;c++){
    const cx=OFF+c*SP, cy=OFF+r*SP;
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx',cx); dot.setAttribute('cy',cy); dot.setAttribute('r',5);
    dot.setAttribute('fill','var(--border)'); dot.setAttribute('stroke','var(--dim)');
    dot.setAttribute('stroke-width',1); dot.style.cursor='pointer';
    dot.addEventListener('mouseenter',()=>{ if(!dot._sel) dot.setAttribute('fill','var(--primary)'); });
    dot.addEventListener('mouseleave',()=>{ if(!dot._sel) dot.setAttribute('fill','var(--border)'); });
    dot.addEventListener('click',()=>onDot(dot,cx,cy));
    svg.appendChild(dot);
  }

  function onDot(dot,x,y){
    if(pts.length>=3) return;
    if(pts.find(p=>p.x===x&&p.y===y)) return;
    pts.push({x,y,dot}); dot._sel=true;
    dot.setAttribute('fill','var(--primary)'); dot.setAttribute('stroke','var(--primary)');
    if(pts.length===3) drawTri();
    else setStatus(`${t('geo_sides')}: ${pts.length}/3`,'var(--dim)');
  }

  function d2(a,b){ return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }

  function drawTri(){
    triG.innerHTML='';
    const [p1,p2,p3]=pts;
    const poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points',`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`);
    poly.setAttribute('fill','rgba(56,189,248,0.1)'); poly.setAttribute('stroke','var(--primary)'); poly.setAttribute('stroke-width',2);
    triG.appendChild(poly);

    const s1=d2(p1,p2), s2=d2(p2,p3), s3=d2(p1,p3);
    const sides=[s1,s2,s3].sort((a,b)=>b-a);
    const isRight = Math.abs(sides[0]**2 - sides[1]**2 - sides[2]**2) < 0.5;

    if(isRight){
      // draw right-angle marker at the vertex opposite the hypotenuse
      const combos=[{v:p1,a:p2,b:p3},{v:p2,a:p1,b:p3},{v:p3,a:p1,b:p2}];
      for(const c of combos){
        const dot2=c.a.x*c.b.x+c.a.y*c.b.y - (c.a.x+c.b.x)*c.v.x - (c.a.y+c.b.y)*c.v.y + c.v.x*c.v.x + c.v.y*c.v.y;
        // vector approach
        const da={x:c.a.x-c.v.x,y:c.a.y-c.v.y};
        const db={x:c.b.x-c.v.x,y:c.b.y-c.v.y};
        const dp=da.x*db.x+da.y*db.y;
        if(Math.abs(dp)<1){
          const S=9;
          const la=Math.sqrt(da.x**2+da.y**2), lb=Math.sqrt(db.x**2+db.y**2);
          const ua={x:da.x/la,y:da.y/la}, ub={x:db.x/lb,y:db.y/lb};
          const pa={x:c.v.x+ua.x*S,y:c.v.y+ua.y*S};
          const pb={x:c.v.x+ub.x*S,y:c.v.y+ub.y*S};
          const pm={x:pa.x+ub.x*S,y:pa.y+ub.y*S};
          const sq=document.createElementNS('http://www.w3.org/2000/svg','polyline');
          sq.setAttribute('points',`${pa.x},${pa.y} ${pm.x},${pm.y} ${pb.x},${pb.y}`);
          sq.setAttribute('fill','none'); sq.setAttribute('stroke','var(--accent)'); sq.setAttribute('stroke-width',1.8);
          triG.appendChild(sq);
          break;
        }
      }
    }

    const area=Math.abs((p1.x*(p2.y-p3.y)+p2.x*(p3.y-p1.y)+p3.x*(p1.y-p2.y))/2)/SP**2;
    const perim=(s1+s2+s3)/SP;
    const col = isRight?'var(--green)':'var(--accent)';
    const lbl = isRight?t('geo_right'):t('geo_not');
    statusEl.innerHTML=`<span style="color:${col};font-weight:600">${lbl}</span><br>
      <span style="font-size:0.75rem;color:var(--muted)">${t('geo_sides')}: ${(s1/SP).toFixed(2)}, ${(s2/SP).toFixed(2)}, ${(s3/SP).toFixed(2)} u<br>
      ${t('geo_perim')}: ${perim.toFixed(3)} u · ${t('geo_area')}: ${area.toFixed(3)} u²</span>`;
  }

  function setStatus(msg,col){ statusEl.innerHTML=`<span style="color:${col||'var(--dim)'}">${msg}</span>`; }

  document.getElementById(svgId+'-clear')?.addEventListener('click',()=>{
    pts=[]; triG.innerHTML='';
    svg.querySelectorAll('circle').forEach(c=>{ c._sel=false; c.setAttribute('fill','var(--border)'); c.setAttribute('stroke','var(--dim)'); });
    setStatus(t('geo_hint'));
  });
  setStatus(t('geo_hint'));
}

// ── HEXAGON TOOL ─────────────────────────
function initHexTool(svgId){
  const svg=document.getElementById(svgId);
  if(!svg) return;
  const infoEl=document.getElementById(svgId+'-info');
  const sideInp=document.getElementById(svgId+'-side');
  let decomp=false;

  function render(){
    svg.innerHTML='';
    const s = parseFloat(sideInp?.value)||1;
    const CX=95,CY=95,R=70*Math.min(s,3)/3;
    const verts=Array.from({length:6},(_,i)=>{
      const a=(i*60-30)*Math.PI/180;
      return {x:CX+R*Math.cos(a),y:CY+R*Math.sin(a)};
    });
    const COLS=['#38bdf8','#fb923c','#34d399','#a78bfa','#f472b6','#fbbf24'];

    if(decomp){
      for(let i=0;i<6;i++){
        const tri=document.createElementNS('http://www.w3.org/2000/svg','polygon');
        tri.setAttribute('points',`${CX},${CY} ${verts[i].x},${verts[i].y} ${verts[(i+1)%6].x},${verts[(i+1)%6].y}`);
        tri.setAttribute('fill',COLS[i]+'28'); tri.setAttribute('stroke',COLS[i]); tri.setAttribute('stroke-width',1.5);
        svg.appendChild(tri);
      }
      // height line on one triangle
      const mid={x:(verts[0].x+verts[1].x)/2,y:(verts[0].y+verts[1].y)/2};
      const hl=document.createElementNS('http://www.w3.org/2000/svg','line');
      hl.setAttribute('x1',CX);hl.setAttribute('y1',CY);hl.setAttribute('x2',mid.x);hl.setAttribute('y2',mid.y);
      hl.setAttribute('stroke','var(--accent)');hl.setAttribute('stroke-width',2);hl.setAttribute('stroke-dasharray','4,3');
      svg.appendChild(hl);
      // h label
      addText(svg,(CX+mid.x)/2-10,(CY+mid.y)/2,'h','var(--accent)','10');
      addText(svg,(CX+verts[0].x)/2+4,(CY+verts[0].y)/2-4,'s','var(--primary)','10');
    }

    const hex=document.createElementNS('http://www.w3.org/2000/svg','polygon');
    hex.setAttribute('points',verts.map(v=>`${v.x},${v.y}`).join(' '));
    hex.setAttribute('fill','rgba(56,189,248,0.06)'); hex.setAttribute('stroke','var(--primary)'); hex.setAttribute('stroke-width',2.5);
    svg.appendChild(hex);

    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx',CX);dot.setAttribute('cy',CY);dot.setAttribute('r',3);dot.setAttribute('fill','var(--primary)');
    svg.appendChild(dot);
    addText(svg,CX+5,CY+16,`s=${s}`,'var(--muted)','9');

    const h = s*Math.sqrt(3)/2;
    const area = 6*(s*s*Math.sqrt(3)/4);
    if(infoEl) infoEl.innerHTML=decomp
      ? `h = √3/2 · ${s} ≈ <strong>${h.toFixed(3)} cm</strong><br>Àrea = 6 × (√3/4 · ${s}²) ≈ <strong>${area.toFixed(3)} cm²</strong>`
      : `Costat = <strong>${s} cm</strong>. Prem el botó per descompondre.`;
  }

  function addText(svg,x,y,txt,col,size){
    const el=document.createElementNS('http://www.w3.org/2000/svg','text');
    el.setAttribute('x',x);el.setAttribute('y',y);el.setAttribute('fill',col||'var(--text)');
    el.setAttribute('font-size',size||'11');el.setAttribute('font-family','DM Mono,monospace');el.setAttribute('text-anchor','middle');
    el.textContent=txt; svg.appendChild(el);
  }

  render();
  sideInp?.addEventListener('input',render);
  document.getElementById(svgId+'-decomp')?.addEventListener('click',()=>{ decomp=!decomp; render(); });
  document.getElementById(svgId+'-reset')?.addEventListener('click',()=>{ decomp=false; if(sideInp) sideInp.value=1; render(); });
}

// ── COORDINATE PLOTTER ────────────────────
function initCoords(canvasId, resId){
  const canvas=document.getElementById(canvasId);
  const resEl=document.getElementById(resId);
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const OX=W/2, OY=H/2, SC=18;

  function tc(x,y){ return {x:OX+x*SC, y:OY-y*SC}; }

  function draw(x1,y1,x2,y2){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle='#243044'; ctx.lineWidth=0.8;
    for(let x=0;x<W;x+=SC){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=SC){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // axes
    ctx.strokeStyle='#64748b'; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,OY);ctx.lineTo(W,OY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(OX,0);ctx.lineTo(OX,H);ctx.stroke();
    // tick labels
    ctx.fillStyle='#64748b'; ctx.font='9px DM Mono,monospace'; ctx.textAlign='center';
    for(let i=-12;i<=12;i++){
      if(i===0) continue;
      const px=tc(i,0), py=tc(0,i);
      if(px.x>8&&px.x<W-8) ctx.fillText(i,px.x,OY+12);
      if(py.y>8&&py.y<H-8){ ctx.textAlign='right'; ctx.fillText(i,OX-3,py.y+3); ctx.textAlign='center'; }
    }
    // right triangle legs (dashed)
    const p1=tc(x1,y1), p2=tc(x2,y2);
    ctx.strokeStyle='rgba(56,189,248,0.4)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
    ctx.setLineDash([]);
    // hypotenuse
    ctx.strokeStyle='#fb923c'; ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
    // points
    [[p1,'#38bdf8'],[p2,'#34d399']].forEach(([p,c])=>{
      ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);
      ctx.fillStyle=c;ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();
    });
    // labels
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 11px Outfit,sans-serif'; ctx.textAlign='left';
    ctx.fillText(`P₁(${x1},${y1})`,p1.x+7,p1.y-7);
    ctx.fillText(`P₂(${x2},${y2})`,p2.x+7,p2.y-7);
    // distance label
    const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
    const d=Math.sqrt((x2-x1)**2+(y2-y1)**2);
    ctx.fillStyle='#fb923c'; ctx.font='10px DM Mono,monospace'; ctx.textAlign='center';
    ctx.fillText(`≈${d.toFixed(2)}`,mx,my-10);
    if(resEl){
      const dx=x2-x1, dy=y2-y1;
      resEl.innerHTML=`d = √((${x2}−${x1})²+(${y2}−${y1})²)<br>= √(${dx*dx}+${dy*dy}) ≈ <strong>${d.toFixed(4)}</strong>`;
    }
  }

  const ids=['x1','y1','x2','y2'];
  const vals=[2,1,7,9];
  ids.forEach((id,i)=>{ const el=document.getElementById(canvasId+'-'+id); if(el) el.value=vals[i]; });

  function update(){
    const get=id=>parseFloat(document.getElementById(canvasId+'-'+id)?.value)||0;
    draw(get('x1'),get('y1'),get('x2'),get('y2'));
  }
  ids.forEach(id=>document.getElementById(canvasId+'-'+id)?.addEventListener('input',update));
  update();
}

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  initLang();
  initCards();
  initCalc('pyth-calc');
  initGeoboard('geo-svg','geo-status');
  initHexTool('hex-svg');
  initCoords('coord-canvas','coord-res');
});
