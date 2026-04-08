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
            // Inicializar Roles (solo si no existen)
            if (rolRepository.count() == 0) {
                rolRepository.save(new Rol(1, "admin", "Super administrador del sistema"));
                rolRepository.save(new Rol(2, "docente", "Docente que dicta cursos"));
                rolRepository.save(new Rol(3, "estudiante", "Estudiante matriculado"));
                System.out.println(">>> Roles inicializados correctamente");
            }
        };
    }
}