#!/usr/bin/env node
/**
 * Worker local que escucha instrucciones de agentes web
 * 
 * Los agentes web escriben instrucciones en agent_queue.json
 * Este worker las lee y ejecuta automáticamente
 * 
 * Uso:
 *   node scripts/agent_worker.mjs  # Corre en background
 *   # O como servicio: pm2 start scripts/agent_worker.mjs
 */

import { readFileSync, writeFileSync, watchFile } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

const QUEUE_FILE = 'agent_queue.json';
const LOG_FILE = 'agent_worker.log';

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  try {
    const currentLog = readFileSync(LOG_FILE, 'utf-8').catch(() => '');
    writeFileSync(LOG_FILE, currentLog + logMessage, 'utf-8');
  } catch (e) {
    // Ignora errores de log
  }
};

const processQueue = async () => {
  try {
    if (!fsExistsSync(QUEUE_FILE)) {
      writeFileSync(QUEUE_FILE, JSON.stringify([], null, 2));
      return;
    }

    const queue = JSON.parse(readFileSync(QUEUE_FILE, 'utf-8'));
    
    if (queue.length === 0) {
      return; // No hay trabajo
    }

    const task = queue[0];
    log(`🔄 Procesando tarea: ${task.type} - ${task.id}`);

    let result = null;

    switch (task.type) {
      case 'create_hu':
        result = await executeCommand([
          'node',
          'scripts/clickup/flow.mjs',
          '--title',
          task.title,
          '--body-file',
          task.bodyFile
        ]);
        if (result.success) {
          log(`✅ HU creada en ClickUp: ${result.taskId}`);
        }
        break;

      case 'update_status':
        result = await executeCommand([
          'node',
          'scripts/clickup/update_status.mjs',
          task.taskId,
          task.status
        ]);
        if (result.success) {
          log(`✅ Estado actualizado: ${task.taskId} → ${task.status}`);
        }
        break;

      case 'finish_task':
        result = await executeCommand([
          'node',
          'scripts/clickup/update_status.mjs',
          task.taskId,
          '--done'
        ]);
        if (result.success) {
          log(`✅ Tarea finalizada: ${task.taskId}`);
        }
        break;

      default:
        log(`⚠️ Tipo de tarea desconocido: ${task.type}`);
        result = { success: false, error: 'Unknown task type' };
    }

    // Marcar tarea como completada
    queue.shift();
    if (result && result.data) {
      queue.push({ ...task, completed: true, result: result.data });
    }
    writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    
    log(`✅ Tarea procesada: ${task.id}`);

  } catch (error) {
    log(`❌ Error procesando cola: ${error.message}`);
  }
};

const executeCommand = (args) => {
  return new Promise((resolve) => {
    const child = spawn(args[0], args.slice(1), {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const success = code === 0;
      const output = stdout + stderr;
      
      // Intentar extraer TASK_ID del output
      const taskIdMatch = output.match(/TASK_ID:\s*(\w+)/i) || output.match(/id:\s*['"]([\w-]+)['"]/);
      const urlMatch = output.match(/URL:\s*(https?:\/\/[^\s]+)/i) || output.match(/url:\s*['"](https?:\/\/[^'"]+)['"]/);
      
      resolve({
        success,
        code,
        output,
        data: {
          taskId: taskIdMatch?.[1],
          url: urlMatch?.[1],
          raw: output
        }
      });
    });
  });
};

import { existsSync as fsExistsSync } from 'node:fs';

// Watch el archivo de cola
log('🚀 Worker iniciado. Escuchando en agent_queue.json...');

watchFile(QUEUE_FILE, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime > prev.mtime) {
    log('📝 Cambio detectado en la cola');
    processQueue();
  }
});

// Procesar inmediatamente si hay trabajo
processQueue();

// Mantener el proceso vivo
process.on('SIGINT', () => {
  log('🛑 Worker detenido');
  process.exit(0);
});

