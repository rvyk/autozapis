import { cn } from "@/lib/utils";

type AuthContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function AuthContent({ children, className }: AuthContentProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-xl animate-in fade-in duration-300 ease-out lg:mx-0 lg:max-w-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
