# Security Policy

Security matters for this open-source browser hardware diagnostics toolkit, especially because it touches browser APIs, media permissions, and user-facing diagnostic flows.

## Reporting security issues

Please do **not** open a public issue for sensitive security problems.

Instead, report security concerns privately to the maintainer entry point:

- **Maintainer:** https://github.com/OneSpiral

When reporting, include:

- affected area
- reproduction details
- impact assessment
- any proof-of-concept or screenshots that help explain the issue

## What belongs in public issues

Public issues are fine for non-sensitive bugs, compatibility issues, and normal technical defects.

If the report could expose a real vulnerability, permission bypass concern, or unsafe handling pattern, keep it out of the public issue tracker until the maintainer has reviewed it.

## Scope

Examples of relevant security topics:

- unsafe handling of browser permissions
- untrusted input handling issues
- content injection risks
- misuses of media or hardware-related browser APIs
- supply-chain concerns in repository dependencies
