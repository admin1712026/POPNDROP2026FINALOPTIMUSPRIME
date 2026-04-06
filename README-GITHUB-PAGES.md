# Deploy To GitHub Pages

## 1) Create repository
- Create a new GitHub repository (public).

## 2) Upload files (recommended via Git CLI, no 100-file web limit)
```bash
git init
git add .
git commit -m "Deploy static site for GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 3) Enable Pages
- GitHub -> `Settings` -> `Pages`
- Source: `Deploy from a branch`
- Branch: `main` / folder: `/ (root)`
- Save

## 4) Open site
- URL: `https://<your-username>.github.io/<your-repo>/`

## Notes
- This package is static and already adapted for GitHub Pages.
- Contact form sends data directly to Supabase (`contact_requests`) using public anon key.
- If you change Supabase project keys, update `supabase-config.js`.

