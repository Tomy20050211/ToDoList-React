# ToDoList-React

Aplicación web tipo **ToDo List** hecha con **React + TypeScript** y empaquetada con **Vite**. Permite crear tareas, cambiar su estado, iniciar/detener un temporizador por tarea y persistir todo en `localStorage`.

## Tecnologías

- React (UI)
- TypeScript (tipado)
- Vite (dev server + build)
- ESLint (linting)

El código de la app está en `todolist/`.

## Cómo se construyó (arquitectura)

- **UI principal**: `todolist/src/App.tsx` renderiza el formulario, contadores y la lista de tareas.
- **Lógica de negocio / estado**: `todolist/src/hooks/taskState.ts` expone el hook `useTask()` con todas las acciones.
- **Persistencia**: `todolist/src/hooks/useLocalStorage.ts` implementa `useLocalStorageState()` para guardar/leer el estado desde `localStorage`.
- **Componente reutilizable**: `todolist/src/components/ui/ControllerInput.tsx` maneja el input y el submit para crear tareas.
- **Tipos**: `todolist/src/types/state.ts` y `todolist/src/types/tasks.ts` definen los tipos de estado y de tareas.

## Funcionalidades más importantes

### 1) CRUD básico de tareas

- **Agregar tarea**: desde `App.tsx` se llama `addTask(title)`.
  - Genera un `id` con `crypto.randomUUID()`.
  - La crea en estado **in-progress** y la deja corriendo (`isRunning: true`).
  - Marca `isNew` para animación inicial y luego lo apaga con `setTimeout`.
- **Eliminar tarea**: `removeTask(id)` aplica una marca `isDeleting` para animación y luego elimina con `setTimeout`.

### 2) Estados de una tarea

Cada tarea usa `TaskStatus` con 3 valores:

- `pending`
- `in-progress`
- `done`

Desde la UI, el `<select>` de `App.tsx` dispara `setStatus(id, status)` para cambiar el estado.

### 3) Temporizador por tarea (start/stop + acumulado)

En `useTask()`:

- **Tick global**: un `setInterval` (cada 1s) incrementa `elapsedSeconds` solo en las tareas con `isRunning: true`.
- **Iniciar**: `startTask(id)` fuerza `status: "in-progress"` y `isRunning: true` (si no está eliminándose ni está en `done`).
- **Detener**: `stopTask(id)` pone `isRunning: false`.
- Al marcar una tarea como `done`, `setStatus()` también corta el contador (`isRunning: false`).

En `App.tsx` se formatea el tiempo con `formatSeconds(totalSeconds)` para mostrar `min:seg`.

### 4) Persistencia en Local Storage

`useLocalStorageState(key, initialValue)`:

- Lee el valor inicial desde `localStorage` (si existe) y hace `JSON.parse` seguro.
- Cada cambio de estado se serializa y se guarda automáticamente con un `useEffect`.

La clave usada por la app es `todolist.tasks`.

### 5) Contadores en tiempo real

`App.tsx` calcula `pending / in-progress / done` con `useMemo()` a partir del arreglo `task`.

## Scripts (cómo correrla)

Desde la carpeta `todolist/`:

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```
