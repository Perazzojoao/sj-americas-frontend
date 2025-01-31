import { LoginForm } from "@/components/LoginForm"

export default function Page() {
  return (
    <section className="flex min-h-96 w-full items-center justify-center p-3 md:p-10 mt-24">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </section>
  )
}
