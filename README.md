# Astonia Uncharted community site

A small, static GitHub Pages site for public-facing project information. It
does not connect to the game server, collect credentials, or contain private
server data.

## Preview locally

Open `index.html` in a browser.

The site is published at
<https://nopressuregaminggg.github.io/astonia-uncharted-site/>.

The site and its Git repository are kept separate from the Server 3 checkout.
GitHub Pages is configured to publish the `main` branch root.

The character-creation guide and rankings are explicitly marked as unfinished.
Before adding live rankings, publish only approved stats through a separate,
server-side export. Never expose database credentials or connect the public
site directly to the game database.

## Planned account registration

The owner selected invitation-based signup that creates one account and one
normal first character. Registration is not available yet. Do not add a
credential form to this static site: it needs a separately hosted HTTPS
backend, private database access with least privilege, parameterized writes,
invite-code expiry/one-time use, abuse controls, and an operational recovery
plan. The public website must never connect directly to the game database.

## Public leaderboard data

`data/leaderboards.json` is the only ranking data source used by the static
page. It accepts a versioned JSON document with `title`, `period`, `unit`,
`status`, and entries containing only a character name and numeric score. The
owner selected all-character public rankings; the page discloses that names
and selected gameplay stats may be public. Never include account IDs, emails,
IPs, database credentials, or other account data. An empty board remains
unpublished; `unavailable` means the server does not currently store that
measure for ranking.

Updates are currently manual Git changes. A future exporter must run outside
the public website with read-only access, emit an allowlisted aggregate, and
be reviewed before publication. The existing server report tool also queries
private account/IP and gold data; do not publish its raw output.

Peak DPS is currently unavailable as a persistent public leaderboard metric.
The tracker stores cumulative stats, not durable peak-DPS rankings. Do not
infer peak DPS from lifetime damage.
