package com.brusben.dto;

public class CursoDTO {

    private Integer curId;
    private String curNombre;
    private String curDescripcion;
    private Double curPrecio;
    private String curDuracion;
    private String curImagen;
    private String curEstado;
    private Integer catId;
    private String catNombre;
    private String catColor;

    public CursoDTO() {}

    public CursoDTO(Integer curId, String curNombre, String curDescripcion,
                    Double curPrecio, String curDuracion, String curImagen,
                    String curEstado, Integer catId, String catNombre, String catColor) {
        this.curId = curId;
        this.curNombre = curNombre;
        this.curDescripcion = curDescripcion;
        this.curPrecio = curPrecio;
        this.curDuracion = curDuracion;
        this.curImagen = curImagen;
        this.curEstado = curEstado;
        this.catId = catId;
        this.catNombre = catNombre;
        this.catColor = catColor;
    }

    public Integer getCurId() { return curId; }
    public void setCurId(Integer curId) { this.curId = curId; }

    public String getCurNombre() { return curNombre; }
    public void setCurNombre(String curNombre) { this.curNombre = curNombre; }

    public String getCurDescripcion() { return curDescripcion; }
    public void setCurDescripcion(String curDescripcion) { this.curDescripcion = curDescripcion; }

    public Double getCurPrecio() { return curPrecio; }
    public void setCurPrecio(Double curPrecio) { this.curPrecio = curPrecio; }

    public String getCurDuracion() { return curDuracion; }
    public void setCurDuracion(String curDuracion) { this.curDuracion = curDuracion; }

    public String getCurImagen() { return curImagen; }
    public void setCurImagen(String curImagen) { this.curImagen = curImagen; }

    public String getCurEstado() { return curEstado; }
    public void setCurEstado(String curEstado) { this.curEstado = curEstado; }

    public Integer getCatId() { return catId; }
    public void setCatId(Integer catId) { this.catId = catId; }

    public String getCatNombre() { return catNombre; }
    public void setCatNombre(String catNombre) { this.catNombre = catNombre; }

    public String getCatColor() { return catColor; }
    public void setCatColor(String catColor) { this.catColor = catColor; }
}
