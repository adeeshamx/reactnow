import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
        <h1 className="text-2xl">Happening</h1>
        </Link>
        <p>2025 Happening. All Rights reserved.</p>
      </div>
    </footer>)
}

export default Footer