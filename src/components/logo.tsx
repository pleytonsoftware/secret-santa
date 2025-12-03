import Image from "next/image";

export const Logo = (
    props: Omit<React.ComponentProps<typeof Image>, "src" | "alt">,
) => <Image src="/logo.svg" alt="Logo" width={32} height={32} {...props} />;
