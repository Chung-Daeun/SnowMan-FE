"use client";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "SnowMan" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-light/20 px-6 py-4">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
    </header>
  );
}
