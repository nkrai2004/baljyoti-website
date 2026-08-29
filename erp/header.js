<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gmail Inbox Module</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: #f8fafc;
      color: #0f172a;
      padding: 24px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    nav {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
    }

    nav a {
      text-decoration: none;
      color: #64748b;
      font-weight: 500;
      font-size: 0.95rem;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    nav a.active {
      background-color: #2563eb;
      color: white;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }

    .controls {
      display: flex;
      gap: 12px;
      width: 100%;
      max-width: 400px;
    }

    input[type="text"] {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
    }

    button {
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
    }

    button:disabled {
      background-color: #94a3b8;
    }

    .card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .email-list {
      list-style: none;
    }

    .email-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      cursor: pointer;
      transition: background 0.15s;
    }

    .email-item:hover {
      background-color: #f1f5f9;
    }

    .email-item.unread {
      background-color: #eff6ff;
      font-weight: 600;
    }

    .email-sender {
      width: 220px;
      font-size: 0.875rem;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 12px;
    }

    .email-body {
      flex: 1;
      min-width: 0;
      padding-right: 12px;
    }

    .email-subject {
      font-size: 0.875rem;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .email-snippet {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: normal;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .email-date {
      font-size: 0.75rem;
      color: #64748b;
      white-space: nowrap;
    }

    .status-container {
      padding: 40px;
      text-align: center;
      color: #64748b;
    }

    .badge-count {
      background-color: #cbd5e1;
      color: #1e293b;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 0.75rem;
      margin-left: 6px;
    }
  </style>
</head>
<body>

  <div class="container">
    <nav>
      <a href="../user-permissions.html">User Permissions</a>
      <a href="role-modules.html">Role-Module Mapping</a>
      <a href="inbox.html" class="active">Inbox</a>
    </nav>

    <header>
      <h1>Gmail Inbox</h1>
      <div class="controls">
        <input type="text" id="searchInput" placeholder="Search emails..." oninput="filterEmails()">
        <button id="refreshBtn" onclick="fetchInbox()">Sync Mail</button>
      </div>
    </header>

    <div class="card">
      <ul id="emailList" class="email-list">
        <li class="status-container">Connecting to Gmail...</li>
      </ul>
    </div>
  </div>

  <script>
    const WORKSPACE_API_URL = "https://script.google.com/macros/s/AKfycbzkE6HJ9zsWXcjkZu0xbl1-db9vTx8CiSaIzkI0r7a5SCPrhS5a2TfsnmZ2otCdcaOTXQ/exec";
    let globalThreads = [];

    async function fetchInbox() {
      const emailList = document.getElementById("emailList");
      const refreshBtn = document.getElementById("refreshBtn");
      refreshBtn.disabled = true;

      emailList.innerHTML = `<li class="status-container">Fetching latest messages...</li>`;

      try {
        const response = await fetch(`${WORKSPACE_API_URL}?action=getInbox`, {
          method: "GET",
          redirect: "follow"
        });

        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        const data = await response.json();

        if (data.status === "error") throw new Error(data.message);

        globalThreads = data.threads || [];
        renderInbox(globalThreads);

      } catch (error) {
        console.error("Gmail Load Error:", error);
        emailList.innerHTML = `
          <li class="status-container" style="color: #ef4444;">
            Failed to load Gmail messages: ${escapeHtml(error.message)}
          </li>`;
      } finally {
        refreshBtn.disabled = false;
      }
    }

    function renderInbox(threads) {
      const emailList = document.getElementById("emailList");

      if (threads.length === 0) {
        emailList.innerHTML = `<li class="status-container">No messages found in Inbox.</li>`;
        return;
      }

      emailList.innerHTML = threads.map(thread => `
        <li class="email-item ${thread.isUnread ? 'unread' : ''}">
          <div class="email-sender">${escapeHtml(thread.sender)}</div>
          <div class="email-body">
            <div class="email-subject">
              ${escapeHtml(thread.subject)}
              ${thread.messageCount > 1 ? `<span class="badge-count">${thread.messageCount}</span>` : ''}
            </div>
            <div class="email-snippet">${escapeHtml(thread.snippet)}</div>
          </div>
          <div class="email-date">${escapeHtml(thread.date)}</div>
        </li>
      `).join('');
    }

    function filterEmails() {
      const query = document.getElementById("searchInput").value.toLowerCase();
      const filtered = globalThreads.filter(t => 
        t.sender.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.snippet.toLowerCase().includes(query)
      );
      renderInbox(filtered);
    }

    function escapeHtml(str) {
      return String(str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    window.addEventListener("DOMContentLoaded", fetchInbox);
  </script>
</body>
</html>
