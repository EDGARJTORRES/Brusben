package com.brusben.dto;

public class CategoriaDTO {

    private Integer catId;
    private String catNombre;
    private String catDescripcion;
    private String catColor;
    private String catEstado;

    public CategoriaDTO() {}

    public CategoriaDTO(Integer catId, String catNombre, String catDescripcion, String catColor, String catEstado) {
        this.catId = catId;
        this.catNombre = catNombre;
        this.catDescripcion = catDescripcion;
        this.catColor = catColor;
        this.catEstado = catEstado;
    }

    public CategoriaDTO(String catNombre, String catDescripcion, String catColor, String catEstado) {
        this.catNombre = catNombre;
        this.catDescripcion = catDescripcion;
        this.catColor = catColor;
        this.catEstado = catEstado;
    }

    public Integer getCatId() {
        return catId;
    }

    public void setCatId(Integer catId) {
        this.catId = catId;
    }

    public String getCatNombre() {
        return catNombre;
    }

    public void setCatNombre(String catNombre) {
        this.catNombre = catNombre;
    }

    public String getCatDescripcion() {
        return catDescripcion;
    }

    public void setCatDescripcion(String catDescripcion) {
        this.catDescripcion = catDescripcion;
    }

    public String getCatColor() {
        return catColor;
    }

    public void setCatColor(String catColor) {
        this.catColor = catColor;
    }

    public String getCatEstado() {
        return catEstado;
    }

    public void setCatEstado(String catEstado) {
        this.catEstado = catEstado;
    }
}
