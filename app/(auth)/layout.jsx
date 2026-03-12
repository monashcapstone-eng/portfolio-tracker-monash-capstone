import PublicNavbar from "@/components/marketing/PublicNavbar";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_24%)]" />
      <PublicNavbar />
      <main className="relative">{children}</main>
    </div>
  );
}
