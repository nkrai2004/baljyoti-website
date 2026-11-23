(function () {
  if (window.__bjpsCommitStatusLoaded) return;
  window.__bjpsCommitStatusLoaded = true;
  function addStatus() {
    if (document.getElementById('bjpsCommitStatus')) return;
    const footer = document.createElement('footer');
    footer.id = 'bjpsCommitStatus';
    footer.setAttribute('aria-live', 'polite');
    footer.textContent = 'Loading repository status…';
    footer.style.cssText = 'box-sizing:border-box;width:100%;padding:10px 14px 14px;text-align:center;font:11px/1.5 Arial,sans-serif;color:#64748b;background:transparent;';
    document.body.appendChild(footer);
  }
  async function loadStatus() {
    addStatus();
    const footer = document.getElementById('bjpsCommitStatus');
    try {
      const response = await fetch('https://api.github.com/repos/nkrai2004/baljyoti-website/commits?sha=main&per_page=1', {
        headers: { 'Accept': 'application/vnd.github+json' }, cache: 'no-store'
      });
      if (!response.ok) throw new Error('GitHub status unavailable');
      const commits = await response.json();
      if (!Array.isArray(commits) || !commits.length) throw new Error('No commit data');
      const latest = commits[0];
      const dateValue = latest.commit && latest.commit.committer && latest.commit.committer.date
        ? latest.commit.committer.date : latest.commit.author.date;
      const formatted = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(new Date(dateValue));
      const link = response.headers.get('Link') || '';
      const lastPage = link.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
      const count = lastPage ? Number(lastPage[1]).toLocaleString('en-IN') : String(commits.length);
      footer.textContent = 'BJPS ERP · Last commit: ' + formatted + ' IST · Total commits: ' + count;
      const sha = document.createElement('a');
      sha.href = latest.html_url; sha.target = '_blank'; sha.rel = 'noopener noreferrer';
      sha.textContent = ' · ' + latest.sha.slice(0, 7);
      sha.style.cssText = 'color:inherit;text-decoration:underline;text-underline-offset:2px;';
      footer.appendChild(sha);
    } catch (error) {
      footer.textContent = 'BJPS ERP · Repository status temporarily unavailable';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadStatus, { once: true });
  else loadStatus();
})();