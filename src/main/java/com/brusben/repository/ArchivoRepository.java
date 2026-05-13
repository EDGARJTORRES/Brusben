package com.brusben.repository;

import com.brusben.entity.Archivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchivoRepository extends JpaRepository<Archivo, Integer> {
    
    @Query("SELECT a FROM Archivo a WHERE a.material.idMaterial = :idMaterial")
    List<Archivo> findByMaterialIdMaterial(@Param("idMaterial") Integer idMaterial);
    
    @Query(value = "SELECT COUNT(*) FROM sc_sistema.archivos WHERE id_material = :idMaterial AND tipo_archivo = :tipoArchivo", nativeQuery = true)
    Long countByMaterialAndTipoArchivo(@Param("idMaterial") Integer idMaterial, @Param("tipoArchivo") String tipoArchivo);
    
    @Query("DELETE FROM Archivo a WHERE a.material.idMaterial = :idMaterial")
    void deleteByMaterialIdMaterial(@Param("idMaterial") Integer idMaterial);
}
