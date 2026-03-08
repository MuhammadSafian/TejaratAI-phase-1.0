import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-black font-heading font-bold shadow-[0_4px_15px_-4px_rgba(0,229,160,0.4)] hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,229,160,0.35)] hover:-translate-y-[1px] transition-all duration-200",
                destructive:
                    "bg-destructive text-white shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-border-strong bg-transparent text-text-primary shadow-sm hover:bg-white/[0.03]",
                secondary:
                    "bg-secondary text-primary shadow-sm hover:bg-secondary/80",
                ghost: "bg-transparent text-primary hover:bg-primary/10",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2 rounded-[10px]",
                sm: "h-9 rounded-md px-4 text-xs",
                lg: "h-12 rounded-[10px] px-8 text-base",
                icon: "h-10 w-10 rounded-[10px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
