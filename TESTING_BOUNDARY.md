# Testing Boundary

This repository keeps a deliberately thin public validation surface.

## Public validation

The public repository may contain only thin public validation such as:

- repository governance and documentation checks
- sponsor / maintainer / branding boundary checks
- non-sensitive smoke checks for the OSS surface
- build and type validation

## Private evaluation assets

Comprehensive quality enforcement stays private as **private evaluation assets**.

That includes:

- browser / device regression suites
- golden datasets
- hidden fixtures
- tolerance thresholds
- compatibility truth tables
- benchmark baselines
- challenge or acceptance sets used for private quality gating

## Why this boundary exists

In the AI era, test sets are part of the product moat.

Publishing detailed regression and evaluation assets would disclose how the project measures quality, which devices and browsers it optimizes for, and where its edge cases live.

## Contributor guidance

If you find a bug or want to propose a new capability:

- open a public issue or discussion with a concise problem statement
- describe the observable behavior and reproduction steps
- do not publish proprietary fixtures or hidden evaluation material in the public repo

## Enforcement

This repository enforces the boundary by keeping only thin public validation in CI.

Comprehensive regression and evaluation work must stay in private infrastructure.
