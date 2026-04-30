package com.brusben.dto;

import java.util.List;

public class ModuloDTO {
    private Integer idModulo;
    private Integer idCurso;
    private String nombreModulo;
    private String nombre;
    private Integer orden;
    private List<MaterialDTO> materiales;

    public ModuloDTO() {}

    public Integer getIdModulo() { return idModulo; }
    public void setIdModulo(Integer idModulo) { this.idModulo = idModulo; }

    public Integer getIdCurso() { return idCurso; }
    public void setIdCurso(Integer idCurso) { this.idCurso = idCurso; }

    public String getNombreModulo() { return nombreModulo; }
    public void setNombreModulo(String nombreModulo) { this.nombreModulo = nombreModulo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public List<MaterialDTO> getMateriales() { return materiales; }
    public void setMateriales(List<MaterialDTO> materiales) { this.materiales = materiales; }
}