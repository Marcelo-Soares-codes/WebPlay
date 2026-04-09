import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

interface CardGamesProps {
  image: string;
  title: string;
  description: string;
  href: string;
  status?: "normal" | "hot" | "coming-soon" | "disabled";
}

export const CardGames = ({
  image,
  title,
  description,
  href,
  status,
}: CardGamesProps) => {
  const isDisabled = status === "disabled";
  const isComingSoon = status === "coming-soon";
  const isPlayable = !isDisabled && !isComingSoon;
  const buttonText = isDisabled
    ? "Indisponivel"
    : isComingSoon
      ? "Em breve"
      : "Jogar";
  const buttonColor = isDisabled ? "default" : "primary";

  return (
    <Card
      className={`${
        isDisabled
          ? "cursor-not-allowed grayscale"
          : isComingSoon
            ? "cursor-not-allowed border border-dashed border-yellow-500"
            : "cursor-pointer hover:scale-[1.01] hover:shadow-lg active:scale-95"
      }`}
    >
      <CardBody>
        <div className="relative aspect-[4/3]">
          <Image
            fill
            alt={title}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            src={image}
          />
          {status === "hot" && (
            <span className="absolute left-2 top-2 rounded-xl bg-primary px-3 py-1 text-white">
              Hot
            </span>
          )}
          {isComingSoon && (
            <span className="absolute left-2 top-2 rounded-xl bg-yellow-500 px-3 py-1 text-white">
              Em breve
            </span>
          )}
        </div>
        <div className="mt-4">
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button
          as={isPlayable ? Link : "button"}
          className="text-white"
          color={buttonColor}
          disabled={!isPlayable}
          href={isPlayable ? href : undefined}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
