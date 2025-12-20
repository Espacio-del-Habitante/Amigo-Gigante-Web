import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import { ExampleService } from "../../services/ExampleService";
import { SERVICE_TYPES } from "./services.types";

const servicesModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<ExampleService>(SERVICE_TYPES.ExampleService)
      .to(ExampleService)
      .inSingletonScope();
  },
);

export { servicesModule };
