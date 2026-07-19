# Bal Jyoti Public School — Website

Static, self-contained HTML website for Bal Jyoti Public School, Ghaziabad. No build step, no dependencies beyond Google Fonts (loaded via CDN) — every page is a single standalone `.html` file.

## Pages

| File               | Page                                   |
|---------------------|-----------------------------------------|
| `index.html`         | Home                                    |
| `about.html`         | About Us                                |
| `academics.html`     | Academics                               |
| `student-life.html`  | Student Life                            |
| `facilities.html`    | Facilities                              |
| `admission.html`     | Admissions                              |
| `careers.html`       | Careers / Jobs                          |
| `leaders.html`       | Our Leaders (Chairman & Director)       |
| `gallery.html`       | Photo Gallery                           |
| `disclosure.html`    | CBSE Mandatory Public Disclosure        |
| `login.html`         | Staff / Parent / Student portal login (front-end only — see note below) |

All pages share the same navigation: **About** (dropdown: About Us, Our Leaders, Mandatory Disclosure, Gallery), **Academics** (dropdown: Academics, Student Life, Facilities), **Admission**, **Careers**, **Contact**, **Login**, and an **Apply Now** button that always jumps to the admission form. Every page also has a fixed WhatsApp button and the admissions banner/popup.

**About `login.html`**: this is a front-end shell only — the "Sign in with Google Workspace" and "Send Login Code" buttons currently just show a placeholder alert. Wiring this up to real Google Identity Services / Apps Script authentication is part of the planned ERP backend (see the separate architecture document) and is not yet connected.


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
