# Documentation

This directory contains the complete documentation for `i-hate-forms`. The
guides are stored with the source repository so API changes and documentation
can be reviewed together.

## Start Here

1. [Installation](./installation.md) explains how to install the component from
   the public GitHub registry with `shadcn@latest`.
2. [Core concepts](./concepts.md) explains how the compound components map to
   React Hook Form.
3. [Usage](./usage.md) provides complete forms and common patterns.
4. [Form API](./form-api.md) documents every exported component and prop.

## Guides

| Guide                                         | Description                                                          |
| --------------------------------------------- | -------------------------------------------------------------------- |
| [Installation](./installation.md)             | Install, inspect, update, or pin the GitHub registry item.           |
| [Core concepts](./concepts.md)                | Understand ownership, form context, fields, and submission.          |
| [Form API](./form-api.md)                     | Reference for `Form`, `Title`, `Description`, `Field`, and `Submit`. |
| [Usage](./usage.md)                           | Basic forms, async submission, nested fields, and form methods.      |
| [Component adapters](./component-adapters.md) | Connect shadcn controls with non-native value APIs.                  |
| [Validation](./validation.md)                 | Configure Zod, field errors, invalid submissions, and server errors. |
| [Troubleshooting](./troubleshooting.md)       | Diagnose imports, controlled values, and custom-control bindings.    |

## Producer and Consumer Paths

This repository stores the source at:

```text
registry/form/index.tsx
```

That is a contributor path. Consumers should not import from `@/registry/form`.
After installation, shadcn writes the item to the components alias configured
by the consumer. In a standard project, the public import is:

```tsx
import { Form } from "@/components/form"
```

All documentation examples use the consumer import path.

## Useful Links

- [Repository](https://github.com/linuskang/i-hate-forms)
- [Registry definition](../registry.json)
- [Registry source](../registry/form/index.tsx)
- [React Hook Form documentation](https://react-hook-form.com/)
- [shadcn GitHub registry documentation](https://ui.shadcn.com/docs/registry/github)
