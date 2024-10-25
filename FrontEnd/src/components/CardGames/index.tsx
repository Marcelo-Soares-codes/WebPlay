import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";

interface CardGamesProps {
  img: string;
  title: string;
  description: string;
  link: string;
  status?: "normal" | "hot" | "coming-soon" | "disabled";
}

export const CardGames = ({
  img,
  title,
  description,
  link,
  status,
}: CardGamesProps) => {
  // Determina o estado do botão e do badge com base no status
  const isDisabled = status === "disabled";
  const isComingSoon = status === "coming-soon";
  const buttonText = isDisabled
    ? "Indisponível"
    : isComingSoon
      ? "Em Breve"
      : "Jogar";
  const buttonColor = isDisabled ? "default" : "primary";
  const buttonLink = isDisabled || isComingSoon ? undefined : link;

  return (
    <Card
      className={`${
        isDisabled
          ? "grayscale"
          : isComingSoon
            ? "border border-dashed border-yellow-500"
            : ""
      }`}
    >
      <CardBody>
        <div className="relative">
          <img alt={title} className="w-full h-auto" src={img} />
          {status === "hot" && (
            <span className="absolute left-2 top-2 bg-primary px-3 py-1 rounded-xl text-white">
              🔥Hot
            </span>
          )}
          {isComingSoon && (
            <span className="absolute left-2 top-2 bg-yellow-500 px-3 py-1 rounded-xl text-white">
              ⏳Em Breve
            </span>
          )}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-xl">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button
          as="a"
          className="text-white"
          color={buttonColor}
          disabled={isDisabled || isComingSoon}
          href={buttonLink}
          rel="noopener noreferrer"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
