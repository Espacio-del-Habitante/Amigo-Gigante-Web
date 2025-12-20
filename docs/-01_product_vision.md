# 🐾 Plataforma de Apadrinamiento, Adopción y Apoyo a Fundaciones Animales

## 1. Visión del producto

Construir una **plataforma web** que conecte **fundaciones animales** con **personas interesadas en ayudar**, facilitando la **visibilidad de animales**, la **adopción**, el **apadrinamiento**, y la **generación de ingresos** para las fundaciones mediante vitrinas de productos y eventos.

La plataforma busca:
- Humanizar la relación con los animales
- Aumentar la transparencia y confianza en las fundaciones
- Facilitar procesos que hoy son informales, dispersos o poco visibles
- Crear un vínculo emocional continuo entre personas y animales reales

---

## 2. Problema que resolvemos

Actualmente:
- Las fundaciones tienen baja visibilidad digital
- La adopción y el apadrinamiento se hacen por mensajes dispersos (WhatsApp, Instagram)
- No existe un seguimiento claro del estado del animal
- Las personas quieren ayudar, pero no saben **cómo**, **a quién**, ni **con qué impacto**

Esta plataforma centraliza y ordena esa relación.

---

## 3. Objetivo general

Crear un **ecosistema digital** donde:
- Las fundaciones puedan **publicar animales**, **productos** y **eventos**
- Los usuarios puedan **descubrir**, **conectar**, **adoptar** o **apadrinar**
- Se construya una relación de largo plazo con el animal (seguimiento, novedades)

---

## 4. Poblaciones objetivo (usuarios)

### 4.1 Administrador de la plataforma
**Perfil:**
- Equipo creador / gestor de la plataforma

**Objetivos:**
- Mantener calidad y confianza
- Validar fundaciones
- Moderar contenido

**Necesidades:**
- Control total del sistema
- Gestión de fundaciones y datos semilla
- Visibilidad completa de la plataforma

---

### 4.2 Usuario Fundación
**Perfil:**
- Miembros de fundaciones animales (una fundación puede tener varios usuarios)

**Objetivos:**
- Dar visibilidad a sus animales
- Promover adopciones y apadrinamientos
- Generar ingresos mediante productos y eventos

**Necesidades:**
- Publicar y administrar animales
- Gestionar su vitrina (productos/eventos)
- En etapas futuras: gestionar solicitudes y seguimiento

---

### 4.3 Usuario Externo (Adoptante / Padrino)
**Perfil:**
- Personas interesadas en ayudar animales
- No pertenecen a ninguna fundación

**Objetivos:**
- Conocer animales disponibles
- Contactar fundaciones
- Adoptar o apadrinar
- Sentir vínculo emocional y seguimiento real

**Necesidades:**
- Navegación clara y emocional
- Información confiable
- Procesos simples y guiados

---

## 5. Alcance funcional por etapas

### 5.1 Etapa 1 – MVP inicial

**Usuarios incluidos:**
- Administrador
- Fundación
- Usuario externo

**Funcionalidades:**
- Autenticación (login/registro)
- Gestión de roles
- Catálogo público de animales
- Detalle del animal
- Modal de contacto con la fundación
- Vitrina por fundación:
  - Productos
  - Eventos
- Panel básico para fundaciones (CRUD de contenido)
- Datos de contacto de fundación administrados por el admin (seed)

**Fuera de alcance:**
- Formularios de adopción
- Apadrinamiento
- Pagos
- Seguimiento del animal
- Inteligencia Artificial

---

### 5.2 Etapa 2 – Adopción
- Formulario de adopción
- Subida de documentos
- Estados de solicitud
- Panel de gestión para fundaciones

---

### 5.3 Etapa 3 – Apadrinamiento
- Formulario de apadrinamiento
- Monto y periodicidad
- Asociación de cuenta bancaria
- Historial de aportes

---

### 5.4 Etapa 4 – Seguimiento del animal
- Estado del animal
- Exámenes médicos
- Novedades tipo feed
- Acceso controlado (padrinos/adoptantes)

---

### 5.5 Etapa 5 – Módulo IA
- Asistente conversacional
- Recomendación de animal o especie ideal
- Basado en perfil del usuario y catálogo real

---

## 6. Principios de diseño (UI/UX)

- Diseño **simple**, **amigable** y **emocional**
- Colores:
  - Azul cielo y blanco como base
  - Color acento: `rgb(45, 235, 237)`
- Uso intensivo de:
  - Cards
  - Imágenes grandes
  - Microcopy empático
- Experiencia divertida y cercana (no corporativa)
- Inspiración: “tamagotchi emocional” pero con animales reales

---

## 7. Arquitectura conceptual

- **Frontend:** Web app moderna (SPA)
- **Backend:** Supabase
  - Auth (usuarios y roles)
  - Base de datos PostgreSQL
  - RLS para control de acceso
- **Escalable por módulos**
- Preparado desde el inicio para crecimiento por etapas

---

## 8. Entidades principales del dominio

- Usuarios (profiles)
- Fundaciones
- Miembros de fundación
- Animales
- Fotos de animales
- Productos
- Eventos
- Contactos de fundación

*(El modelo de datos se define en un documento técnico separado)*

---

## 9. Métricas de éxito (a futuro)

- Número de fundaciones activas
- Animales publicados
- Interacciones por animal
- Solicitudes de adopción
- Apadrinamientos activos
- Retención de usuarios externos

---

## 10. Visión a largo plazo

Convertirse en una **plataforma de referencia** para:
- Adopción responsable
- Apadrinamiento transparente
- Sostenibilidad financiera de fundaciones
- Relación emocional real entre personas y animales

---
