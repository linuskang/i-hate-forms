# Validation and Errors

`i-hate-forms` does not define a validation system. It passes `formOptions` and
controller `rules` to React Hook Form, so any compatible resolver or built-in
rule can be used.

## Validation With Zod

Install Zod and the React Hook Form resolver package:

```bash
npm install zod @hookform/resolvers
```

Define a schema and infer the form value type:

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
    email: z.string().email("Enter a valid email address"),
    message: z.string().min(10, "Use at least 10 characters"),
})

type ContactValues = z.infer<typeof schema>
```

Pass the resolver and default values through `formOptions`:

```tsx
<Form<ContactValues>
    formOptions={{
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            message: "",
        },
        mode: "onBlur",
    }}
    onSubmit={(values) => console.log(values)}
>
    {/* fields */}
</Form>
```

## Displaying Field Errors

Use the `Form.Field` render function to place errors alongside your own UI:

```tsx
<Form.Field<ContactValues> name="email">
    {({ field, fieldState }) => {
        const errorId = `${field.name}-error`

        return (
            <div data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                    {...field}
                    id={field.name}
                    type="email"
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? errorId : undefined}
                />
                {fieldState.error && (
                    <p id={errorId} role="alert">
                        {fieldState.error.message}
                    </p>
                )}
            </div>
        )
    }}
</Form.Field>
```

The direct-child mode injects `aria-invalid`, but it cannot render your error
message because the library intentionally owns no visual field UI.

## Invalid Submission

Use `onInvalid` for form-level behavior when validation fails:

```tsx
<Form<ContactValues>
    formOptions={{ resolver: zodResolver(schema) }}
    onSubmit={saveContact}
    onInvalid={(errors) => {
        console.error("Validation failed", errors)
    }}
>
    {/* ... */}
</Form>
```

React Hook Form handles focusing the first invalid field when its `ref` is
forwarded correctly. Custom controls that cannot forward a focusable ref may
need application-specific focus handling.

## Built-In Rules

For small forms, validation can stay on the field:

```tsx
<Form.Field<ContactValues>
    name="message"
    rules={{
        required: "Message is required",
        minLength: {
            value: 10,
            message: "Use at least 10 characters",
        },
    }}
>
    {({ field, fieldState }) => (
        <div>
            <Textarea {...field} value={field.value ?? ""} />
            {fieldState.error && <p>{fieldState.error.message}</p>}
        </div>
    )}
</Form.Field>
```

## Server Errors

The current root submit callback receives values, not the `useForm` methods.
Keep general request failures in application state and render them inside the
form:

```tsx
function ContactForm() {
    const [serverError, setServerError] = useState<string | null>(null)

    async function onSubmit(values: ContactValues) {
        setServerError(null)

        const response = await fetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(values),
        })

        if (!response.ok) {
            setServerError("The server could not save this form.")
        }
    }

    return (
        <Form<ContactValues> onSubmit={onSubmit}>
            {/* fields */}
            {serverError && <p role="alert">{serverError}</p>}
            <Form.Submit>Send</Form.Submit>
        </Form>
    )
}
```

Descendant components can call `useFormContext<ContactValues>()` when they need
methods such as `setError` or `clearErrors`. For field-specific API errors,
create a project-level submit component inside the provider or extend your
installed source so the root callback also receives the form methods.

## Async Submission Errors

React Hook Form tracks a returned promise and keeps `isSubmitting` true until
it settles. Catch expected errors in application code so they can be rendered:

```tsx
async function onSubmit(values: ContactValues) {
    try {
        await save(values)
    } catch (error) {
        // Send the error to application state or form.setError.
    }
}
```

Thrown errors are not converted into field errors automatically.

## Browser Validation

The `Form` root renders `noValidate`. Native browser validation bubbles are
therefore disabled even when inputs use attributes such as `required`. Use a
React Hook Form rule or resolver for submission validation. Native attributes
may still communicate semantics and input behavior to browsers and assistive
technology, but they do not replace the configured form validation.
