import { appContainer } from "../container";
import { SERVICE_TYPES } from "../services/services.types";
import { ExampleService } from "../../services/ExampleService";

const exampleService = appContainer.get<ExampleService>(
  SERVICE_TYPES.ExampleService,
);

// Este script actúa como una prueba de humo básica del contenedor IoC.
// Ejecutar el comando indicado en la documentación para validar la resolución.
console.log(exampleService.getGreeting());

