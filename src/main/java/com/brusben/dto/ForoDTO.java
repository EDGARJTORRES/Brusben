package com.brusben.dto;

import java.time.LocalDateTime;

public class ForoDTO {
    private Integer idForo;
    private String titulo;
    private String temaDiscusion;
    private String descripcion;
    private String estado;
    private LocalDateTime fechaCreacion;

    public ForoDTO() {}

    public Integer getIdForo() { return idForo; }
    public void setIdForo(Integer idForo) { this.idForo = idForo; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTemaDiscusion() { return temaDiscusion; }
    public void setTemaDiscusion(String temaDiscusion) { this.temaDiscusion = temaDiscusion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
