import { inject, injectable } from "inversify";

import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";
import type { IExampleService } from "@/infrastructure/services/ExampleService";

@injectable()
class DebugRepository implements IDebugRepository {
  constructor(
    @inject(SERVICE_TYPES.ExampleService)
    private readonly exampleService: IExampleService,
  ) {}

  async run(): Promise<string> {
    const greeting = this.exampleService.getGreeting();
    const timestamp = new Date().toISOString();

    return `${greeting} | ${timestamp}`;
  }
}

export { DebugRepository };
