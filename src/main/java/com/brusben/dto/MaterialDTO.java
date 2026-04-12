package com.brusben.dto;

public class MaterialDTO {
    private Integer idMaterial;
    private String titulo;
    private String tipoMaterial;
    private String urlMaterial;

    public MaterialDTO() {}

    public Integer getIdMaterial() { return idMaterial; }
    public void setIdMaterial(Integer idMaterial) { this.idMaterial = idMaterial; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipoMaterial() { return tipoMaterial; }
    public void setTipoMaterial(String tipoMaterial) { this.tipoMaterial = tipoMaterial; }

    public String getUrlMaterial() { return urlMaterial; }
    public void setUrlMaterial(String urlMaterial) { this.urlMaterial = urlMaterial; }
}
