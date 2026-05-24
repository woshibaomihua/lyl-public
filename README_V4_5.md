
# LYL CleanAir V4.5 Score Boost Version

Generated: 2026-05-24

## What V4.5 adds over V4.4

1. Conversion tracking layer
   - `assets/js/conversion-events.js`
   - `assets/data/conversion-events.json`
   - Events prepared: WhatsApp, RFQ, sample request, downloads, products, solutions, source-platform clicks.

2. Lead magnet / document request path
   - `downloads.html`
   - Catalog, spec sheet pack, certificate package, OEM packaging guide, replacement filter program.

3. Product data completion framework
   - `product-parameter-template.html`
   - `assets/data/product-parameter-template.json`
   - Product pages now include a V4.5 procurement answer and missing-data checklist.

4. Keyword matrix expansion
   - 15 additional solution pages under `/solutions/`
   - `assets/data/solutions-roadmap.json`
   - Solutions index updated with expanded roadmap table.

5. Lead API upgraded
   - `api/lead.js` now requires company/name/email/product/message.
   - Optional buyer auto-reply with `SEND_AUTO_REPLY=true`.

## Deployment environment variables

```text
RESEND_API_KEY=your_resend_key
LEAD_TO_EMAIL=will@lyluv.com
LEAD_FROM_EMAIL=LYL Website <verified@yourdomain.com>
SEND_AUTO_REPLY=true
```

## Tracking tools to connect after deployment

- Google Analytics 4
- Google Search Console
- Microsoft Clarity
- Optional: Meta Pixel / LinkedIn Insight Tag

## Still required for 90+ score

- Real product photos for all 10 models
- Factory photos: exterior, production line, QC, warehouse, shipment
- Certificate PDF/scans: CE, FCC, RoHS, ISO9001, EPA/CARB/GS where applicable
- Complete product parameters: CADR, power, carton size, weight, filter details, UV wavelength, HS code
- 3 real or semi-real case studies


## V4.5.2 Logo System Update
- Updated horizontal website logo banner: `assets/img/lyl-cleanair-logo-banner.png`
- Added square logo icon: `assets/img/lyl-cleanair-logo-icon.png`
- Added favicon/app icons: `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
- Updated HTML header/footer branding and favicon references across the site.
