import Form from "./components/Form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="flex place-items-center mx-auto ">
        <div>
          <h1 className="text-center text-5xl py-5 font-medium">Archibot</h1>
          <p className=" text-center text-gray-400 pb-3">Resuelve tus dudas acerca de comandos y funcionalidades de softwares de Arquitectura</p>
          <div className="">
            <Form />

          </div>
        </div>
      </div>
    </main>
  );
}
