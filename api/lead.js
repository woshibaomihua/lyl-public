export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const data = req.body || {};
  if (data.website) return res.status(200).json({ ok: true }); // honeypot
  const required = ['name','email','product','message'];
  for (const key of required) { if (!data[key]) return res.status(400).json({ error: `${key} is required` }); }
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL || 'will@lyluv.com';
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'LYL Website <onboarding@resend.dev>';
  if (!apiKey) return res.status(501).json({ error: 'RESEND_API_KEY is not configured' });
  const text = Object.entries(data).filter(([k,v]) => v && k !== 'website').map(([k,v]) => `${k}: ${v}`).join('\n');
  const subject = `New LYL CleanAir inquiry - ${data.product || 'Website'}`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromEmail, to: [toEmail], reply_to: data.email, subject, text })
    });
    if (!r.ok) { const err = await r.text(); return res.status(502).json({ error: err }); }
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
