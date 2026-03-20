"use client";

export default function RejestracjaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-in fade-in duration-200 ease-out">{children}</div>;
}
