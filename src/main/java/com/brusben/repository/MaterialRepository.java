package com.brusben.repository;

import com.brusben.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    List<Material> findByModuloIdModuloAndMatEstado(Integer idModulo, String estado);
    List<Material> findByModuloIdModulo(Integer idModulo);
}