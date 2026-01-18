import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "../ui/separator"
import NavItems from "./NavItems"

const MobileNav = () => {
  return (
    <nav className="md:hidden">
        <Sheet>
  <SheetTrigger className="align-middle">
    <Image
      src="/assets/icons/menu.svg"
      alt="Menu"
      width={30}
      height={30}
      className="cursor-pointer"
    />
    </SheetTrigger>
  <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
     <SheetTitle className="sr-only">Are you absolutely sure?</SheetTitle>
   <h1 className="text-2xl p-2">Happening</h1>
   <Separator className="border border-gray-50" />
   <NavItems />
  </SheetContent>
</Sheet>
    </nav>
  )
}

export default MobileNav