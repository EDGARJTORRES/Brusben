package com.brusben.repository;

import com.brusben.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Integer> {
    List<Material> findByModuloIdModulo(Integer idModulo);
}
