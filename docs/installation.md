# Installation

`i-hate-forms` is distributed as a shadcn GitHub registry item. The public
GitHub repository is the registry server: the CLI reads `registry.json` and the
referenced source files directly from GitHub.

## Requirements

- A React 19 project.
- A `components.json` configured by shadcn.
- A package manager supported by the shadcn CLI.

The component itself is framework-agnostic React client code, but the current
source uses React 19 APIs. Next.js is not required as long as the consuming
project supports React client components and the aliases in `components.json`.

If shadcn is not initialized yet, follow the
[official installation guide](https://ui.shadcn.com/docs/installation) first.

## Install From GitHub

Choose the command for your package manager:

```bash
# npm
npx shadcn@latest add linuskang/i-hate-forms/form

# pnpm
pnpm dlx shadcn@latest add linuskang/i-hate-forms/form

# bun
bunx shadcn@latest add linuskang/i-hate-forms/form
```

The GitHub address has three parts:

```text
linuskang / i-hate-forms / form
owner       repository     registry item
```

No hosted `/r/form.json` endpoint and no npm package are involved.

## What Gets Installed

The registry item declares:

- `react-hook-form` as an npm dependency.
- `registry/form/index.tsx` as its source.
- `@components/form/index.tsx` as its target.

The `@components/` placeholder uses `aliases.components` from your
`components.json`. A common configuration produces:

```text
components/
└── form/
    └── index.tsx
```

Projects using `src/`, a monorepo package, or a different alias may receive the
file elsewhere. The configured alias, not this repository's directory layout,
determines the destination.

## Import the Component

With the standard alias:

```tsx
import { Form } from "@/components/form"
```

Do not use this repository's internal source import:

```tsx
// Wrong in a consuming project
import { Form } from "@/registry/form"
```

## Inspect Before Installing

Registry items install source code and dependencies into your application.
Review the resolved item before installation:

```bash
npx shadcn@latest view linuskang/i-hate-forms/form
```

Preview the changes without writing files:

```bash
npx shadcn@latest add linuskang/i-hate-forms/form --dry-run
```

The source can also be reviewed directly in
[`registry/form/index.tsx`](../registry/form/index.tsx).

## Updating

Run the add command again to compare the registry version with your local copy:

```bash
npx shadcn@latest add linuskang/i-hate-forms/form --diff
```

Use the CLI's diff or view output before replacing local changes. A major
benefit of shadcn distribution is source ownership: after installation, the
file belongs to your project and may intentionally differ from this repository.

## Installing a Specific Ref

Without a ref, the CLI resolves the repository's default branch. For a
reproducible installation, append a release tag or full commit SHA:

```bash
npx shadcn@latest add linuskang/i-hate-forms/form#<tag-or-full-commit-sha>
```

Refs are especially useful in production projects that want to review upgrades
separately from new registry commits.

## Optional Validation Packages

The registry installs React Hook Form, but it does not force a schema library.
For Zod validation, install:

```bash
npm install zod @hookform/resolvers
```

Then follow the [validation guide](./validation.md).

## Verify the Installation

Create a client component and confirm the import resolves:

```tsx
"use client"

import { Form } from "@/components/form"

export function InstallationCheck() {
    return (
        <Form onSubmit={(values) => console.log(values)}>
            <Form.Title>Installation check</Form.Title>
            <Form.Description>The registry item is installed.</Form.Description>
            <Form.Field name="message">
                <input aria-label="Message" />
            </Form.Field>
            <Form.Submit>Submit</Form.Submit>
        </Form>
    )
}
```

Continue with [core concepts](./concepts.md) after the component renders.
