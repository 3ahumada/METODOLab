# Seguridad y verificaciones

## Reglas obligatorias
- Denegar acceso a información privada por defecto; cada tabla con datos personales debe tener RLS.
- Definir roles en tablas de autorización controladas por servidor, no en datos modificables por estudiantes.
- Nunca insertar `service_role` ni claves del proveedor de IA en variables `VITE_` ni en Git.
- Validar pertenencia del estudiante al grupo, titularidad del proyecto y permisos docentes en cada operación.
- Las calificaciones las escribe únicamente personal autorizado.
- No habilitar despliegue con usuarios reales hasta que las pruebas de aislamiento por rol pasen.
- Mantener política de privacidad y consentimiento adecuados a la institución.

## Pruebas pendientes
- Estudiante A no ve proyectos de B.
- Estudiante no cambia su rol ni calificaciones.
- Docente solo ve los grupos asignados.
- Usuario no autenticado no lee datos privados.
- El cambio de dominio conserva verificaciones tras reconfiguración OAuth.
