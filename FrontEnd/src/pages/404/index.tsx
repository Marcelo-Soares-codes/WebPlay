import { Button } from "@nextui-org/button";
import Image from "next/image";

const NotFound = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center space-y-8 bg-gray-50">
      <Image alt="Logo WebPlay" height={128} src="/logo.png" width={128} />
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold text-primary">
          <span className="text-5xl">404</span>{" "}
          <span className="text-sm text-zinc-800">Pagina nao encontrada</span>
        </h1>
        <p className="max-w-sm text-center text-sm text-gray-600">
          A pagina que voce esta procurando nao existe. Verifique se a URL esta
          correta e tente novamente.
        </p>
      </div>
      <Button
        as="a"
        className="font-semibold text-white"
        color="primary"
        href="/"
      >
        Voltar para o inicio
      </Button>
    </main>
  );
};

export default NotFound;
