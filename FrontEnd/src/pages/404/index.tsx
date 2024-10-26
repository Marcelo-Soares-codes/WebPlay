import { Button } from "@nextui-org/button";

const NotFound = () => {
  return (
    <main className="w-full min-h-screen bg-gray-50 flex flex-col justify-center items-center space-y-8">
      <img alt="Logo" className="w-32 h-32" src="/logo.png" />
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold text-primary">
          <span className="text-5xl">404</span>{" "}
          <span className="text-zinc-800 text-sm">Página não encontrada</span>
        </h1>
        <p className="text-sm text-gray-600 max-w-sm text-center">
          A página que você está procurando não existe. Verifique se a URL está
          correta e tente novamente.
        </p>
      </div>
      <Button
        as={"a"}
        className="text-white font-semibold"
        color="primary"
        href="/"
      >
        Voltar para o início
      </Button>
    </main>
  );
};

export default NotFound;
