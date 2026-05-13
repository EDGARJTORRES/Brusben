package com.brusben.repository;

import com.brusben.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findAllByOrderByIdPagoDesc();

    @Query("SELECT p FROM Pago p WHERE p.estado = 'PAGADO' ORDER BY p.curso.idCurso ASC, p.fechaPago DESC")
    List<Pago> findAllPagados();

    @Query("SELECT p.idPago as idPago, " +
           "p.monto as monto, " +
           "p.fechaPago as fechaPago, " +
           "p.estado as estado, " +
           "p.metodoPago as metodoPago " +
           "FROM Pago p " +
           "ORDER BY p.idPago DESC")
    List<Map<String, Object>> findAllWithNames();
}
