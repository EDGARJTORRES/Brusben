package com.brusben.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "materiales", schema = "sc_sistema")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_material")
    private Integer idMaterial;

    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Column(name = "tipo_material", length = 50)
    private String tipoMaterial; // E.g., VIDEO, PDF, LINK

    @Column(name = "url_material", length = 500)
    private String urlMaterial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo", nullable = false)
    private Modulo modulo;

    public Material() {}

    public Integer getIdMaterial() { return idMaterial; }
    public void setIdMaterial(Integer idMaterial) { this.idMaterial = idMaterial; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipoMaterial() { return tipoMaterial; }
    public void setTipoMaterial(String tipoMaterial) { this.tipoMaterial = tipoMaterial; }

    public String getUrlMaterial() { return urlMaterial; }
    public void setUrlMaterial(String urlMaterial) { this.urlMaterial = urlMaterial; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }
}
