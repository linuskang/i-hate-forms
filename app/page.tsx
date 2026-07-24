"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form } from "@/registry/form"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

type DemoForm = {
    name: string
    message: string
}

const exampleScript = `<Form>
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
`

export default function Page() {
    const [submittedValues, setSubmittedValues] = useState<DemoForm | null>(null)

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 p-6 py-16">
            <div className="flex flex-col justify-center items-center gap-3 mb-10">
                <Badge className="bg-blue-900 hover:bg-blue-900/80 transition dark:text-primary">
                    <Link href="/docs/release-notes">
                        v0 release - form components, utilities, and more
                    </Link>
                </Badge>
                <h1 className="text-center text-3xl font-[650] leading-tight tracking-tight">
                    Utility components for building
                    <br />
                    input forms in shadcn/ui.
                </h1>
                <p className="text-center text-lg text-muted-foreground">
                    form state management, validation, submit logic.
                    <br />
                    just bring your own components.
                </p>

                <div className="flex justify-center gap-2">
                    <Button className="rounded-full text-xs" variant="default">
                        Try the demo <ArrowRight />
                    </Button>

                    <Button className="rounded-full text-xs" variant="secondary">
                        View the docs
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-muted-foreground">
                    look. <strong>i hate creating user input forms.</strong>{" "}
                    it&apos;s tedious and repetitive. So, I made these utility
                    components to speed up the process.
                </p>
                <p className="text-muted-foreground">
                    here&apos;s what the library looks like.
                </p>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono">
                {exampleScript}
            </pre>

            <p className="text-muted-foreground">
                thats it. the lib handles all of the state management, validation, and submission logic for you.
            </p>

            <p className="text-muted-foreground">
                all you need to do is bring your own components. here is an example form:
            </p>

            <Form<DemoForm>
                className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
                onSubmit={(values) => setSubmittedValues(values)}
            >
                <div className="space-y-1">
                    <Form.Title className="text-xl font-semibold">
                        Say hello
                    </Form.Title>

                    <Form.Description className="text-sm text-muted-foreground">
                        Write me a cool message here.
                    </Form.Description>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Form.Field<DemoForm> name="name">
                        <Input id="name" placeholder="A cool person" />
                    </Form.Field>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Form.Field<DemoForm> name="message">
                        <Textarea
                            id="message"
                            className="min-h-20 resize-none"
                            placeholder="Woah cool form..."
                        />
                    </Form.Field>
                </div>

                <Form.Submit>
                    <Button className="w-full">Send message</Button>
                </Form.Submit>
            </Form>

            {submittedValues && (
                <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono">
                    {JSON.stringify(submittedValues, null, 2)}
                </pre>
            )}

            <p className="text-muted-foreground">
                thats literally it. youve now covered all the basics of using this component library.
            </p>

            <p className="text-muted-foreground">
                to get started, click the button below. thanks for checking this project out.
            </p>

            <div className="flex justify-center">
                <Button className="rounded-full text-xs" variant="default">
                    Get started <ArrowRight />
                </Button>
            </div>

            <p className="text-muted-foreground font-semibold text-center text-xs mt-15">
                © 2026 Linus Kang. Licensed under MIT.
            </p>

        </main>
    )
}
