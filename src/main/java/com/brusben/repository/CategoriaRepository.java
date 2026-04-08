package com.brusben.repository;

import com.brusben.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    Optional<Categoria> findByCatNombre(String catNombre);
    List<Categoria> findByCatEstado(String catEstado);
}
