# Deployment and domains

## Repository-controlled contract

The supplied source identifies the public repository as `O-Marmullaku/CrazyEntertainment`, with GitHub Pages configured for branch `main`, repository root. `CNAME` contains `crazyentertainment.ch`; `.nojekyll` is intentional. No build step is required. Keep page, stylesheet, script and media links relative so the same files work at an apex domain and a GitHub Pages repository subpath.

The root `privacy.html` URL is used by the Crazy Enhancer for YouTube extension's store listing. Preserve it, `impressum.html`, the published contact information, and the disclosed external Google Fonts loading. Editing hosting, legal or privacy commitments needs owner authorization, not just a passing test.

## Dated owner-supplied configuration — recheck before operating

These records came with the source archive. They preserve consequential setup knowledge; **they are not current DNS, certificate, account or deployment verification**. Repository files cannot establish the state of registrar dashboards, Pages settings or Cloudflare rules.

### Primary domain: recorded 25 June 2026

`crazyentertainment.ch` used GoDaddy DNS/nameservers, not Cloudflare delegation:

| Record | Recorded value |
| --- | --- |
| Apex `A` records | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `www` CNAME | `o-marmullaku.github.io.` |
| Other records to preserve | Existing domaincontrol.com NS, SOA, `_domainconnect` and `_dmarc` TXT |

The historical check reported working HTTPS and primary/legal pages, with the GitHub Pages repository URL and `www` redirecting to the apex. Verify the actual endpoints and host configuration rather than assuming those observations remain true.

### Secondary redirect domain: recorded 8 August 2026

`crazysoftware.ch` remained registered at GoDaddy but was delegated to Cloudflare nameservers `mack.ns.cloudflare.com` and `tia.ns.cloudflare.com`. This is a different arrangement from the primary domain.

| Record / rule | Recorded configuration |
| --- | --- |
| Apex `A` | `192.0.2.1`, **Proxied** |
| `www` CNAME | `crazysoftware.ch`, **Proxied** |
| `_dmarc` TXT | DNS only; existing value must be preserved |
| MX | None recorded; no email service on this domain at that time |
| Redirect rule | `crazysoftware -> crazyentertainment`; all incoming requests; static target `https://crazyentertainment.ch`; **301**; preserve query string |

The dummy apex address is deliberate: the Cloudflare edge redirect, not an origin server, answers requests. Do not “repair” the address or disable proxying as website cleanup. The recorded target is the primary root URL, not a path-preserving redirect.

The move addressed HTTPS forwarding failures in the prior registrar forwarding setup. The historical verification covered apex, `www` and HTTP, with a valid certificate and preserved query string. If this arrangement is still in service and a Cloudflare 522 appears, first check that the redirect rule is enabled and published rather than still a draft; do not start by replacing the dummy origin. A 522 alone does not prove which configuration failed.

## Before a deployment or domain change

Confirm owner authorization and inspect the actual Pages settings, DNS zone, redirect rule and certificate. Serve the source and run the README checks before publication. After an authorized deployment, verify HTTPS, redirect status and target, query handling, both legal pages, and relative assets. A local test is not evidence that publication or DNS has succeeded. This source package contains no credentials or authority to change external accounts.
