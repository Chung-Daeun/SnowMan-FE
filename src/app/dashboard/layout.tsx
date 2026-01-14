import { Header } from "@/shared/ui/Header";
import { Navbar } from "@/shared/ui/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pb-20">{children}</main>
      <Navbar />
    </>
  );
}
