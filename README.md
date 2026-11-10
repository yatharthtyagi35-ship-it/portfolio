# Yatharth Tyagi — Portfolio

A single-page portfolio with a 3D hero, an enquiry form (FormBold → your Proton inbox), a free estimate assistant, and a CMS at `/admin` for projects, posters, contact details and prices.

```
index.html          the website
content/site.json   all editable content (the CMS edits this file)
admin/              the CMS (Decap CMS)
api/                two tiny functions for logging in to the CMS with GitHub
images/uploads/     images you upload from the CMS
```

---

## 1. Turn on "Send enquiry" → your Proton inbox (2 min, one time)

"Send enquiry" (and the assistant's **Send now** button) deliver the professionally written message straight to **ytyagi18@proton.me** using **FormSubmit** (free, no account).

1. Once the site is online, fill in the contact form yourself and press **Send enquiry**.
2. FormSubmit emails your Proton inbox an **"Activate Form"** link. Click it. Done: every enquiry from now on lands in your inbox, with the client's email as reply-to.
3. (Optional) The activation email also shows a random string. Put it in CMS → Contact → *FormSubmit private key* (or `"formsubmit_key"` in `content/site.json`) to hide your email address from the page code.

Until you activate (or if delivery ever fails), visitors get backup options for the same written message:
Gmail or Outlook (a new tab opens with it fully written, they press Send), Instagram DM or LinkedIn (copied, your chat/profile opens, they paste), their mail app, or copy.

Prefer FormBold? Create a form at formbold.com with your Proton email and put its ID in *FormBold form ID*. It is used instead of FormSubmit.

## 2. Put the site online (GitHub + Vercel)

1. Create a GitHub repository and upload everything in this folder.
2. In Vercel: **Add New → Project → import the repo → Deploy** (no settings needed).
3. Note your address, e.g. `https://yatharth-portfolio.vercel.app`.

## 3. Turn on the CMS (10 min, one time)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://YOUR-SITE.vercel.app`
   - Authorization callback URL: `https://YOUR-SITE.vercel.app/api/callback`
   - Create it, then **Generate a new client secret**.
2. Vercel → your project → **Settings → Environment Variables**, add:
   - `GITHUB_CLIENT_ID` = the Client ID
   - `GITHUB_CLIENT_SECRET` = the client secret
3. Edit `admin/config.yml`: replace `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` and every `https://YOUR-SITE.vercel.app`.
4. Push the change. Vercel redeploys automatically.
5. Open `https://YOUR-SITE.vercel.app/admin` → **Login with GitHub**.

Every time you press **Publish** in the CMS it saves to GitHub, and Vercel updates the live site in about a minute.

What you can edit:
- **Contact**: email, Instagram handle, LinkedIn, FormBold ID
- **Projects**: add/remove/reorder cards, upload a screenshot or reuse the built-in artwork
- **Posters**: upload your own designs (the placeholder posters disappear once you add one)
- **Pricing**: every number the estimate assistant uses

## 4. Set your real prices ⚠️

The prices in `content/site.json` are **starting placeholders**. Change them to your own rates in the CMS → Pricing before sharing the site.
They only appear inside the assistant. Turn on "Show From prices on the rate cards" if you also want them in the Services section.

## About the assistant

It runs fully in the browser, so it's free with no AI API bill. It understands typed requests (English and some Hinglish, e.g. *"5 page website with login, jaldi chahiye"*), asks a few quick questions, works out an estimate from your pricing, shares your contact details, and can send the enquiry to your inbox through FormBold.

## Testing locally

Double-clicking `index.html` works, but it uses the content built into the page.
To test `content/site.json` edits locally, run `python3 -m http.server` in this folder and open http://localhost:8000.
