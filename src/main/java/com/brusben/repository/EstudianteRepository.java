package com.brusben.repository;

import com.brusben.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    Optional<Estudiante> findByDni(String dni);
    Optional<Estudiante> findByCorreo(String correo);
}
