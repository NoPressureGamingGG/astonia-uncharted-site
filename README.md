# Astonia Uncharted community site

A small, static GitHub Pages site for public-facing project information. It
does not connect to the game server, collect credentials, or contain private
server data.

## Preview locally

Open `index.html` in a browser.

## Publish with GitHub Pages

1. Create a public GitHub repository named `astonia-uncharted-site`.
2. Push this folder's contents to its `main` branch.
3. In the repository, open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select
   `main` and `/(root)`, then save.
5. GitHub will show the published URL on that Pages settings screen.

The character-creation guide and rankings are explicitly marked as unfinished.
Before adding live rankings, publish only approved stats through a separate,
server-side export. Never expose database credentials or connect the public
site directly to the game database.
