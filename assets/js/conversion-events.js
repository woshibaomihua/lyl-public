
(function(){
  function classify(el){
    const href=(el.getAttribute('href')||'').toLowerCase();
    const text=(el.textContent||'').trim().toLowerCase();
    if(href.includes('api.whatsapp.com') || text.includes('whatsapp')) return 'whatsapp_click';
    if(href.endsWith('.pdf') || text.includes('download')) return 'download_click';
    if(href.includes('sample-request')) return 'sample_cta_click';
    if(href.includes('contact')) return 'rfq_cta_click';
    if(href.includes('/solutions/')) return 'solution_page_click';
    if(href.includes('/products/')) return 'product_page_click';
    if(href.includes('made-in-china.com') || href.includes('alibaba.com')) return 'source_platform_click';
    return 'link_click';
  }
  function sendEvent(name, params){
    params=params||{}; params.site_version='v4.5-score-boost';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:name, ...params});
    if(typeof window.gtag === 'function') window.gtag('event', name, params);
    if(typeof window.fbq === 'function') window.fbq('trackCustom', name, params);
    if(window.clarity) window.clarity('event', name);
    if(window.location.hostname === 'localhost' || window.LYL_TRACKING_DEBUG){ console.log('[LYL event]', name, params); }
  }
  document.addEventListener('click', function(e){
    const a=e.target.closest && e.target.closest('a');
    if(!a) return;
    const name=a.dataset.track || classify(a);
    sendEvent(name,{href:a.href||'', text:(a.textContent||'').trim().slice(0,90), page:location.pathname});
  }, true);
  document.addEventListener('submit', function(e){
    const form=e.target;
    if(!form || !form.matches('form')) return;
    const type=(form.querySelector('[name="form_type"]')?.value || form.dataset.formType || (location.pathname.includes('sample')?'sample_request':'rfq_form'));
    sendEvent(type + '_submit_attempt', {page:location.pathname});
  }, true);
  window.LYLTrack = sendEvent;
})();
