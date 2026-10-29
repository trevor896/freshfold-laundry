# FreshFold

A static laundry and dry-cleaning website for Gaborone.

## Run locally

From the project root, run:

```powershell
python -m http.server 8000 --directory docs
```

Then open `http://localhost:8000`.

## GitHub Pages

The site is published from `docs/` by the GitHub Actions workflow in `.github/workflows/pages.yml` whenever changes are pushed to `main`. Enable **Settings → Pages → Build and deployment → Source → GitHub Actions** once in the repository settings.

Before publishing, replace the sample phone number, email, service details, prices, testimonials and profile portraits with the business's real information.
