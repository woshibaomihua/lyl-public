# LYL CleanAir Independent Website Package

This package is an optimized replacement for the original single-page demo.

## What is included
- SEO-ready homepage
- Product catalog and 6 product detail pages
- About / Contact / FAQ / Warranty / Shipping / Returns / Privacy / Terms pages
- Local SVG image assets for fast loading. Replace them with real factory/product photos later.
- Vercel serverless inquiry API at `/api/lead.js`
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `vercel.json`

## Lead form setup on Vercel
Set these environment variables in Vercel:

```text
RESEND_API_KEY=your_resend_api_key
LEAD_TO_EMAIL=will@lyluv.com
LEAD_FROM_EMAIL=LYL Website <your_verified_sender@yourdomain.com>
```

If the API is not configured, the front-end will show an email fallback instead of showing fake success.

## Recommended next step
Replace `/assets/img/*.svg` with real compressed WebP/AVIF photos:
- factory exterior
- assembly line
- QC lab
- product lifestyle images
- packaging and shipment photos
- certificate scans with sensitive numbers masked if needed

## Deployment
Upload to Vercel as a static + serverless project. No build command is required.
