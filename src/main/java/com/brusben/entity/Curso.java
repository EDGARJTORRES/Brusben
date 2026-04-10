package com.brusben.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "curso", schema = "sc_sistema")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cur_id")
    private Integer curId;

    @Column(name = "cur_nombre", nullable = false, length = 200)
    private String curNombre;

    @Column(name = "cur_descripcion", length = 1000)
    private String curDescripcion;

    @Column(name = "cur_precio")
    private Double curPrecio;

    @Column(name = "cur_duracion", length = 100)
    private String curDuracion;

    @Column(name = "cur_imagen", length = 500)
    private String curImagen;

    @Column(name = "cur_estado", nullable = false, length = 1)
    private String curEstado = "A";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cat_id", nullable = false)
    private Categoria categoria;

    public Curso() {}

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

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}
