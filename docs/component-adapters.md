# Component Adapters

`Form.Field` can connect any React control, but controls do not all expose the
same props. Choose direct binding, `override`, or a render function according to
the control's contract.

## Binding Modes

| Mode            | Use when                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| Direct child    | The component accepts native `value`, `onChange`, `onBlur`, `name`, and `ref` props. |
| `override`      | One element uses different value/change prop names.                                  |
| Render function | The field needs multiple elements, custom transformations, or custom error markup.   |

## Direct shadcn Inputs

shadcn `Input` and `Textarea` follow native element contracts and need no
adapter:

```tsx
<Form.Field<Values> name="name">
    <Input />
</Form.Field>

<Form.Field<Values> name="bio">
    <Textarea />
</Form.Field>
```

Native `input`, `textarea`, and `select` elements work the same way.

## shadcn Checkbox

shadcn `Checkbox` uses `checked` and `onCheckedChange`:

```tsx
import { Checkbox } from "@/components/ui/checkbox"

;<Form.Field<Values>
    name="terms"
    override={({ field, fieldState }) => ({
        "aria-invalid": fieldState.invalid,
        checked: Boolean(field.value),
        onCheckedChange: field.onChange,
    })}
>
    <Checkbox id="terms" />
</Form.Field>
```

## shadcn Switch

```tsx
import { Switch } from "@/components/ui/switch"

;<Form.Field<Values>
    name="notifications"
    override={({ field }) => ({
        checked: Boolean(field.value),
        onCheckedChange: field.onChange,
    })}
>
    <Switch id="notifications" />
</Form.Field>
```

## shadcn Select

The Select root uses `value` and `onValueChange`:

```tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

;<Form.Field<Values>
    name="role"
    override={({ field }) => ({
        value: field.value,
        onValueChange: field.onChange,
    })}
>
    <Select>
        <SelectTrigger aria-label="Role">
            <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
        </SelectContent>
    </Select>
</Form.Field>
```

If a particular Select implementation does not accept the injected `ref` or
`name`, use render-function mode instead.

## shadcn Radio Group

```tsx
<Form.Field<Values>
    name="plan"
    override={({ field }) => ({
        value: field.value,
        onValueChange: field.onChange,
    })}
>
    <RadioGroup>
        <RadioGroupItem value="free" />
        <RadioGroupItem value="pro" />
    </RadioGroup>
</Form.Field>
```

Native radio inputs do not require an override. Direct children with
`type="radio"` are compared against the current field value automatically.
Because native radio input values are strings, keep the corresponding form
value and default values as strings unless you handle conversion explicitly.

## shadcn Slider

Many slider implementations use an array even for one thumb:

```tsx
type Values = {
    volume: number[]
}

;<Form.Field<Values>
    name="volume"
    override={({ field }) => ({
        value: field.value,
        onValueChange: field.onChange,
    })}
>
    <Slider min={0} max={100} step={1} />
</Form.Field>
```

Match the form value type and default value to the component contract:

```tsx
formOptions={{ defaultValues: { volume: [50] } }}
```

## Value Transformation

Use render-function mode when stored values and component values differ. This
example stores a number while the native input emits strings:

```tsx
<Form.Field<Values> name="age">
    {({ field, fieldState }) => (
        <Input
            ref={field.ref}
            name={field.name}
            type="number"
            value={field.value ?? ""}
            aria-invalid={fieldState.invalid}
            onBlur={field.onBlur}
            onChange={(event) => {
                const value = event.target.value
                field.onChange(value === "" ? undefined : Number(value))
            }}
        />
    )}
</Form.Field>
```

Alternatively, perform coercion in a schema resolver when its input/output
types match the rest of your form.

## Multi-Element Controls

An element child must be a single control. If a field needs a trigger, popover,
hidden input, and error message, return the entire structure from a render
function:

```tsx
<Form.Field<Values> name="date">
    {({ field, fieldState }) => (
        <div>
            <DatePicker value={field.value} onValueChange={field.onChange} />
            {fieldState.error && <p>{fieldState.error.message}</p>}
        </div>
    )}
</Form.Field>
```

## Adapter Checklist

When adding a new component, identify:

1. Which prop contains its current value?
2. Which callback reports changes?
3. What empty value does it expect: `""`, `undefined`, `null`, `false`, or `[]`?
4. Does it forward `name`, `disabled`, `ref`, and `aria-invalid`?
5. Does its callback return a value or a browser event?

If any answer is unclear, prefer the render-function API. It is more explicit
and avoids leaking incompatible props into the component.
