import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";
import { getBearerToken } from "@/lib/getBearer";
import { jwtDecodeToken } from "@/lib/jwtDecode";
import NavBar from "./NavBar";

const Header = async () => {
  const bearerToken = await getBearerToken();
  const decodedToken = jwtDecodeToken(bearerToken);
  const isValid = decodedToken.valid && !decodedToken.expired;
  const userRole = isValid && decodedToken.payload ? decodedToken.payload?.role : null;
  return (
    <header className="flex justify-between items-center bg-primary p-3 sm:p-5 mb-5 z-50 sticky top-0 w-full shadow-md">
      <div className="flex items-center justify-start gap-6">
        <Link href="/">
          <h1 className="uppercase text-white font-bold text-3xl sm:text-4xl">eventos</h1>
        </Link>
        <NavBar bearerToken={bearerToken} isValid={isValid} userRole={userRole} />
      </div>
      <ThemeToggle />
    </header>
  );
}

export default Header;