# Google-Sheets Hardware Website

Static website for a hardware fittings and sanitary items business. Content is managed from one public Google Sheet, while enquiries are saved through a Google Apps Script Web App.

## Files

- `index.html` - complete website with HTML, CSS, and JavaScript in one file.
- `README.md` - setup instructions.

## 1. Create The Google Sheet

Create one Google Sheets workbook with these three tabs.

### Settings

| Key | Value |
| --- | --- |
| company_name | SteelCraft Hardware |
| tagline | Premium Fittings. Trusted. |
| phone | +91 98765 43210 |
| whatsapp | 919876543210 |
| email | info@steelcraft.in |
| address | 12, Industrial Area, Hyd |
| upi_id | steelcraft@upi |
| upi_name | SteelCraft Hardware |
| bank_name | HDFC Bank |
| account_name | SteelCraft Pvt Ltd |
| account_number | 50100123456789 |
| ifsc_code | HDFC0001234 |
| brochure_url | https://drive.google.com/... |
| hero_image_1 | https://... |
| hero_image_2 | https://... |
| hero_image_3 | https://... |
| hero_caption_1 | Premium Steel Fittings |
| hero_caption_2 | Complete Sanitary Solutions |
| hero_caption_3 | Industrial Hardware Supply |

### Products

Use this header row exactly:

```text
id | name | category | price | unit | image_url | description | in_stock
```

Set `in_stock` to `TRUE` for visible products and `FALSE` for hidden products.

### Enquiries

Use this header row exactly:

```text
timestamp | name | phone | email | subject | message
```

## 2. Make The Sheet Public

1. Open the Google Sheet.
2. Click `Share`.
3. Under `General access`, choose `Anyone with the link`.
4. Set access to `Viewer`.
5. Click `Done`.

## 3. Get The Sheet ID

Copy the long ID from your Google Sheet URL.

Example URL:

```text
https://docs.google.com/spreadsheets/d/1AbCDefGhIJkLmNoPQrStuVwXyZ1234567890/edit
```

Sheet ID:

```text
1AbCDefGhIJkLmNoPQrStuVwXyZ1234567890
```

## 4. Paste The Sheet ID

Open `index.html` and find this line near the top of the JavaScript:

```js
const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
```

Replace only the placeholder text:

```js
const SHEET_ID = "YOUR_REAL_SHEET_ID";
```

## 5. Apps Script For Enquiries

In the Google Sheet, go to `Extensions` -> `Apps Script`, then paste this code:

```js
const SHEET_NAME = "Enquiries";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents || "{}");

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.subject || "",
      data.message || ""
    ]);

    return jsonResponse({ status: "success" });
  } catch (error) {
    return jsonResponse({ status: "error", message: error.message });
  }
}

function doOptions() {
  return jsonResponse({ status: "ok" });
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Google Apps Script Web Apps do not allow custom CORS headers through `ContentService`. The website submits with `Content-Type: text/plain`, which avoids a browser preflight request and works for public Web App submissions.

## 6. Deploy Apps Script As A Web App

1. In Apps Script, click `Deploy` -> `New deployment`.
2. Click the gear icon and choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Click `Deploy`.
6. Authorize the script if Google asks.
7. Copy the Web App URL.

## 7. Paste The Apps Script URL

Open `index.html` and find this line:

```js
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

Replace only the placeholder text:

```js
const APPS_SCRIPT_URL = "YOUR_REAL_APPS_SCRIPT_WEB_APP_URL";
```

## 8. Host On GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html` and `README.md`.
3. Open the repository settings.
4. Go to `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select the `main` branch and `/root`.
7. Click `Save`.
8. GitHub will show your live website URL after deployment.

## 9. Update Content Later

After setup, the business owner only edits the Google Sheet:

- Change business details in `Settings`.
- Add or edit products in `Products`.
- Set `in_stock` to `FALSE` to hide a product.
- Read submitted enquiries in `Enquiries`.

No code edits are needed after the Sheet ID and Apps Script URL are configured once.
