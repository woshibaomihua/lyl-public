export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const data = req.body || {};
  if (data.website) return res.status(200).json({ ok: true }); // honeypot
  const required = ['company','name','email','product','message'];
  for (const key of required) { if (!data[key]) return res.status(400).json({ error: `${key} is required` }); }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL || 'will@lyluv.com';
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'LYL Website <onboarding@resend.dev>';
  const autoReply = String(process.env.SEND_AUTO_REPLY || '').toLowerCase() === 'true';
  if (!apiKey) return res.status(501).json({ error: 'RESEND_API_KEY is not configured' });

  const cleanPairs = Object.entries(data).filter(([k,v]) => v && k !== 'website');
  const text = cleanPairs.map(([k,v]) => `${k}: ${v}`).join('\n');
  const product = data.product || 'Website';
  const subject = `New LYL CleanAir ${data.form_type || 'inquiry'} - ${product}`;

  const buyerAutoReply = `Hello ${data.name || ''},\n\nThank you for contacting LYL CleanAir. We received your request for ${product}.\n\nTo prepare a faster quotation, our sales team may confirm:\n1. Target country / market\n2. Quantity and expected launch time\n3. Certification needs such as CE, FCC, RoHS, EPA or ISO documents\n4. Logo, packaging, plug type and manual language requirements\n5. Sample delivery address and preferred courier\n\nYou can also contact us on WhatsApp: +86 139 2823 1487\nEmail: will@lyluv.com\n\nBest regards,\nLYL CleanAir Team`;

  async function sendMail(payload){
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) { const err = await r.text(); throw new Error(err); }
    return r.json();
  }

  try {
    await sendMail({ from: fromEmail, to: [toEmail], reply_to: data.email, subject, text });
    if (autoReply && data.email) {
      await sendMail({ from: fromEmail, to: [data.email], subject: 'We received your LYL CleanAir request', text: buyerAutoReply });
    }
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ error: e.message }); }
}
