package com.brusben.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

public class CursoDTO {

    private Integer idCurso;
    private Integer idDocente;
    private String docenteNombre;  // Para mostrar en el select
    private String titulo;
    private String descripcion;
    private LocalDate fechaRegistro;
    private Integer catId;
    private String catNombre;      // Para mostrar en el select
    private String catColor;
    private String imgCurso;
    private String estCurso;
    private BigDecimal precioCurso;

    public CursoDTO() {}

    public CursoDTO(Integer idCurso, Integer idDocente, String docenteNombre,
                    String titulo, String descripcion, LocalDate fechaRegistro,
                    Integer catId, String catNombre, String catColor,
                    String imgCurso, String estCurso, BigDecimal precioCurso) {
        this.idCurso = idCurso;
        this.idDocente = idDocente;
        this.docenteNombre = docenteNombre;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaRegistro = fechaRegistro;
        this.catId = catId;
        this.catNombre = catNombre;
        this.catColor = catColor;
        this.imgCurso = imgCurso;
        this.estCurso = estCurso;
        this.precioCurso = precioCurso;
    }

    public Integer getIdCurso() { return idCurso; }
    public void setIdCurso(Integer idCurso) { this.idCurso = idCurso; }

    public Integer getIdDocente() { return idDocente; }
    public void setIdDocente(Integer idDocente) { this.idDocente = idDocente; }

    public String getDocenteNombre() { return docenteNombre; }
    public void setDocenteNombre(String docenteNombre) { this.docenteNombre = docenteNombre; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public Integer getCatId() { return catId; }
    public void setCatId(Integer catId) { this.catId = catId; }

    public String getCatNombre() { return catNombre; }
    public void setCatNombre(String catNombre) { this.catNombre = catNombre; }

    public String getCatColor() { return catColor; }
    public void setCatColor(String catColor) { this.catColor = catColor; }

    public String getImgCurso() { return imgCurso; }
    public void setImgCurso(String imgCurso) { this.imgCurso = imgCurso; }

    public String getEstCurso() { return estCurso; }
    public void setEstCurso(String estCurso) { this.estCurso = estCurso; }

    public BigDecimal getPrecioCurso() { return precioCurso; }
    public void setPrecioCurso(BigDecimal precioCurso) { this.precioCurso = precioCurso; }
}
