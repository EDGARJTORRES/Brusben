package com.brusben.repository;

import com.brusben.entity.EgresoDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EgresoDocenteRepository extends JpaRepository<EgresoDocente, Integer> {

    List<EgresoDocente> findAllByOrderByIdEgresoDesc();

    @Query("SELECT e FROM EgresoDocente e WHERE e.docente.idUsuario = :idDocente ORDER BY e.fechaEgreso DESC")
    List<EgresoDocente> findByDocenteId(@Param("idDocente") Integer idDocente);

    @Query("SELECT e FROM EgresoDocente e WHERE e.curso.idCurso = :idCurso ORDER BY e.fechaEgreso DESC")
    List<EgresoDocente> findByCursoId(@Param("idCurso") Integer idCurso);
}
