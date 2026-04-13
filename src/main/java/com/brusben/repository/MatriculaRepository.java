package com.brusben.repository;

import com.brusben.entity.Matricula;
import com.brusben.entity.Usuario;
import com.brusben.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
    List<Matricula> findByUsuario(Usuario usuario);
    Optional<Matricula> findByUsuarioAndCurso(Usuario usuario, Curso curso);
}
