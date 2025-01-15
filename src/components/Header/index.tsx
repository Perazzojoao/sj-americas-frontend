import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-primary p-3 sm:p-5 mb-5 z-50 sticky top-0 w-full shadow-md">
      <Link href="/">
        <h1 className="uppercase text-white font-bold text-3xl sm:text-4xl">eventos</h1>
      </Link>
      <ThemeToggle />
    </header>
  );
}

export default Header;