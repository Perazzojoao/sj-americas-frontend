import Link from "next/link";

type NavBarProps = {
  isValid: boolean;
  bearerToken: string;
  userRole: string | null;
}

const NavBar = async ({ bearerToken, isValid, userRole }: NavBarProps) => {
  return (
    <>
      {isValid && bearerToken && userRole !== "USER" && (
        <div className="flex items-start justify-center gap-3 text-white font-semibold transition-colors">
          <Link href="/" className="hover:text-background hover:underline">
            <span>Home</span>
          </Link>
          <Link href="/admin" className="hover:text-background hover:underline">
            <span>Admin</span>
          </Link>
        </div>
      )}
    </>
  );
}

export default NavBar;