import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-[6px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-black shadow hover:bg-primary/80",
                success:
                    "bg-[rgba(0,229,160,0.12)] text-primary border-[rgba(0,229,160,0.25)]",
                warning:
                    "bg-[rgba(255,179,71,0.12)] text-[#FFB347] border-[rgba(255,179,71,0.25)]",
                destructive:
                    "bg-[rgba(255,77,106,0.12)] text-destructive border-[rgba(255,77,106,0.25)]",
                neutral:
                    "bg-[rgba(255,255,255,0.06)] text-text-secondary border-transparent",
                outline:
                    "text-text-secondary border-border",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
