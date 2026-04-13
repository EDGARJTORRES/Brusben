package com.brusben.repository;

import com.brusben.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findAllByOrderByIdPagoDesc();
}
