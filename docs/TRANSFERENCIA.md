# Protocolo de transferencia a Eduardo

**Nunca asumir que transferir el repositorio transfiere sus servicios externos.**

## Inventario previo
- [ ] Confirmar responsable y propietarios de GitHub, Supabase, hosting y proveedor de IA.
- [ ] Registrar dominio, URLs OAuth autorizadas y URLs de retorno.
- [ ] Registrar proveedores de autenticación, requisitos de confirmación de correo y MFA administrativa.
- [ ] Exportar esquema, migraciones, políticas RLS, funciones, triggers y configuración de almacenamiento.
- [ ] Respaldar datos con procedimiento cifrado y autorización institucional; nunca subir respaldos con datos personales a Git.
- [ ] Registrar variables de entorno **solo por nombre**, jamás sus valores secretos.
- [ ] Registrar planes de servicio, facturación y responsables.

## Transferencia y aceptación
1. Crear entorno de destino bajo control del nuevo responsable.
2. Aplicar todas las migraciones SQL en orden.
3. Configurar OAuth y redirecciones para el nuevo dominio/proyecto.
4. Aprovisionar secretos en el hosting o servidor; rotar secretos compartidos anteriormente.
5. Restaurar datos mediante canal seguro, si la institución lo autoriza.
6. Probar cuentas reales de prueba: estudiante, docente y administrador.
7. Comprobar que un estudiante **no** puede leer proyectos de otro ni editar calificaciones.
8. Comprobar verificación de correo, recuperación de cuenta y caducidad de sesión.
9. Comprobar tutor IA desde el servidor sin exponer claves en el navegador.
10. Documentar evidencia de pruebas y aprobación de ambas partes antes de desconectar el entorno anterior.

**Estado actual:** infraestructura no configurada; verificaciones aún no implementadas.
