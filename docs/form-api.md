# Form API Reference

## Import

After installing the GitHub registry item:

```tsx
import { Form } from "@/components/form"
```

The public API is one compound component:

```tsx
<Form>
    <Form.Title />
    <Form.Description />
    <Form.Field />
    <Form.Submit />
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

## `Form.Field`

Connects one named value to React Hook Form through `useController`.

### Props

| Prop               | Type                                        | Required | Description                                                 |
| ------------------ | ------------------------------------------- | -------- | ----------------------------------------------------------- |
| `name`             | `FieldPath<TFieldValues>`                   | Yes      | Path of the value managed by this field.                    |
| `children`         | `ReactElement \| (controller) => ReactNode` | Yes      | One control element or a render function.                   |
| `override`         | `(controller) => Record<string, unknown>`   | No       | Replaces default value/change binding for a custom control. |
| `rules`            | `RegisterOptions`                           | No       | React Hook Form validation and transformation rules.        |
| `defaultValue`     | `FieldPathValue`                            | No       | Field-level default when no root default is supplied.       |
| `disabled`         | `boolean`                                   | No       | Disables the controller and injected child prop.            |
| `shouldUnregister` | `boolean`                                   | No       | Removes the value when the field unmounts.                  |

All controller props except `control` are supported. `control` is obtained from
the `FormProvider` created by the root.

### Standard Child

```tsx
<Form.Field<Values> name="email" rules={{ required: "Email is required" }}>
    <Input type="email" />
</Form.Field>
```

The child must be a single valid React element. In standard mode, existing
`onChange` and `onBlur` handlers are called before React Hook Form's handlers.

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

## `Form.Submit`

Connects a submit control to React Hook Form's pending state.

### Props

| Prop                     | Type                                           | Default | Description                                                |
| ------------------------ | ---------------------------------------------- | ------- | ---------------------------------------------------------- |
| `children`               | `ReactElement \| ReactNode \| render function` | None    | Submit element, native button content, or custom renderer. |
| `disableWhileSubmitting` | `boolean`                                      | `true`  | Disables the control while `isSubmitting` is true.         |

### Element Child

```tsx
<Form.Submit>
    <Button>Save</Button>
</Form.Submit>
```

The element receives `type="submit"`. Its existing `disabled` value is
preserved, and pending state may also disable it.

### Text Child

Non-element content is wrapped in an unstyled native button:

```tsx
<Form.Submit>Save</Form.Submit>
```

### Render Function

```tsx
<Form.Submit>
    {({ form, isSubmitting }) => (
        <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
        >
            {isSubmitting ? "Saving..." : "Save"}
        </Button>
    )}
</Form.Submit>
```

The render function owns all button props and receives the React Hook Form
methods plus `isSubmitting`.

## Exported Types

```tsx
import type {
    FormFieldOverride,
    FormFieldProps,
    FormFieldRenderProps,
    FormProps,
    FormSubmitProps,
} from "@/components/form"
```

Use these when creating project-specific wrappers or adapters.
