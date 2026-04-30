package com.brusben.dto;

public class MaterialDTO {
    private Integer idMaterial;
    private Integer idModulo;
    private String titulo;
    private String tipoMaterial; 
    private String tipoArchivo;
    private String urlMaterial;
    private String urlRecurso;
    private String matEstado;

    public MaterialDTO() {}

    public Integer getIdMaterial() { return idMaterial; }
    public void setIdMaterial(Integer idMaterial) { this.idMaterial = idMaterial; }

    public Integer getIdModulo() { return idModulo; }
    public void setIdModulo(Integer idModulo) { this.idModulo = idModulo; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipoMaterial() { return tipoMaterial; }
    public void setTipoMaterial(String tipoMaterial) { this.tipoMaterial = tipoMaterial; }

    public String getTipoArchivo() { return tipoArchivo; }
    public void setTipoArchivo(String tipoArchivo) { this.tipoArchivo = tipoArchivo; }

    public String getUrlMaterial() { return urlMaterial; }
    public void setUrlMaterial(String urlMaterial) { this.urlMaterial = urlMaterial; }

    public String getUrlRecurso() { return urlRecurso; }
    public void setUrlRecurso(String urlRecurso) { this.urlRecurso = urlRecurso; }

    public String getMatEstado() { return matEstado; }
    public void setMatEstado(String matEstado) { this.matEstado = matEstado; }
}