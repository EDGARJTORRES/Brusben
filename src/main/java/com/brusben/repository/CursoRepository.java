package com.brusben.repository;

import com.brusben.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
    List<Curso> findByEstCurso(String estCurso);
    List<Curso> findByCategoriaCatId(Integer catId);
    List<Curso> findByDocenteIdUsuario(Integer idDocente);
}
