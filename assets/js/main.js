
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
  return Object.entries(data).filter(([k,v])=>v && k !== 'website').map(([k,v])=>`${k}: ${v}`).join('
');
}
const form=document.getElementById('leadForm');
if(form) form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const btn=form.querySelector('button[type="submit"]'); const status=document.getElementById('formStatus');
  const data=Object.fromEntries(new FormData(form).entries());
  if(data.website) return; // honeypot
  btn.disabled=true; btn.textContent='Sending...'; status.textContent=''; status.className='';
  try{
    const res=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if(!res.ok) throw new Error('Lead API is not configured yet.');
    form.reset(); status.textContent='Inquiry sent. Our sales team will reply within 24 hours.'; status.className='ok';
  }catch(err){
    const subject=encodeURIComponent('New inquiry from LYL CleanAir website');
    const body=encodeURIComponent(leadText(data));
    status.innerHTML='Form API is not connected yet. <a href="mailto:will@lyluv.com?subject='+subject+'&body='+body+'">Click here to send by email now</a>.';
    status.className='err';
  }finally{ btn.disabled=false; btn.textContent='Send My Inquiry'; }
});
