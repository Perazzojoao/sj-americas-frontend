import Header from "@/components/Header";
import Events from "@/components/Events";

export default function Home() {
  return (
    <main>
      <Header></Header>
      <div className="px-3 sm:px-5 sm:w-4/5 mx-auto">
        <Events />
      </div>
    </main>
  );
}
