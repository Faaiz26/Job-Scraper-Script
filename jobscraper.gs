function searchSREJobsWithCSE() {
  const apiKey = "AIzaSyDweJUTvpDW5Cv-geKT4RXx5QscTVp-4tM";
  const searchEngineId = "70204cbca563d4308";
  const query = '"Site Reliability Engineer" OR "SRE" remote "3 to 5 years"';
  const userEmail = "mohdfaaiz65@gmail.com";

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
      subject: "📬 SRE Job Alerts (Last 7 Days Only)",
      body: emailBody
    });
  } else {
    MailApp.sendEmail({
      to: userEmail,
      subject: "SRE Job Alerts: No Recent Posts",
      body: "No recent SRE job links (past 7 days) were found."
    });
  }
}
