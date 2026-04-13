package com.brusben.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Integer idUsuario;
    private String dni;
    private String nombres;
    private String email;
    private String password;
    private Boolean activo;
    private Integer idRol;
    private String nombreRol;
    private String nmrCelular;
}
