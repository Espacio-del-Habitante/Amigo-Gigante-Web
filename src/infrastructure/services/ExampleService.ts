import { injectable } from "inversify";

export interface IExampleService {
  getGreeting(): string;
}

@injectable()
export class ExampleService implements IExampleService {
  getGreeting(): string {
    return "Hello from the ExampleService";
  }
}

