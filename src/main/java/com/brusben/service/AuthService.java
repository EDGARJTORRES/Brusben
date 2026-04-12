package com.brusben.service;

import com.brusben.dto.LoginRequest;
import com.brusben.dto.LoginResponse;
import com.brusben.entity.PasswordResetToken;
import com.brusben.entity.Usuario;
import com.brusben.repository.PasswordResetTokenRepository;
import com.brusben.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.Random;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
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

        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol().getNombreRol());

        return new LoginResponse(
                token,
                usuario.getIdUsuario(),
                usuario.getNombres(),
                usuario.getEmail(),
                usuario.getRol().getIdRol(),
                usuario.getRol().getNombreRol()
        );
    }

    @Transactional
    public String requestPasswordReset(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No existe un usuario registrado con ese correo electrónico"));
        
        // Generar un código de 6 dígitos único
        String token = String.format("%06d", new Random().nextInt(999999));
        
        // Limpiamos tokens anteriores del usuario
        passwordResetTokenRepository.findByUsuario(usuario).ifPresent(passwordResetTokenRepository::delete);
        
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
        passwordResetTokenRepository.save(resetToken);
        
        System.out.println(">>> [DEBUG] CÓDIGO DE RECUPERACIÓN PARA " + email + ": " + token);
        return token; // Se retorna para facilitar las pruebas sin servidor de correo
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Código de recuperación inválido o expirado"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("El código ha expirado. Por favor, solicita uno nuevo.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPasswordHash(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        
        // Eliminar el token usado
        passwordResetTokenRepository.delete(resetToken);
    }
}
