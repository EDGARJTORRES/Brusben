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
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        return new LoginResponse(
                null,
                usuario.getIdUsuario(),
                usuario.getNombres(),
                usuario.getEmail(),
                usuario.getRol().getIdRol(),
                usuario.getRol().getNombreRol()
        );
    }
}
