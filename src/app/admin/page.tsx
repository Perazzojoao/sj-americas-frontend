import { LoginForm } from "@/components/login-form";

const Admin = () => {
  return (
    <section className="flex min-h-96 w-full items-center justify-center p-6 md:p-10 mt-24">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </section>
  );
}

export default Admin;