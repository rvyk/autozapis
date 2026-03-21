import { cn } from "@/lib/utils";

type AuthContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function AuthContent({ children, className }: AuthContentProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full animate-in fade-in duration-300 ease-out lg:mx-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
