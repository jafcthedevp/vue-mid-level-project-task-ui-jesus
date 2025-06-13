# vue-mid-level-project-task-ui

SPA para gestión de proyectos y tareas con Vue 3, Pinia, Vite, TailwindCSS y consumo de API REST.

## 🚀 Instalación

```bash
npm install
```

## ▶️ Levantar el proyecto

```bash
npm run dev
```

Abre en tu navegador la URL que aparece en consola (por defecto http://localhost:5173).

## 🧪 Probar filtros y formularios

- Ve a la ruta `/projects` para ver, filtrar, crear, editar y eliminar proyectos.
- Ve a la ruta `/tasks` para ver, filtrar, crear, editar y eliminar tareas.
- Usa los campos de filtro (nombre, estado, prioridad) para ver resultados dinámicos.
- Haz clic en "Nuevo Proyecto" o "Nueva Tarea" para abrir los formularios.
- Los formularios validan campos requeridos y muestran mensajes de error.
- Si ocurre un error de red, se muestra un mensaje amigable.

## 📦 Estructura principal

- `src/views/ProjectList.vue`: Vista de proyectos
- `src/views/TaskList.vue`: Vista de tareas
- `src/components/Table.vue`: Tabla reutilizable
- `src/components/ProjectForm.vue`: Formulario de proyecto
- `src/components/TaskForm.vue`: Formulario de tarea
- `src/store/`: Pinia stores
- `src/router/index.js`: Rutas

## 📡 API usada
- https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects
- https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks

## 💡 Notas
- Diseño responsivo con TailwindCSS.
- Puedes agregar capturas de pantalla en este README si lo deseas.
- No se usan frameworks UI externos.

---

¡Listo para entregar y subir a tu repositorio público!
