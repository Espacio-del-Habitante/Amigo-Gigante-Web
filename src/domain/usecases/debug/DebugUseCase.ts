import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";

class DebugUseCase {
  constructor(private readonly debugRepository: IDebugRepository) {}

  execute(): Promise<string> {
    return this.debugRepository.run();
  }
}

export { DebugUseCase };
