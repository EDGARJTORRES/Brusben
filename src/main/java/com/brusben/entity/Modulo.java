package com.brusben.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "modulos", schema = "sc_sistema")
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modulo")
    private Integer idModulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @Column(name = "nombre_modulo", nullable = false, length = 150)
    private String nombreModulo;

    @Column(name = "orden")
    private Integer orden;

    @Column(name = "nombre", length = 200)
    private String nombre;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("idMaterial ASC")
    private List<Material> materiales;

    public Modulo() {}

    public Integer getIdModulo() { return idModulo; }
    public void setIdModulo(Integer idModulo) { this.idModulo = idModulo; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public String getNombreModulo() { return nombreModulo; }
    public void setNombreModulo(String nombreModulo) { this.nombreModulo = nombreModulo; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public List<Material> getMateriales() { return materiales; }
    public void setMateriales(List<Material> materiales) { this.materiales = materiales; }
}