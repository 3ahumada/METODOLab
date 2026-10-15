# METODOLab

Plataforma de aprendizaje aplicado para la materia **Metodología Aplicada a la Gestión de las Tecnologías de la Información y la Comunicación** (MGTIC, UABC, clave 4046).

## Objetivo
Aprender metodología de investigación mediante casos, ejercicios, construcción progresiva de anteproyectos, tutoría asistida y seguimiento docente.

## Estado
Arquitectura inicial. **Sin autenticación, IA ni almacenamiento de estudiantes implementados todavía.** No ingresar datos personales reales hasta validar la seguridad y el despliegue.

## Módulos curriculares
1. Origen de las investigaciones: tema, problema y pertinencia.
2. Tipos de investigación: alcances, variables e hipótesis.
3. Estructura de un anteproyecto: apartados y fuentes.
4. Esquema general del trabajo terminal: redacción, formato y edición.

## Arquitectura prevista
- React + TypeScript + Vite para la interfaz.
- Supabase para autenticación, Postgres y políticas RLS.
- Tutor de IA mediante endpoint de servidor: jamás exponer claves de proveedor en el navegador.
- Migraciones SQL y pruebas automatizadas de autorización.

Ver `docs/TRANSFERENCIA.md` y `docs/SEGURIDAD.md` antes de configurar servicios externos.

## Descargar avances en PDF
- El botón **Descargar avances PDF**, en la barra principal de todas las vistas, descarga el contenido actual del navegador: fecha, resumen del progreso, apartados del anteproyecto y ejercicios organizados por unidad.
- El informe incluye los apartados y ejercicios pendientes y puede descargarse aunque el trabajo esté incompleto. Los conteos muestran contenido registrado, no una evaluación académica.
- En **Mi anteproyecto**, **Descargar anteproyecto PDF** conserva una exportación enfocada en los apartados redactados y las respuestas registradas.
- La generación ocurre en el navegador, sin enviar las respuestas a servicios externos. El PDF sirve para lectura y entrega; la copia JSON sigue siendo el respaldo que permite reimportar y continuar trabajando.

## Verificación local
```sh
npm install
npm test
npm run build
```
