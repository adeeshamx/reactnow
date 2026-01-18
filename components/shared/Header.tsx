import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "../ui/button"
import { User } from "lucide-react"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
        <div className="wrapper flex items-center justify-between">
            <Link className="w-36" href="/"><h1 className="text-2xl">Happening</h1></Link>

            <SignedIn>
              <nav className="invisible md:visible md:flex">
              <NavItems />
              </nav>
            </SignedIn>
        
        <div className="flex w-32 justify-end gap-3">
            <UserButton afterSignOutUrl="/" />
            
             <SignedOut>
              <Button asChild className="rounded-full" size="lg">
                <Link href="/sign-in">
                Login
                </Link>
              </Button>
             </SignedOut>
             <MobileNav />
        </div>
        </div>
    </header>
  )
}

export default Header