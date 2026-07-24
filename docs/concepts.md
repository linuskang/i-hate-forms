# Core Concepts

`i-hate-forms` is a thin component API over React Hook Form. Understanding which
layer owns each responsibility makes the library easier to extend.

## Responsibility Boundaries

React Hook Form owns:

- Form values and field state.
- Validation and submission state.
- Field registration through `useController`.
- The form context exposed through `FormProvider`.

`i-hate-forms` owns:

- Creating the React Hook Form instance.
- Connecting compound components to the form context.
- Injecting standard field props into direct child controls.
- Connecting title and description IDs for accessibility.
- Disabling submit controls while an async submission is pending.

Your application owns:

- Labels, layouts, styling, and visual error messages.
- The validation schema or field rules.
- API calls, server errors, redirects, and success messages.
- Adapters for controls that do not use native input props.

## The Form Root

`<Form>` calls `useForm`, wraps its children in `FormProvider`, and renders a
native `<form>` element. It passes `formOptions` to `useForm` and passes valid
submissions to `onSubmit`.

```tsx
type LoginValues = {
    email: string
    password: string
}

;<Form<LoginValues>
    formOptions={{
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
    }}
    onSubmit={(values) => console.log(values)}
>
    {/* form content */}
</Form>
```

The component deliberately owns the `useForm` instance. If a child needs
methods such as `reset`, `setError`, or `watch`, it can call React Hook Form's
`useFormContext` because the provider is already present.

## Title and Description

`Form.Title` renders an unstyled `h2`. `Form.Description` renders an unstyled
paragraph. Their generated IDs are assigned to the form's `aria-labelledby`
and `aria-describedby` attributes.

```tsx
<Form.Title>Account details</Form.Title>
<Form.Description>Update your public profile.</Form.Description>
```

Use both components so the form has a valid accessible name and description.
All normal `h2` and `p` props, including `className`, are forwarded.

## Direct Field Binding

`Form.Field` calls `useController` and clones its single child. For a standard
input contract, it injects:

- `name`
- `value`, or `checked` for native checkboxes and radios
- `onChange`
- `onBlur`
- `disabled`
- `ref`
- `aria-invalid`

```tsx
<Form.Field<LoginValues> name="email">
    <Input id="email" type="email" />
</Form.Field>
```

These are controller-backed, controlled values. Supplying matching
`defaultValues` through `formOptions` gives reset operations a known destination
and keeps initial form state explicit. Direct native binding normalizes missing
text values to `""` and missing checkbox values to `false`.

## Field Names and Type Safety

Pass the value type to the root and fields:

```tsx
type ProfileValues = {
    address: {
        city: string
    }
}

;<Form<ProfileValues>
    formOptions={{ defaultValues: { address: { city: "" } } }}
    onSubmit={(values) => console.log(values)}
>
    <Form.Field<ProfileValues> name="address.city">
        <Input />
    </Form.Field>
</Form>
```

`name` uses React Hook Form's `FieldPath<TFieldValues>`, so invalid nested paths
are rejected by TypeScript when the generic is supplied to `Form.Field`.

## Non-Native Control Contracts

Not every shadcn component behaves like an HTML input:

- `Checkbox` and `Switch` use `checked` and `onCheckedChange`.
- `Select` and `RadioGroup` use `value` and `onValueChange`.
- `Slider` commonly uses an array value and `onValueChange`.

Use `override` to translate the controller into the component's contract:

```tsx
<Form.Field<ProfileValues>
    name="notifications"
    override={({ field }) => ({
        checked: Boolean(field.value),
        onCheckedChange: field.onChange,
    })}
>
    <Switch />
</Form.Field>
```

See [component adapters](./component-adapters.md) for complete examples.

## Render Functions

When cloning one element is not enough, use a function child. It receives the
complete return value from `useController`, including `field`, `fieldState`, and
`formState`.

```tsx
<Form.Field<LoginValues> name="email">
    {({ field, fieldState }) => (
        <div>
            <Input {...field} value={field.value ?? ""} />
            {fieldState.error && <p>{fieldState.error.message}</p>}
        </div>
    )}
</Form.Field>
```

This is the preferred escape hatch for error markup, multi-element controls,
value transformation, or components requiring several coordinated props.

## Submission

`Form.Submit` clones an element child, forces `type="submit"`, and disables it
while `formState.isSubmitting` is true.

```tsx
<Form.Submit>
    <Button>Save</Button>
</Form.Submit>
```

React Hook Form keeps `isSubmitting` true until an async `onSubmit` settles:

```tsx
async function save(values: LoginValues) {
    await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(values),
    })
}
```

When you need custom pending content, use the submit render function. Continue
with the [API reference](./form-api.md) or [usage guide](./usage.md).
