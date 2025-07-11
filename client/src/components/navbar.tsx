import Modal from "./modal";

export default function Navbar() {
  return (
    <header className="h-[10vh] bg-white shadow sticky top-0">
      <nav className="flex px-4 h-full items-center justify-between max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-bold text-blue-500">Listly</h1>
        </div>

        <div>
          <Modal />
        </div>
      </nav>
    </header>
  );
}
