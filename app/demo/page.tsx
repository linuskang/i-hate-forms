"use client";

// form type declaration
type ExampleForm = {
    name: string;
    email: string;
}

// form utility component.
import { Form } from "@/components/form";

// shadcn/ui
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Demo() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <div className="space-y-1 text-center">
                <h1 className="text-xl font-semibold">
                    Example form
                </h1>

                <p className="text-sm leading-relaxed text-muted-foreground">
                    Submit the form, then check your browser console
                    <br className="hidden sm:block" />
                    for the submitted data.
                </p>
            </div>

            <Form<ExampleForm>
                onSubmit={(data) => {
                    console.log(data);
                }}
            >
                <div className="mb-4 space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Form.Field<ExampleForm> name="name">
                        <Input id="name" placeholder="Name" />
                    </Form.Field>
                </div>

                <div className="mb-4 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Form.Field<ExampleForm> name="email">
                        <Input id="email" placeholder="Email" />
                    </Form.Field>
                </div>

                <Form.Submit>
                    <Button>Submit</Button>
                </Form.Submit>
            </Form>
        </div>
    )
}