import { ContainerModule } from "inversify";

const repositoriesModule = new ContainerModule(() => {
  // Los repositorios se registrarán aquí conforme avancen las HUs correspondientes.
});

export { repositoriesModule };

