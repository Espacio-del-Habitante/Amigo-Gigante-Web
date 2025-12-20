import { ContainerModule } from "inversify";

const useCasesModule = new ContainerModule(() => {
  // Los casos de uso se registrarán aquí conforme avancen las HUs correspondientes.
});

const useCaseModules = [useCasesModule];

export { useCaseModules, useCasesModule };

