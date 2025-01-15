import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-start items-center bg-secondary p-3 sm:p-5 mb-5 z-50 sticky top-0 w-full shadow-md">
      <Link href="/">
        <h1 className="uppercase text-background font-bold text-3xl sm:text-4xl">eventos</h1>
      </Link>
    </header>
  );
}

export default Header;