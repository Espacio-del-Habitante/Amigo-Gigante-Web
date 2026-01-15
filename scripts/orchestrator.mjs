#!/usr/bin/env node
/**
 * Orquestador local para flujo de HUs
 * 
 * Maneja todo el proceso de creación e implementación de HUs,
 * manteniendo contexto compartido y actualizando ClickUp automáticamente.
 * 
 * Uso:
 *   node scripts/orchestrator.mjs create "Título de la HU"
 *   node scripts/orchestrator.mjs implement HU-038 86aejm1tv
 */

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const USAGE = `
Uso:
  node scripts/orchestrator.mjs <comando> [argumentos]

Comandos:
  create <título>           - Crea una nueva HU (genera contenido base)
  implement <HU-ID> <TASK_ID> - Marca tarea como "En curso" y prepara para implementación
  finish <TASK_ID>          - Marca tarea como "Finalizado"
  status <TASK_ID>          - Muestra estado actual de la tarea

Ejemplos:
  node scripts/orchestrator.mjs create "Modo dark en la web"
  node scripts/orchestrator.mjs implement HU-038 86aejm1tv
  node scripts/orchestrator.mjs finish 86aejm1tv
`;

const commands = {
  create: async (title) => {
    console.log(`📝 Creando HU: ${title}`);
    
    // Generar número de HU
    const huFiles = [];
    for (let i = 1; i < 1000; i++) {
      const num = i.toString().padStart(3, '0');
      if (existsSync(`HUs/HU-${num}.md`)) {
        huFiles.push(parseInt(num));
      }
    }
    const nextHU = Math.max(0, ...huFiles) + 1;
    const huId = `HU-${nextHU.toString().padStart(3, '0')}`;
    const huPath = `HUs/${huId}.md`;
    
    console.log(`   ID generado: ${huId}`);
    console.log(`   Archivo: ${huPath}`);
    
    // Leer template
    const template = readFileSync('HUs/_TEMPLATE.md', 'utf-8');
    
    // Generar contenido base (esto se puede mejorar con IA local)
    const content = template
      .replace(/HU-XXX/g, huId)
      .replace(/<Título>/g, title)
      .replace(/<tipo de usuario>/g, 'usuario')
      .replace(/<necesidad>/g, title.toLowerCase())
      .replace(/<beneficio>/g, 'mejorar la experiencia');
    
    writeFileSync(huPath, content);
    console.log(`✅ HU creada: ${huPath}`);
    console.log(`\n📌 Siguiente paso:`);
    console.log(`   1. Edita ${huPath} con los detalles completos`);
    console.log(`   2. Crea la tarea en ClickUp:`);
    console.log(`      node scripts/clickup/flow.mjs --title "${huId} — ${title}" --body-file "${huPath}"`);
    
    return { huId, huPath };
  },

  implement: async (huId, taskId) => {
    console.log(`🚀 Iniciando implementación: ${huId} (TASK_ID: ${taskId})`);
    
    const huPath = `HUs/${huId}.md`;
    if (!existsSync(huPath)) {
      console.error(`❌ No se encontró: ${huPath}`);
      process.exit(1);
    }
    
    // Marcar como "En curso"
    console.log(`   📌 Marcando tarea como "En curso"...`);
    const result = spawnSync(
      'node',
      ['scripts/clickup/update_status.mjs', taskId, '--in-progress'],
      { stdio: 'inherit' }
    );
    
    if (result.status !== 0) {
      console.error(`❌ Error al actualizar estado`);
      process.exit(1);
    }
    
    console.log(`\n✅ Tarea marcada como "En curso"`);
    console.log(`\n📌 Siguiente paso:`);
    console.log(`   Implementa la HU usando el agente con:`);
    console.log(`   - docs/99_prompt_codex.md`);
    console.log(`   - ${huPath}`);
    console.log(`   - TASK_ID: ${taskId}`);
    console.log(`\n   Cuando termines, ejecuta:`);
    console.log(`   node scripts/orchestrator.mjs finish ${taskId}`);
    
    return { huId, taskId, huPath };
  },

  finish: async (taskId) => {
    console.log(`✅ Finalizando tarea: ${taskId}`);
    
    const result = spawnSync(
      'node',
      ['scripts/clickup/update_status.mjs', taskId, '--done'],
      { stdio: 'inherit' }
    );
    
    if (result.status !== 0) {
      console.error(`❌ Error al finalizar tarea`);
      process.exit(1);
    }
    
    console.log(`\n✅ Tarea marcada como "Finalizado"`);
    return { taskId };
  },

  status: async (taskId) => {
    console.log(`📊 Estado de tarea: ${taskId}`);
    console.log(`   URL: https://app.clickup.com/t/${taskId}`);
    console.log(`\n   Para verificar el estado actual, visita la URL arriba.`);
  }
};

// Main
const [,, command, ...args] = process.argv;

if (!command || !commands[command]) {
  console.error(USAGE);
  process.exit(1);
}

commands[command](...args).catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

