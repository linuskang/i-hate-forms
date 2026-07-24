# Troubleshooting

## `Cannot find module '@/registry/form'`

That is the source path used inside this repository. Consumers installing with
the shadcn CLI should import from their configured components alias:

```tsx
import { Form } from "@/components/form"
```

Check `aliases.components` in `components.json` if your project uses a
different alias.

## `Form components must be used inside <Form>`

`Form.Title` and `Form.Description` read the compound form context. Render them
under the same `Form` root:

```tsx
<Form onSubmit={handleSubmit}>
    <Form.Title>Profile</Form.Title>
    <Form.Description>Edit your profile.</Form.Description>
</Form>
```

`Form.Field` and `Form.Submit` also require the React Hook Form provider created
by the root.

## A shadcn Checkbox, Switch, or Select Does Not Update

These controls do not use the native `value` and `onChange` contract. Add an
`override` matching the component:

```tsx
override={({ field }) => ({
    checked: Boolean(field.value),
    onCheckedChange: field.onChange,
})}
```

Select-like controls generally use:

```tsx
override={({ field }) => ({
    value: field.value,
    onValueChange: field.onChange,
})}
```

See [component adapters](./component-adapters.md).

## Controlled/Uncontrolled Warnings

The direct binding passes `value` or `checked` to the child. Define defaults for
every controlled field:

```tsx
formOptions={{
    defaultValues: {
        email: "",
        enabled: false,
        tags: [],
    },
}}
```

Use the empty value expected by the component. Avoid changing a value from
`undefined` to a controlled string, boolean, or array after the first render.

## A Field Name Is Not Type-Checked

The `Form` root and static `Form.Field` member cannot share generic inference
through JSX. Pass the value type to each field when strict path checking is
important:

```tsx
<Form<AccountValues> onSubmit={save}>
    <Form.Field<AccountValues> name="email">
        <Input />
    </Form.Field>
</Form>
```

Without the field generic, React Hook Form's default `FieldValues` permits any
string path.

## The Submit Button Does Not Show Pending State

React Hook Form only keeps `isSubmitting` true while the promise returned by
`onSubmit` is unresolved. Return or await asynchronous work:

```tsx
async function onSubmit(values: Values) {
    await save(values)
}
```

Do not start an unreturned promise:

```tsx
function onSubmit(values: Values) {
    save(values) // The handler returns immediately.
}
```

Use the render function to change button text:

```tsx
<Form.Submit>
    {({ isSubmitting }) => (
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
        </Button>
    )}
</Form.Submit>
```

## Errors Exist but Are Not Visible

The library does not render styled error components. Use `Form.Field`'s render
function and read `fieldState.error`. See [validation](./validation.md).

## The First Invalid Custom Control Is Not Focused

The control must forward the injected React Hook Form `ref` to a focusable DOM
element. If it cannot, use render-function mode and connect `field.ref` to the
appropriate trigger or input.

## Browser `required` Does Not Block Submission

The root sets `noValidate` so React Hook Form owns validation. Add a `rules`
entry or resolver instead:

```tsx
<Form.Field name="email" rules={{ required: "Email is required" }}>
    <Input type="email" />
</Form.Field>
```

## The Installed File Is in an Unexpected Directory

The registry target is `@components/form/index.tsx`. The `@components/`
placeholder resolves from `aliases.components` in your `components.json`.
Inspect that value to find the actual target.

## Updating Would Overwrite Local Changes

Preview the update first:

```bash
npx shadcn@latest add linuskang/i-hate-forms/form --diff
```

Installed shadcn components are source-owned. Merge upstream changes manually
when your local implementation has diverged.

## Registry Installation Fails

Check the public item without modifying your project:

```bash
npx shadcn@latest view linuskang/i-hate-forms/form
```

Then confirm:

1. The repository is reachable publicly on GitHub.
2. Your project has a valid `components.json`.
3. Your shadcn CLI is current.
4. The target directory is writable.
5. Your package manager can install `react-hook-form`.

If the issue persists, open a GitHub issue with the CLI version, package
manager, framework, React version, and complete error output.
