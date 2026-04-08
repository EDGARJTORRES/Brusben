package com.brusben.dto;

public class LoginResponse {

    private String token;
    private String nombre;
    private String email;
    private Integer rolId;
    private String nombreRol;

    public LoginResponse() {
    }

    public LoginResponse(String token, String nombre, String email, Integer rolId, String nombreRol) {
        this.token = token;
        this.nombre = nombre;
        this.email = email;
        this.rolId = rolId;
        this.nombreRol = nombreRol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getRolId() {
        return rolId;
    }

    public void setRolId(Integer rolId) {
        this.rolId = rolId;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }
}