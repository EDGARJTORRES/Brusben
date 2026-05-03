package com.brusben.repository;

import com.brusben.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findAllByOrderByIdPagoDesc();

    @Query("SELECT p FROM Pago p WHERE p.estado = 'PAGADO' ORDER BY p.curso.idCurso ASC, p.fechaPago DESC")
    List<Pago> findAllPagados();
}
