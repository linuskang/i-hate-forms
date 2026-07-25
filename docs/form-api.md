# Form API Reference

## Import

After installing the GitHub registry item:

```tsx
import { Form } from "@/components/form"
```

The public API is one compound component. Structurally, a form contains:

```tsx
<Form onSubmit={handleSubmit}>
    <Form.Title>Title</Form.Title>
    <Form.Description>Description</Form.Description>
    <Form.Label name="field-name">Label</Form.Label>
    <Form.Field name="field-name">
        <input />
    </Form.Field>
    <Form.Error name="field-name" />
    <Form.Reset>Reset</Form.Reset>
    <Form.Submit>Submit</Form.Submit>
</Form>
```

## `Form`

Creates the React Hook Form instance and renders a native `form` element.

```tsx
<Form<Values>
    formOptions={{ defaultValues }}
    onSubmit={handleSubmit}
    onInvalid={handleInvalid}
    className="space-y-4"
>
    {/* children */}
</Form>
```

### Props

| Prop          | Type                               | Required | Description                                                 |
| ------------- | ---------------------------------- | -------- | ----------------------------------------------------------- |
| `onSubmit`    | `SubmitHandler<TFieldValues>`      | Yes      | Receives values after React Hook Form validation succeeds.  |
| `onInvalid`   | `SubmitErrorHandler<TFieldValues>` | No       | Receives field errors when submission validation fails.     |
| `formOptions` | `UseFormProps<TFieldValues>`       | No       | Passed directly to React Hook Form's `useForm`.             |
| `children`    | `ReactNode`                        | No       | Form title, fields, submit control, and application markup. |

All remaining native form props are forwarded, except the native `onSubmit`
type is replaced by React Hook Form's typed submit handler.

### Behavior

- Calls `useForm<TFieldValues>(formOptions)` once per mounted form.
- Wraps children with React Hook Form's `FormProvider`.
- Calls `handleSubmit(onSubmit, onInvalid)` for native submit events.
- Adds `noValidate`, so browser constraint-validation UI is disabled.
- Connects the generated title and description IDs through ARIA attributes.

The generated ARIA attributes and `noValidate` behavior are owned by the form
component and override conflicting native form props.

Use `formOptions` for any supported `useForm` option:

```tsx
<Form<Values>
    formOptions={{
        defaultValues: { email: "" },
        mode: "onBlur",
        reValidateMode: "onChange",
        resolver,
        shouldFocusError: true,
    }}
    onSubmit={handleSubmit}
>
    {/* ... */}
</Form>
```

## `Form.Title`

Renders an unstyled `h2` linked to the form with `aria-labelledby`.

```tsx
<Form.Title className="text-xl font-semibold">Create account</Form.Title>
```

It accepts all native `h2` props. A provided `id` overrides the generated ID,
so avoid replacing it unless you also understand the resulting ARIA reference.

## `Form.Description`

Renders an unstyled `p` linked to the form with `aria-describedby`.

```tsx
<Form.Description className="text-muted-foreground">
    All fields are required.
</Form.Description>
```

It accepts all native paragraph props. As with `Form.Title`, avoid overriding
the generated `id` without updating the form's accessibility relationship.

## `Form.Label`

Renders an unstyled native `label` connected to the direct child of the
corresponding `Form.Field`.

```tsx
<Form.Label<Values> name="email">Email</Form.Label>
<Form.Field<Values> name="email">
    <Input />
</Form.Field>
```

The `name` is type checked as a `FieldPath<TFieldValues>`. All native label
props are supported. A provided `htmlFor` overrides the generated field ID. If
the field child provides its own `id`, provide the same value as `htmlFor`.

## `Form.Field`

Connects one named value to React Hook Form through `useController`.

### Props

| Prop               | Type                                        | Required | Description                                                 |
| ------------------ | ------------------------------------------- | -------- | ----------------------------------------------------------- |
| `name`             | `FieldPath<TFieldValues>`                   | Yes      | Path of the value managed by this field.                    |
| `children`         | `ReactElement \| (controller) => ReactNode` | Yes      | One control element or a render function.                   |
| `override`         | `(controller) => Record<string, unknown>`   | No       | Replaces default value/change binding for a custom control. |
| `required`         | `boolean \| string`                         | No       | Adds required validation, optionally with an error message. |
| `rules`            | `RegisterOptions`                           | No       | React Hook Form validation and transformation rules.        |
| `defaultValue`     | `FieldPathValue`                            | No       | Field-level default when no root default is supplied.       |
| `disabled`         | `boolean`                                   | No       | Disables the controller and injected child prop.            |
| `shouldUnregister` | `boolean`                                   | No       | Removes the value when the field unmounts.                  |

All controller props except `control` are supported. `control` is obtained from
the `FormProvider` created by the root.

### Standard Child

```tsx
<Form.Field<Values> name="email" required="Email is required">
    <Input type="email" />
</Form.Field>
```

Using `required` also supplies native `required` and `aria-required` attributes
to direct children. `required` without a string uses `"This field is required"`
as its message. Existing `rules={{ required: ... }}` usage remains supported;
when both APIs are present, `rules.required` takes precedence.

The child must be a single valid React element. In standard mode, existing
`onChange` and `onBlur` handlers are called before React Hook Form's handlers.
The component also supplies a generated `id` and connects the field to its
matching `Form.Error` through `aria-describedby`. Existing `id` and
`aria-describedby` props are preserved.

### Native Checkbox and Radio

A direct child with `type="checkbox"` receives a boolean `checked` prop. A
direct child with `type="radio"` is checked when its `value` equals the current
field value.

```tsx
<Form.Field<Values> name="newsletter">
    <input type="checkbox" />
</Form.Field>
```

This automatic detection applies to native-style inputs. The shadcn `Checkbox`
component requires `override` because it does not expose `type="checkbox"`.
Native radio values are strings, so use string values in your form type and
default values unless you transform the browser event yourself.

### Override

`override` receives the complete controller result and returns props to inject.
It is used instead of the standard `value` and `onChange` binding.

```tsx
<Form.Field<Values>
    name="enabled"
    override={({ field, fieldState }) => ({
        "aria-invalid": fieldState.invalid,
        checked: Boolean(field.value),
        onCheckedChange: field.onChange,
    })}
>
    <Switch />
</Form.Field>
```

The form still supplies `name`, `disabled`, `ref`, and the default
`aria-invalid`; values returned by `override` are applied last and can replace
those defaults.

### Render Function

```tsx
<Form.Field<Values> name="email">
    {({ field, fieldState, formState }) => (
        <div data-invalid={fieldState.invalid}>
            <Input {...field} value={field.value ?? ""} />
            {fieldState.error && <p>{fieldState.error.message}</p>}
            {formState.isSubmitting && <span>Submitting...</span>}
        </div>
    )}
</Form.Field>
```

No cloning or automatic prop injection happens in render-function mode.

## `Form.Error`

Renders an unstyled paragraph when the named field has a validation error. It
returns `null` while the field has no error.

```tsx
<Form.Field<Values>
    name="email"
    required="Email is required"
>
    <Input type="email" />
</Form.Field>
<Form.Error<Values> name="email" className="text-sm text-destructive" />
```

By default, the paragraph contains the error's `message`. Pass children to
replace it, or use a render function for custom output:

```tsx
<Form.Error<Values> name="email">
    {(error) => <span>{error.message}</span>}
</Form.Error>
```

The generated error ID is included in the invalid direct-child field's
`aria-describedby`. A provided `id` overrides that generated ID, so avoid
replacing it unless the control's ARIA attributes are also updated. In
render-function field mode, apply the accessibility relationships manually or
render the error inside the field.

## `Form.Reset`

Resets the form to its configured default values. Element children receive
`type="button"`, and their existing click handler runs before the reset. Calling
`event.preventDefault()` in that handler cancels the reset.

```tsx
<Form.Reset>
    <Button variant="outline">Reset</Button>
</Form.Reset>
```

Text and other non-element content is wrapped in an unstyled native button:

```tsx
<Form.Reset>Reset</Form.Reset>
```

A render function receives the form methods and relevant form state. It owns
the rendered control and calls `form.reset()` explicitly:

```tsx
<Form.Reset>
    {({ form, isDirty, isSubmitting }) => (
        <Button
            type="button"
            disabled={!isDirty || isSubmitting}
            onClick={() => form.reset()}
        >
            Discard changes
        </Button>
    )}
</Form.Reset>
```

## `Form.Submit`

Connects a submit control to React Hook Form's pending state.

### Props

| Prop                     | Type                                           | Default | Description                                                |
| ------------------------ | ---------------------------------------------- | ------- | ---------------------------------------------------------- |
| `children`               | `ReactElement \| ReactNode \| render function` | None    | Submit element, native button content, or custom renderer. |
| `disableWhileSubmitting` | `boolean`                                      | `true`  | Disables the control while `isSubmitting` is true.         |
| `loading`                | `boolean`                                      | `false` | Controls an additional external loading state.             |

### Element Child

```tsx
<Form.Submit>
    <Button>Save</Button>
</Form.Submit>
```

The element receives `type="submit"`. Its existing `disabled` value is
preserved, and pending state may also disable it. While either `loading` or
React Hook Form's `isSubmitting` is true, it receives `aria-busy`. External
`loading` always disables the element; `disableWhileSubmitting` only controls
whether React Hook Form's submitting state disables it.

```tsx
<Form.Submit loading={creating}>
    <Button>Create Project</Button>
</Form.Submit>
```

### Text Child

Non-element content is wrapped in an unstyled native button:

```tsx
<Form.Submit>Save</Form.Submit>
```

### Render Function

```tsx
<Form.Submit>
    {({ form, isLoading, isSubmitting }) => (
        <Button
            type="submit"
            aria-busy={isLoading}
            disabled={isLoading || !form.formState.isDirty}
        >
            {isSubmitting ? "Saving..." : "Save"}
        </Button>
    )}
</Form.Submit>
```

The render function owns all button props and receives the React Hook Form
methods plus `isSubmitting` and the combined `isLoading` state.

## Exported Types

```tsx
import type {
    FormErrorProps,
    FormFieldOverride,
    FormFieldProps,
    FormFieldRenderProps,
    FormLabelProps,
    FormProps,
    FormResetProps,
    FormSubmitProps,
} from "@/components/form"
```

Use these when creating project-specific wrappers or adapters.
