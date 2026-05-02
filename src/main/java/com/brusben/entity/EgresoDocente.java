package com.brusben.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "egresos_docentes", schema = "sc_sistema")
public class EgresoDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_egreso")
    private Integer idEgreso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_docente", nullable = false)
    private Usuario docente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @Column(name = "monto", nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "concepto", length = 500)
    private String concepto;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @Column(name = "nro_operacion", length = 100)
    private String nroOperacion;

    @Column(name = "fecha_egreso")
    private LocalDateTime fechaEgreso;

    @Column(name = "estado", length = 20)
    private String estado = "PAGADO";

    public EgresoDocente() {}

    public Integer getIdEgreso() { return idEgreso; }
    public void setIdEgreso(Integer idEgreso) { this.idEgreso = idEgreso; }

    public Usuario getDocente() { return docente; }
    public void setDocente(Usuario docente) { this.docente = docente; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public String getNroOperacion() { return nroOperacion; }
    public void setNroOperacion(String nroOperacion) { this.nroOperacion = nroOperacion; }

    public LocalDateTime getFechaEgreso() { return fechaEgreso; }
    public void setFechaEgreso(LocalDateTime fechaEgreso) { this.fechaEgreso = fechaEgreso; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
