"use client"

import * as React from "react"
import {
    FormProvider,
    useController,
    useForm,
    useFormContext,
    type FieldPath,
    type FieldValues,
    type SubmitErrorHandler,
    type SubmitHandler,
    type UseControllerProps,
    type UseFormProps,
    type UseFormReturn,
} from "react-hook-form"

type FormContextValue = {
    descriptionId: string
    titleId: string
}

const FormContext = React.createContext<FormContextValue | null>(null)

function useHeadlessForm() {
    const context = React.use(FormContext)

    if (!context) {
        throw new Error("Form components must be used inside <Form>.")
    }

    return context
}

type FormProps<TFieldValues extends FieldValues = FieldValues> = Omit<
    React.ComponentProps<"form">,
    "onSubmit"
> & {
    formOptions?: UseFormProps<TFieldValues>
    onInvalid?: SubmitErrorHandler<TFieldValues>
    onSubmit: SubmitHandler<TFieldValues>
}

function FormRoot<TFieldValues extends FieldValues = FieldValues>({
    children,
    formOptions,
    onInvalid,
    onSubmit,
    ...props
}: FormProps<TFieldValues>) {
    const form = useForm<TFieldValues>(formOptions)
    const id = React.useId()
    const context = {
        descriptionId: `${id}-description`,
        titleId: `${id}-title`,
    }

    return (
        <FormContext value={context}>
            <FormProvider {...form}>
                <form
                    aria-describedby={context.descriptionId}
                    aria-labelledby={context.titleId}
                    noValidate
                    {...props}
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                >
                    {children}
                </form>
            </FormProvider>
        </FormContext>
    )
}

function FormTitle(props: React.ComponentProps<"h2">) {
    const { titleId } = useHeadlessForm()

    return <h2 id={titleId} {...props} />
}

function FormDescription(props: React.ComponentProps<"p">) {
    const { descriptionId } = useHeadlessForm()

    return <p id={descriptionId} {...props} />
}

type FormFieldRenderProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
> = ReturnType<typeof useController<TFieldValues, TName>>

type FormFieldOverride<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
> = (
    props: FormFieldRenderProps<TFieldValues, TName>
) => Record<string, unknown>

type FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
    children:
        | React.ReactElement
        | ((
              props: FormFieldRenderProps<TFieldValues, TName>
          ) => React.ReactNode)
    override?: FormFieldOverride<TFieldValues, TName>
}

type NativeControlProps = {
    "aria-invalid"?: boolean
    checked?: boolean
    disabled?: boolean
    name?: string
    onBlur?: (event: React.FocusEvent) => void
    onChange?: (event: React.ChangeEvent) => void
    ref?: React.Ref<unknown>
    type?: string
    value?: unknown
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
    return (value: T | null) => {
        for (const ref of refs) {
            if (typeof ref === "function") {
                ref(value)
            } else if (ref) {
                ref.current = value
            }
        }
    }
}

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ children, override, ...props }: FormFieldProps<TFieldValues, TName>) {
    const controller = useController<TFieldValues, TName>(props)

    if (typeof children === "function") {
        return children(controller)
    }

    const child = children as React.ReactElement<NativeControlProps>
    const childProps = child.props
    const { field, fieldState } = controller
    const checkbox = childProps.type === "checkbox"
    const radio = childProps.type === "radio"

    if (override) {
        return React.cloneElement(child, {
            "aria-invalid": fieldState.invalid,
            disabled: field.disabled,
            name: field.name,
            ref: mergeRefs(childProps.ref, field.ref),
            ...override(controller),
        } as NativeControlProps)
    }

    const controlProps: NativeControlProps = {
        "aria-invalid": fieldState.invalid,
        disabled: field.disabled,
        name: field.name,
        onBlur: (event) => {
            childProps.onBlur?.(event)
            field.onBlur()
        },
        onChange: (event) => {
            childProps.onChange?.(event)
            field.onChange(event)
        },
        ref: mergeRefs(childProps.ref, field.ref),
    }

    if (checkbox) {
        controlProps.checked = Boolean(field.value)
    } else if (radio) {
        controlProps.checked = field.value === childProps.value
    } else {
        controlProps.value = field.value ?? ""
    }

    return React.cloneElement(child, controlProps)
}

type FormSubmitRenderProps = {
    form: UseFormReturn<FieldValues>
    isSubmitting: boolean
}

type FormSubmitProps = {
    children:
        | React.ReactElement
        | React.ReactNode
        | ((props: FormSubmitRenderProps) => React.ReactNode)
    disableWhileSubmitting?: boolean
}

function FormSubmit({
    children,
    disableWhileSubmitting = true,
}: FormSubmitProps) {
    const form = useFormContext()
    const isSubmitting = form.formState.isSubmitting

    if (typeof children === "function") {
        return children({ form, isSubmitting })
    }

    if (
        !React.isValidElement<{ disabled?: boolean; type?: string }>(children)
    ) {
        return (
            <button
                disabled={disableWhileSubmitting && isSubmitting}
                type="submit"
            >
                {children}
            </button>
        )
    }

    return React.cloneElement(children, {
        disabled:
            children.props.disabled || (disableWhileSubmitting && isSubmitting),
        type: "submit",
    })
}

const Form = Object.assign(FormRoot, {
    Description: FormDescription,
    Field: FormField,
    Submit: FormSubmit,
    Title: FormTitle,
})

export { Form }
export type {
    FormFieldOverride,
    FormFieldProps,
    FormFieldRenderProps,
    FormProps,
    FormSubmitProps,
}
