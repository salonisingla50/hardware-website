# VAAMS Italian Website

Five-page static website using the VAAMS Italian green-and-white brand identity.

## Pages

- `index.html` - Home
- `about.html` - About
- `products.html` - Searchable product catalogue
- `payment.html` - Key-locked UPI QR
- `contact.html` - Contact details, social links, directions, and WhatsApp enquiry

## Product Catalogue

Use `outputs/VAAMS-Italian-Product-Catalogue.xlsx` to maintain up to 5,000 products.

1. Upload the workbook to Google Drive and open it with Google Sheets.
2. Add categories in the `Categories` tab.
3. Add products in the `Products` tab.
4. Set `in_stock` to `TRUE` to show a product or `FALSE` to hide it.
5. Set Google Sheets sharing to `Anyone with the link` as `Viewer`.
6. Copy the Sheet ID from its URL.
7. Paste it into `app.js`:

```js
SHEET_ID: "YOUR_GOOGLE_SHEET_ID",
```

Product columns:

```text
id | name | category | image_url | description | in_stock
```

The website intentionally contains no product pricing.

## Home Page Videos

Add videos in the workbook's `Videos` tab:

```text
id | title | video_url | thumbnail_url | active
```

- YouTube watch, Shorts, embed, and `youtu.be` links are embedded automatically.
- Direct public `.mp4` or other browser-playable video links use the native video player.
- Set `active` to `TRUE` to show a video.
- The website remains fully static; it reads public sheet data directly in the browser.

## Payment Key

Initial payment access key:

```text
VAAMS83300
```

The browser validates a SHA-256 hash stored in `app.js`. This provides a simple customer-facing lock, but a truly secure payment gate requires a backend because browser code can be inspected.

## Local Preview

```bash
cd /Users/salonisingla/Desktop/freelance/Hardware
python3 -m http.server 4173
```

Open `http://localhost:4173`.
