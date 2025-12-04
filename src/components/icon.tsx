import type { FC, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
    Render: FC<SVGProps<SVGSVGElement>>;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
};

export const Icon: FC<IconProps> = ({
    Render,
    className,
    size = "md",
    ...props
}) => {
    const classes = ["w-fit", sizeClasses[size], className]
        .filter(Boolean)
        .join(" ");
    return <Render className={classes} {...props} />;
};
