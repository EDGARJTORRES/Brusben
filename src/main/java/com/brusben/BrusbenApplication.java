package com.brusben;

import com.brusben.entity.Usuario;
import com.brusben.entity.Rol;
import com.brusben.repository.UsuarioRepository;
import com.brusben.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BrusbenApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrusbenApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Inicializar Roles
            Rol adminRol = rolRepository.findById(1).orElseGet(() -> 
                rolRepository.save(new Rol(1, "admin", "Super administrador del sistema")));
            
            rolRepository.findById(2).orElseGet(() -> 
                rolRepository.save(new Rol(2, "docente", "Docente que dicta cursos")));
            
            rolRepository.findById(3).orElseGet(() -> 
                rolRepository.save(new Rol(3, "estudiante", "Estudiante matriculado")));

            // Inicializar Usuario Admin
            if (usuarioRepository.findByEmail("admin@brusben.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombres("Administrador");
                admin.setEmail("admin@brusben.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setDni("00000000");
                admin.setActivo(true);
                admin.setRol(adminRol);
                usuarioRepository.save(admin);
                System.out.println(">>> Usuario administrador creado: admin@brusben.com / admin123");
            } else {
                System.out.println(">>> El usuario de prueba admin@brusben.com ya existe.");
            }
        };
    }
}