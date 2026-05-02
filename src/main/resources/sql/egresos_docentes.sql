-- Tabla de egresos a docentes por creación de módulos
CREATE TABLE IF NOT EXISTS sc_sistema.egresos_docentes (
    id_egreso       SERIAL PRIMARY KEY,
    id_docente      INTEGER NOT NULL REFERENCES sc_sistema.usuarios(id_usuario),
    id_curso        INTEGER NOT NULL REFERENCES sc_sistema.cursos(id_curso),
    monto           NUMERIC(10, 2) NOT NULL,
    concepto        VARCHAR(500),
    metodo_pago     VARCHAR(50),
    nro_operacion   VARCHAR(100),
    fecha_egreso    TIMESTAMP DEFAULT NOW(),
    estado          VARCHAR(20) DEFAULT 'PAGADO'
);
