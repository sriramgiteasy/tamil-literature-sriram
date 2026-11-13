# Sriram Writes

A small, static Tamil literature site. It runs without a paid server and is published free with GitHub Pages.

## Add your writing

Open `works.js` and add entries to the `works` array. Example:

```js
const works = [
  {
    title: "மழை வந்த மாலை",
    type: "கவிதை",
    date: "2026-10-13",
    excerpt: "ஒரு வரியில் படைப்பின் அறிமுகம்.",
    body: "உங்கள் படைப்பின் முழு உரை இங்கே. வரிகளைப் பிரிக்க புதிய வரிகளைப் பயன்படுத்துங்கள்."
  }
];
```

Supported types are `கவிதை`, `கதை`, and `கட்டுரை`. Save the file and refresh the page to see changes. Each work gets its own reading page automatically (`/read/<number>/`, numbered in the order of the array, so always add new works at the end). After adding or editing a work, run `node tools/make-share-pages.js`: it rebuilds the small `read/<number>/index.html` pages that give each shared link its own title, excerpt and picture in WhatsApp and other previews (old `#/read/<number>` links still open the right work). An optional `image` (`{src, alt, width, height}`) shows a picture at the top of the reading page and in link previews (put a `.jpg` copy beside a `.webp` picture; previews use it). An optional `rank` number sets the order on the works pages and the previous/next links (1 shows first); works without a rank come after the ranked ones, newest first. The home page's latest section still shows the last three works added. New works appear on the home page, the works list, the category counts and search without any other change. Edit the biography in the `viewAbout` and home-page sections of `app.js`, and update the contact email (`EMAIL` in `app.js`, plus the links in `index.html`) before publishing.

## Preview locally

Open `index.html` in a browser (the site uses hash routes, so no server setup is needed). The site uses Google Fonts when internet access is available and falls back to system fonts if it isn't.

## Publish with GitHub Pages

The site is served by GitHub Pages from the root of the `main` branch (repository **Settings → Pages**: "Deploy from a branch", `main`, `/ (root)`). Every push to `main` goes live within a minute or two.

- Custom domain: `www.sriramwrites.in`, recorded in the `CNAME` file. Keep that file.
- DNS (GoDaddy): a `CNAME` record for `www` pointing to `sriramgiteasy.github.io`; the bare `sriramwrites.in` is forwarded to `www`.
- HTTPS: **Enforce HTTPS** is ticked in Settings → Pages.

The site was hosted on Azure Static Web Apps until November 2026, when the free credit ran out.
