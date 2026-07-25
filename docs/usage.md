# Usage

These examples assume the registry item is installed and imported from the
consumer path:

```tsx
import { Form } from "@/components/form"
```

## Complete Contact Form

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form } from "@/components/form"

type ContactValues = {
    email: string
    message: string
    name: string
}

export function ContactForm() {
    async function onSubmit(values: ContactValues) {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })

        if (!response.ok) {
            throw new Error("Unable to send message")
        }
    }

    return (
        <Form<ContactValues>
            className="space-y-4"
            formOptions={{
                defaultValues: {
                    email: "",
                    message: "",
                    name: "",
                },
            }}
            onSubmit={onSubmit}
        >
            <Form.Title>Contact us</Form.Title>
            <Form.Description>We normally reply within a day.</Form.Description>

            <div>
                <Form.Label<ContactValues> name="name">Name</Form.Label>
                <Form.Field<ContactValues>
                    name="name"
                    required="Name is required"
                >
                    <Input autoComplete="name" />
                </Form.Field>
                <Form.Error<ContactValues> name="name" />
            </div>

            <div>
                <Form.Label<ContactValues> name="email">Email</Form.Label>
                <Form.Field<ContactValues>
                    name="email"
                    required="Email is required"
                >
                    <Input type="email" autoComplete="email" />
                </Form.Field>
                <Form.Error<ContactValues> name="email" />
            </div>

            <div>
                <Form.Label<ContactValues> name="message">Message</Form.Label>
                <Form.Field<ContactValues>
                    name="message"
                    required="Message is required"
                >
                    <Textarea />
                </Form.Field>
                <Form.Error<ContactValues> name="message" />
            </div>

            <Form.Reset>
                <Button type="button" variant="outline">Reset</Button>
            </Form.Reset>
            <Form.Submit>
                {({ isSubmitting }) => (
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send message"}
                    </Button>
                )}
            </Form.Submit>
        </Form>
    )
}
```

## React Hook Form Rules

Use the `rules` accepted by `useController` when a schema resolver is not
needed:

```tsx
<Form.Field<ContactValues>
    name="email"
    rules={{
        required: "Email is required",
        pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Enter a valid email",
        },
    }}
>
    {({ field, fieldState }) => (
        <div>
            <Input {...field} type="email" value={field.value ?? ""} />
            {fieldState.error && <p>{fieldState.error.message}</p>}
        </div>
    )}
</Form.Field>
```

## Nested Values

React Hook Form field paths work normally:

```tsx
type CheckoutValues = {
    shipping: {
        city: string
        postalCode: string
    }
}

;<Form<CheckoutValues>
    formOptions={{
        defaultValues: {
            shipping: { city: "", postalCode: "" },
        },
    }}
    onSubmit={(values) => console.log(values.shipping.city)}
>
    <Form.Field<CheckoutValues> name="shipping.city">
        <Input aria-label="City" />
    </Form.Field>

    <Form.Field<CheckoutValues> name="shipping.postalCode">
        <Input aria-label="Postal code" />
    </Form.Field>

    <Form.Submit>Continue</Form.Submit>
</Form>
```

## Accessing Form Methods

The root uses `FormProvider`, so descendants can access the complete form with
React Hook Form's `useFormContext`.

```tsx
import { useFormContext } from "react-hook-form"

function ResetButton() {
    const form = useFormContext<ContactValues>()

    return (
        <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
        </Button>
    )
}
```

Place the helper anywhere inside `Form`:

```tsx
<Form<ContactValues> onSubmit={onSubmit}>
    {/* fields */}
    <ResetButton />
    <Form.Submit>Send</Form.Submit>
</Form>
```

The same approach works with `watch`, `setValue`, `setError`, `clearErrors`, and
other React Hook Form methods.

## Conditional Fields

Use normal React rendering. Set `shouldUnregister` when an unmounted field
should be removed from submitted values:

```tsx
{
    showCompany && (
        <Form.Field<Values> name="company" shouldUnregister>
            <Input aria-label="Company" />
        </Form.Field>
    )
}
```

## Allowing Repeat Submissions

`Form.Submit` only disables while an async handler is pending. It does not
permanently disable after success. Control any additional behavior through the
render function:

```tsx
<Form.Submit disableWhileSubmitting={false}>
    {({ form, isSubmitting }) => (
        <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
        >
            Save changes
        </Button>
    )}
</Form.Submit>
```

## Building Project-Specific Fields

The installed file belongs to your project. You can wrap the primitive API
without changing the registry source:

```tsx
function EmailField() {
    return (
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Form.Field<ContactValues> name="email">
                <Input id="email" type="email" />
            </Form.Field>
        </div>
    )
}
```

For shadcn controls with custom value contracts, continue to
[component adapters](./component-adapters.md).
