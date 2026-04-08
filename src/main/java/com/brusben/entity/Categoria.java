package com.brusben.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria", schema = "sc_sistema")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Integer catId;

    @Column(name = "cat_nombre", nullable = false, unique = true, length = 100)
    private String catNombre;

    @Column(name = "cat_descripcion", length = 500)
    private String catDescripcion;

    @Column(name = "cat_color", length = 50)
    private String catColor;

    @Column(name = "cat_estado", nullable = false, length = 1)
    private String catEstado;

    public Categoria() {}

    public Categoria(String catNombre, String catEstado) {
        this.catNombre = catNombre;
        this.catEstado = catEstado;
    }

    public Categoria(Integer catId, String catNombre, String catDescripcion, String catColor, String catEstado) {
        this.catId = catId;
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
