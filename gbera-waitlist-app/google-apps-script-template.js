/**
 * Gbera Waitlist — Google Apps Script Web App
 *
 * Deploy this as a Web App in Google Apps Script to receive waitlist
 * submissions from the Gbera Next.js API and append them to a Google Sheet.
 *
 * Setup:
 * 1. Open script.google.com → New Project
 * 2. Paste this code
 * 3. Replace SHEET_ID with your Google Sheet ID (from the URL)
 * 4. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone (so the Gbera server can call it)
 * 5. Copy the Web App URL into your .env.local as GOOGLE_SHEETS_WEBHOOK_URL
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Waitlist'; // Tab name

const COLUMNS = [
  'id', 'email', 'phone', 'is_ui_student', 'faculty', 'year_or_level',
  'has_graduated', 'occupation', 'role_interest', 'uses_keke', 'uses_uber',
  'frequency', 'preferred_zones', 'waitlist_position', 'created_at',
  'updated_at', 'source', 'user_agent',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Write header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
    }

    // Build row in column order
    const row = COLUMNS.map(col => {
      const val = data[col];
      if (Array.isArray(val)) return val.join(', ');
      if (val === null || val === undefined) return '';
      return val;
    });

    // Upsert: check if email already exists (column 2)
    const emailCol = 2;
    const existingData = sheet.getDataRange().getValues();
    const emailIdx = existingData.findIndex((r, i) => i > 0 && r[emailCol - 1] === data.email);

    if (emailIdx > 0) {
      // Update existing row
      sheet.getRange(emailIdx + 1, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
