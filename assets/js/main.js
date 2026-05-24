
const menuBtn = document.querySelector('[data-menu]');
const navLinks = document.querySelector('.navlinks');
if(menuBtn) menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click', e=>{
  const target=document.querySelector(a.getAttribute('href'));
  if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); navLinks?.classList.remove('open'); }
}));

const kpiMap = [
  {id:'k1',end:20,suffix:'+'},
  {id:'k2',end:100,suffix:'K'},
  {id:'k3',end:50,suffix:'+'},
  {id:'k4',end:120,suffix:'+'}
];
function animateKpis(){
  kpiMap.forEach(k=>{
    const el=document.getElementById(k.id); if(!el || el.dataset.done) return; el.dataset.done='1';
    let start=0; const t0=performance.now(); const dur=1100;
    function tick(now){ const p=Math.min((now-t0)/dur,1); const eased=1-Math.pow(1-p,3); el.textContent=Math.round(eased*k.end)+k.suffix; if(p<1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  });
}
const kpis=document.querySelector('.kpis'); if(kpis) new IntersectionObserver(es=>{if(es[0].isIntersecting) animateKpis();},{threshold:.35}).observe(kpis);

function leadText(data){
  return Object.entries(data).filter(([k,v])=>v && k !== 'website').map(([k,v])=>`${k}: ${v}`).join('\n');
}

function applyUrlPrefill(form){
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product') || params.get('model');
  if(product){
    const select = form.querySelector('[name="product"]');
    if(select){
      const match = Array.from(select.options).find(o => o.value === product || o.value.toLowerCase().includes(product.replaceAll('-', ' ').toLowerCase().slice(0,24)));
      if(match) select.value = match.value;
    }
  }
}

document.querySelectorAll('form[data-lead-form]').forEach(form=>{
  applyUrlPrefill(form);
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn=form.querySelector('button[type="submit"]');
    const originalText=btn ? btn.textContent : 'Submit';
    const status=form.querySelector('#formStatus') || form.querySelector('.note');
    const data=Object.fromEntries(new FormData(form).entries());
    if(data.website) return; // honeypot
    const isSample = /sample/i.test(originalText) || window.location.pathname.includes('sample-request');
    data.form_type = isSample ? 'Sample Request' : 'RFQ Inquiry';
    if(btn){ btn.disabled=true; btn.textContent=isSample ? 'Sending sample request...' : 'Sending RFQ...'; }
    if(status){ status.textContent=''; status.className='note'; }
    try{
      const res=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!res.ok) throw new Error('Lead API is not configured yet.');
      form.reset();
      if(status){ status.textContent=isSample ? 'Sample request sent. We will confirm model availability, sample cost and freight within 24 hours.' : 'Inquiry sent. Our sales team will reply within 24 hours.'; status.className='note ok'; }
    }catch(err){
      const subject=encodeURIComponent(isSample ? 'Sample request from LYL CleanAir website' : 'New inquiry from LYL CleanAir website');
      const body=encodeURIComponent(leadText(data));
      if(status){ status.innerHTML=(isSample ? 'The sample form is ready, but API is not connected yet. ' : 'Form API is not connected yet. ') + '<a href="mailto:will@lyluv.com?subject='+subject+'&body='+body+'">Click here to send by email now</a>, or use WhatsApp on this page.'; status.className='note err'; }
    }finally{
      if(btn){ btn.disabled=false; btn.textContent=originalText; }
    }
  });
});


const calcBtn=document.getElementById('calcAirflowBtn');
if(calcBtn) calcBtn.addEventListener('click',()=>{
  const area=parseFloat(document.getElementById('roomArea')?.value||0);
  const height=parseFloat(document.getElementById('ceilingHeight')?.value||2.6);
  const ach=parseFloat(document.getElementById('targetAch')?.value||4);
  const out=document.getElementById('calcResult');
  if(!out) return;
  if(!area || area<5){ out.textContent='Enter a room area above 5 m².'; return; }
  const m3h=Math.round(area*height*ach);
  let reco='Tabletop or bedroom series';
  if(m3h>450) reco='Commercial / school project series';
  else if(m3h>260) reco='Large household or UV sterilizer series';
  else if(m3h>140) reco='Bedroom HEPA or UV purifier series';
  out.innerHTML='<b>Suggested airflow target:</b> '+m3h+' m³/h at '+ach+' ACH<br><span style="font-size:13px;color:#668dad">Recommended LYL direction: '+reco+'. Final model selection should confirm CADR, noise, filter package and target market certification.</span>';
});
