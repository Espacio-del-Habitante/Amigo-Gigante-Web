interface IDebugRepository {
  run(): Promise<string>;
}

export type { IDebugRepository };
