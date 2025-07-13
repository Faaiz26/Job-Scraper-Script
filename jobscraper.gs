function searchSREJobsWithCSE() {
  const apiKey = ""; #apiKey
  const searchEngineId = "";#searchEngineId
  const query = 'Job Title';
  const userEmail = "<emailid>"; #replace your email id here

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  sheet.clearContents();
  sheet.appendRow(['Title', 'Link', 'Snippet']);

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&sort=date:r:now-7d..now`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const results = [];

  if (data.items && data.items.length > 0) {
    data.items.forEach(item => {
      const title = item.title;
      const link = item.link;
      const snippet = item.snippet || '';
      sheet.appendRow([title, link, snippet]);
      results.push({ title, link });
    });

    const emailBody = results.map(r => `🔗 ${r.link}\n📌 ${r.title}`).join('\n\n');
    MailApp.sendEmail({
      to: userEmail,
      subject: "📬  Job Alerts (Last 7 Days Only)", # repalce email subject line
      body: emailBody
    });
  } else {
    MailApp.sendEmail({
      to: userEmail,
      subject: "SRE Job Alerts: No Recent Posts",
      body: "No recent  job links (past 7 days) were found."
    });
  }
}
