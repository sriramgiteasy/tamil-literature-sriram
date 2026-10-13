# Sriram Writes

A small, static Tamil literature site. It runs without a paid server and is ready to publish with Azure Static Web Apps.

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

Supported types are `கவிதை`, `கதை`, and `கட்டுரை`. Save the file and refresh the page to see changes. Replace the introduction in `index.html` with your own biography. Update the contact email there before publishing.

## Preview locally

Open `index.html` in a browser. The site uses Google Fonts when internet access is available and falls back to system fonts if it isn't.

## Publish with Azure Static Web Apps

1. Put these files in a GitHub repository.
2. In the Azure portal, create a **Static Web App** and connect the repository. Choose the `Custom` build preset; set app location to `/`, API location empty, and output location empty.
3. Once deployment is complete, open the Static Web App's **Custom domains** page and add `sriramwrites.in`.
4. Azure will show the DNS record(s) to create. In your domain registrar's DNS settings, add those exact records. DNS verification can take some time. Azure provisions HTTPS after the domain is verified.

The domain registration is separate from hosting. You do not need to buy Azure App Service for this static site.
