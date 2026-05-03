package com.brusben.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "estudiantes", schema = "sc_sistema")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private Integer idEstudiante;

    @Column(name = "dni", nullable = false, unique = true)
    private String dni;

    @Column(name = "nombres", nullable = false)
    private String nombres;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    public Estudiante() {}

    public Estudiante(Integer idEstudiante, String dni, String nombres, String email) {
        this.idEstudiante = idEstudiante;
        this.dni = dni;
        this.nombres = nombres;
        this.email = email;
        this.activo = true;
    }

    public Integer getIdEstudiante() {
        return idEstudiante;
    }

    public void setIdEstudiante(Integer idEstudiante) {
        this.idEstudiante = idEstudiante;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
