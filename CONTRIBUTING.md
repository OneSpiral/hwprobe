# Contributing

Thanks for helping improve **Browser Hardware Diagnostics**.

This repository is for growing shared **technical capabilities** in browser-based hardware diagnostics, not for shipping private growth systems for any branded website.

## Good contribution areas

We especially welcome issues and pull requests for:

- browser compatibility fixes
- cleaner hardware diagnostics APIs
- more accurate measurements
- accessibility improvements
- public validation ergonomics
- performance improvements
- extensibility for new diagnostic modules
- better developer ergonomics

## Before opening work

1. Search existing **issues** first.
2. If the change is non-trivial, open an issue describing the problem and proposed approach.
3. Keep feature requests focused on reusable technical value.

## Writing issues

When opening public issues, use neutral, contributor-facing wording:

- prefer titles in the form `scope: concise action`
- start with a short **Summary**
- include **Scope** for the affected module, API, or shared primitive
- explain **Why this matters** when proposing new work
- include **Acceptance criteria** when you can define a clear finish line
- send anything sensitive to `SECURITY.md` instead of a public issue

## Pull requests

Please keep pull requests scoped and technical.

A good pull request should:

- improve the toolkit itself
- keep public validation thin and non-sensitive
- avoid private growth logic or monetization logic
- explain the technical tradeoffs clearly

Do **not** add private evaluation assets to the public repository, including browser / device regression suites, golden datasets, hidden fixtures, or tolerance thresholds.

## Development flow

This repository follows a TDD-first workflow, but comprehensive regression coverage stays private:

1. write a failing public boundary or smoke check when that can be shared safely
2. make it pass
3. refactor safely
4. run checks before commit
5. maintainers can extend private evaluation assets separately when needed

## Validation

Run before submitting pull requests:

```bash
pnpm test:public
pnpm check
pnpm build
```

## Out of scope

Please do not submit pull requests for:

- ads / affiliate logic
- private SEO systems
- branded landing-page growth tactics
- analytics experiments tied to a private deployment

Those belong outside the open-source technical solution.
