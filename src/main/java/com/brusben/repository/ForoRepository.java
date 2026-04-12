package com.brusben.repository;

import com.brusben.entity.Foro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForoRepository extends JpaRepository<Foro, Integer> {
    List<Foro> findByCursoIdCursoOrderByFechaCreacionDesc(Integer idCurso);
}
