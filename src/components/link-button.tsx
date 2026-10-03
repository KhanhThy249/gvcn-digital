import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

export interface LinkButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  href: string;
  children: React.ReactNode;
}

/** Button styled as a Next.js link (Base UI uses `render`, not `asChild`). */
export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button render={<Link href={href} />} {...props}>
      {children}
    </Button>
  );
}