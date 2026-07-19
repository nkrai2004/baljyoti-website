# Bal Jyoti Public School — Website

Static, self-contained HTML website for Bal Jyoti Public School, Ghaziabad. No build step, no dependencies beyond Google Fonts (loaded via CDN) — every page is a single standalone `.html` file.

## Pages

| File               | Page                                   |
|---------------------|-----------------------------------------|
| `index.html`         | Home                                    |
| `about.html`         | About Us                                |
| `admission.html`     | Admissions                              |
| `careers.html`       | Careers / Jobs                          |
| `leaders.html`       | Our Leaders (Chairman & Director)       |
| `gallery.html`       | Photo Gallery                           |
| `disclosure.html`    | CBSE Mandatory Public Disclosure        |

All pages are cross-linked via the header "Back to Home" link and the footer navigation row, and every page has a fixed WhatsApp button in the bottom-right corner.

## Deploying on GitHub Pages

1. Create a new GitHub repository (e.g. `baljyoti-school-website`).
2. Upload all files in this folder to the root of the repository (drag-and-drop on github.com works fine, or use `git push`).
3. In the repository, go to **Settings → Pages**.
4. Under **Source**, select the `main` branch and `/ (root)` folder, then click **Save**.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
6. Once live, `index.html` is served automatically at the root URL — no need to type the filename.

## Before Going Live — Things to Update

- **Photos**: The Gallery page (`gallery.html`) and the "Our Leaders" photo frames (`leaders.html`) use placeholder images. Search each file for `PASTE-IMAGE-URL-HERE` and replace with real photo URLs.
- **Mandatory Disclosure**: `disclosure.html` has several fields and document links marked `PASTE-LINK-HERE` (shown as "Click Here" on the page) — these must be filled in with real CBSE-required documents and figures before publishing, per CBSE Affiliation Bye-Laws.
- **Contact details**: Phone (`+91 99103 63101`) and email (`info@baljyoti.com`) are used throughout — update via find-and-replace across all files if these change.
- **Custom domain (optional)**: If the school has its own domain (e.g. `www.baljyoti.com`), you can point it at GitHub Pages by adding a `CNAME` file with the domain name, and configuring DNS with your domain registrar. GitHub's Pages settings page will guide you through this once you enter the custom domain.

## Editing

Each file is plain HTML/CSS with a small amount of vanilla JavaScript (no frameworks). Open any file in a text editor to make changes — CSS is in a `<style>` block near the top of each file, content is in the `<body>`.
