package com.brusben.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "archivos", schema = "sc_sistema")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Archivo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_archivo")
    private Integer idArchivo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_material", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonIgnore
    private Material material;
    
    @Column(name = "titulo", nullable = false)
    private String titulo;
    
    @Column(name = "tipo_archivo", nullable = false)
    private String tipoArchivo; // VIDEO, PDF, DOC, LINK
    
    @Column(name = "url_archivo")
    private String urlArchivo;
    
    @Column(name = "nombre_archivo")
    private String nombreArchivo;
    
    @Column(name = "tamano_archivo")
    private Long tamanoArchivo;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    // Constructores
    public Archivo() {
        this.fechaCreacion = LocalDateTime.now();
    }
    
    public Archivo(Material material, String titulo, String tipoArchivo, String urlArchivo) {
        this();
        this.material = material;
        this.titulo = titulo;
        this.tipoArchivo = tipoArchivo;
        this.urlArchivo = urlArchivo;
    }
    
    // Getters y Setters
    public Integer getIdArchivo() {
        return idArchivo;
    }
    
    public void setIdArchivo(Integer idArchivo) {
        this.idArchivo = idArchivo;
    }
    
    public Material getMaterial() {
        return material;
    }
    
    public void setMaterial(Material material) {
        this.material = material;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getTipoArchivo() {
        return tipoArchivo;
    }
    
    public void setTipoArchivo(String tipoArchivo) {
        this.tipoArchivo = tipoArchivo;
    }
    
    public String getUrlArchivo() {
        return urlArchivo;
    }
    
    public void setUrlArchivo(String urlArchivo) {
        this.urlArchivo = urlArchivo;
    }
    
    public String getNombreArchivo() {
        return nombreArchivo;
    }
    
    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }
    
    public Long getTamanoArchivo() {
        return tamanoArchivo;
    }
    
    public void setTamanoArchivo(Long tamanoArchivo) {
        this.tamanoArchivo = tamanoArchivo;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
