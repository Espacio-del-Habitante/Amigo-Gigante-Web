import "reflect-metadata";

import { Container } from "inversify";

import { repositoriesModule } from "./repositories/repositories.container";
import { servicesModule } from "./services/services.container";
import { useCaseModules } from "./usecases/usecases.container";

const appContainer = new Container();

appContainer.loadSync(servicesModule);
appContainer.loadSync(repositoriesModule);
appContainer.loadSync(...useCaseModules);

export { appContainer };
