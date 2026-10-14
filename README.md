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
