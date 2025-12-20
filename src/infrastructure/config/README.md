# Configuración de Infraestructura

Este directorio contiene la configuración técnica que se comparte entre servicios de infraestructura (por ejemplo, clientes, variables de entorno y adapters).

## Supabase

### Variables de entorno requeridas

Define las credenciales en un archivo `.env` (o variables del entorno de ejecución) usando el prefijo `NEXT_PUBLIC_` para que Next.js pueda exponerlas en el cliente cuando sea necesario:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Cómo obtenerlas:** En el dashboard de Supabase ve a **Project Settings → API** y copia el **Project URL** y el **anon public API key**.

### Manejo de variables

`environment.ts` expone funciones para acceder a las variables y valida que existan:

```ts
import { getSupabaseUrl, getSupabaseAnonKey } from './environment';
```

Cada función lanza un error descriptivo si la variable no está definida, evitando inicializaciones inválidas en tiempo de ejecución.

### Cliente de Supabase (singleton)

`supabase.ts` crea y exporta una única instancia del cliente utilizando `@supabase/supabase-js`:

```ts
import { supabaseClient } from './supabase';
```

Este cliente debe consumirse únicamente desde servicios o repositorios de la capa de Infrastructure, manteniendo encapsulado el acceso a Supabase fuera de Domain y Presentation.
