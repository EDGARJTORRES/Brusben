package com.brusben.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cursos", schema = "sc_sistema")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Integer idCurso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_docente", nullable = false)
    private Usuario docente;

    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_registro")
    private java.time.LocalDate fechaRegistro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cat_id")
    private Categoria categoria;

    @Column(name = "img_curso", length = 500)
    private String imgCurso;

    @Column(name = "est_curso", length = 10)
    private String estCurso = "A";

    @Column(name = "precio_curso", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioCurso;

    public Curso() {}

    public Integer getIdCurso() { return idCurso; }
    public void setIdCurso(Integer idCurso) { this.idCurso = idCurso; }

    public Usuario getDocente() { return docente; }
    public void setDocente(Usuario docente) { this.docente = docente; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public java.time.LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(java.time.LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getImgCurso() { return imgCurso; }
    public void setImgCurso(String imgCurso) { this.imgCurso = imgCurso; }

    public String getEstCurso() { return estCurso; }
    public void setEstCurso(String estCurso) { this.estCurso = estCurso; }

    public BigDecimal getPrecioCurso() { return precioCurso; }
    public void setPrecioCurso(BigDecimal precioCurso) { this.precioCurso = precioCurso; }
}
