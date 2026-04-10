package com.brusben.repository;

import com.brusben.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
    List<Curso> findByCurEstado(String estado);
    List<Curso> findByCategoriaCatId(Integer catId);
}
