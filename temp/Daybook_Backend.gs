/**
 * DAYBOOK BACKEND — paste this whole file into Extensions > Apps Script
 * in your (empty) Google Sheet, then deploy as a Web App.
 *
 * SETUP (one time, ~2 minutes):
 * 1. Open your Google Sheet.
 * 2. Extensions -> Apps Script.
 * 3. Delete anything in the editor, paste this entire file in, and save
 *    (Ctrl+S / Cmd+S). Name the project anything, e.g. "Daybook Backend".
 * 4. Click "Deploy" (top right) -> "New deployment".
 * 5. Click the gear icon next to "Select type" -> choose "Web app".
 * 6. Description: anything. "Execute as": Me. "Who has access": Anyone.
 * 7. Click "Deploy". The first time, Google will show an "unverified app"
 *    warning because this is your own private script — click
 *    "Advanced" -> "Go to <project name> (unsafe)" -> "Allow".
 *    (This is normal and expected for a script only you deployed.)
 * 8. Copy the "Web app URL" shown (it ends in /exec).
 * 9. Paste that URL into the dashboard's "Backend URL" field.
 *
 * This script creates one tab per calendar date (named e.g. "2026-08-04")
 * the first time an entry is added for that date, with columns:
 * Time | Task | Category | SPOC | Status | Updated At
 *
 * If you ever change this script after it's deployed, use
 * Deploy -> Manage deployments -> Edit (pencil) -> New version -> Deploy,
 * so the same URL picks up your changes.
 */

var HEADERS = ['Time', 'Task', 'Category', 'SPOC', 'Status', 'Updated At'];
var DATE_TAB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function doGet(e) {
  return handleRequest(e);
}
function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var result;
  try {
    var params = (e && e.parameter) || {};
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (parseErr) { /* not JSON, ignore */ }
    }
    var payload = {};
    for (var k in params) payload[k] = params[k];
    for (var k2 in body) payload[k2] = body[k2];

    switch (payload.action) {
      case 'listDates':    result = listDates(); break;
      case 'listEntries':  result = listEntries(payload.date); break;
      case 'addEntry':     result = addEntry(payload); break;
      case 'updateStatus': result = updateStatus(payload); break;
      case 'deleteEntry':  result = deleteEntry(payload); break;
      default: result = { error: 'Unknown or missing action: ' + payload.action };
    }
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(dateStr) {
  if (!DATE_TAB_PATTERN.test(dateStr)) throw new Error('Invalid date (expected YYYY-MM-DD): ' + dateStr);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(dateStr);
  if (!sheet) {
    sheet = ss.insertSheet(dateStr);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function listDates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var names = ss.getSheets()
    .map(function (s) { return s.getName(); })
    .filter(function (n) { return DATE_TAB_PATTERN.test(n); })
    .sort();
  return { dates: names };
}

function listEntries(dateStr) {
  if (!dateStr) throw new Error('Missing "date" parameter');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(dateStr);
  if (!sheet) return { entries: [] };
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { entries: [] };
  var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var entries = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (!row[0] && !row[1]) continue; // skip blank rows
    entries.push({
      row: i + 2,
      time: row[0],
      task: row[1],
      category: row[2],
      spoc: row[3],
      status: row[4] || 'pending',
      updatedAt: row[5]
    });
  }
  return { entries: entries };
}

function addEntry(p) {
  if (!p.date || !p.time || !p.task) throw new Error('date, time and task are required');
  var sheet = getOrCreateSheet(p.date);
  sheet.appendRow([p.time, p.task, p.category || '', p.spoc || '', p.status || 'pending', new Date()]);
  return { row: sheet.getLastRow() };
}

function updateStatus(p) {
  if (!p.date || !p.row || !p.status) throw new Error('date, row and status are required');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(p.date);
  if (!sheet) throw new Error('No tab found for date: ' + p.date);
  sheet.getRange(Number(p.row), 5).setValue(p.status);
  sheet.getRange(Number(p.row), 6).setValue(new Date());
  return { ok: true };
}

function deleteEntry(p) {
  if (!p.date || !p.row) throw new Error('date and row are required');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(p.date);
  if (!sheet) throw new Error('No tab found for date: ' + p.date);
  sheet.deleteRow(Number(p.row));
  return { ok: true };
}
