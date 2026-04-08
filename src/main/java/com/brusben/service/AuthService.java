package com.brusben.service;

import com.brusben.dto.LoginRequest;
import com.brusben.dto.LoginResponse;
import com.brusben.entity.Usuario;
import com.brusben.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        System.out.println("INTENTO DE LOGIN: " + request.getEmail());
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println(">>> ERROR: Usuario no encontrado: " + request.getEmail());
                    return new RuntimeException("Usuario no encontrado");
                });

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            System.out.println(">>> ERROR: Contraseña incorrecta para el usuario: " + request.getEmail());
            throw new RuntimeException("Contraseña incorrecta");
        }

        if (!usuario.getActivo()) {
            System.out.println(">>> ERROR: El usuario está inactivo: " + request.getEmail());
            throw new RuntimeException("El usuario está inactivo");
        }

        System.out.println(">>> LOGIN EXITOSO: " + request.getEmail());

        // Simplemente retornamos el nombre y el token (puedes personalizar esto si ya tienes un generador de JWT)
        return new LoginResponse(
            "fake-jwt-token-" + usuario.getEmail(),
            usuario.getNombres(),
            usuario.getEmail(),
            usuario.getRol().getIdRol(),
            usuario.getRol().getNombreRol()
        );
    }
}
