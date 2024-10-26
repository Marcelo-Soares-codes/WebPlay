import {
  Button,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { TemplateAuth } from "@/components/TemplateAuth";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleModeSelection = (mode: string) => {
    navigate("/tic-tac-toe/" + mode);
  };

  const handleAIModeSelection = (difficulty: string) => {
    onClose();
    navigate(`/tic-tac-toe/ai?difficulty=${difficulty}`);
  };

  return (
    <TemplateAuth>
      <div className="flex flex-col justify-center items-center h-full">
        <Card>
          <CardBody className="space-y-4 p-8">
            <h1 className="text-2xl mb-4 text-zinc-800 font-semibold">
              Selecione o Modo de Jogo
            </h1>
            <Button
              className="text-white font-semibold"
              color="primary"
              onClick={() => handleModeSelection("local")}
            >
              Jogar local 1v1
            </Button>
            <Popover isOpen={isOpen} onOpenChange={onOpenChange}>
              <PopoverTrigger>
                <Button
                  className="text-white font-semibold"
                  color="primary"
                  onClick={onOpen}
                >
                  Jogar contra máquina
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 space-y-4">
                <h4 className="font-semibold text-lg text-zinc-800">
                  Selecione a dificuldade!
                </h4>
                <div className="flex space-x-4">
                  <Button
                    className="text-white font-semibold"
                    color="success"
                    onClick={() => handleAIModeSelection("easy")}
                  >
                    Fácil
                  </Button>
                  <Button
                    className="text-white font-semibold"
                    color="warning"
                    onClick={() => handleAIModeSelection("medium")}
                  >
                    Médio
                  </Button>
                  <Button
                    className="text-white font-semibold"
                    color="danger"
                    onClick={() => handleAIModeSelection("hard")}
                  >
                    Difícil
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              className="text-white font-semibold"
              color="primary"
              onClick={() => handleModeSelection("multiplayer")}
            >
              Jogar multiplayer
            </Button>
          </CardBody>
        </Card>
      </div>
    </TemplateAuth>
  );
};

export default Home;
