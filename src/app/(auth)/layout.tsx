export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-authBackground">
      <main>{children}</main>
    </div>
  )
}
