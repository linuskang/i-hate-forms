# the easiest way to create ``react-hook-forms``

i hate creating forms. even good libraries like ``react-hook-forms`` require so much configuration for just 1 form. you need to...

1. set up a controller,
2. configure ``useForm`` with
3. connect all fields using the ``controller``
4. display validation errors using their functions
5. logic for submission and loading states for every component

it might just be me but i hate creating these forms.

## quick start

all you need to do is add the components to your project:

```bash
npx shadcn@latest add linuskang/i-hate-forms/form
```

thats it, now, just create a form:

```tsx
<Form>
    <Form.Title>Say hello</Form.Title>

    <Form.Description>
        Write me a cool message here.
    </Form.Description>

    <Label>Name</Label>
    <Form.Field>
        <Input />
    </Form.Field>

    <Label>Message</Label>
    <Form.Field>
        <Textarea />
    </Form.Field>

    <Form.Submit>
        <Button />
    </Form.Submit>
</Form>
```

20 lines, with all of your form logic. just bring your own components.

still unsure? check out the [example form](https://i-hate-forms.linuskang.au)

## license

MIT