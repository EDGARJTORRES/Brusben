package com.brusben.controller;

import com.brusben.entity.Pago;
import com.brusben.entity.Usuario;
import com.brusben.entity.Curso;
import com.brusben.repository.PagoRepository;
import com.brusben.repository.UsuarioRepository;
import com.brusben.repository.CursoRepository;
import com.brusben.repository.EstudianteRepository;
import com.brusben.entity.Estudiante;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping
    public List<Map<String, Object>> listarPagos() {
        return pagoRepository.findAllByOrderByIdPagoDesc().stream().map(p -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("idPago", p.getIdPago());
            map.put("student", p.getUsuario().getNombres());
            map.put("course", p.getCurso().getTitulo());
            map.put("amount", "S/ " + p.getMonto());
            map.put("date", p.getFechaPago());
            map.put("status", p.getEstado());
            map.put("method", p.getMetodoPago());
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarPago(@RequestBody Map<String, Object> payload) {
        try {
            Integer idUsuario = Integer.parseInt(payload.get("idUsuario").toString());
            Integer idCurso = Integer.parseInt(payload.get("idCurso").toString());
            Double monto = Double.valueOf(payload.get("monto").toString());
            String metodo = (String) payload.get("metodoPago");
            String operacion = payload.get("nroOperacion") != null ? payload.get("nroOperacion").toString() : null;
            String estado = payload.get("estado") != null ? payload.get("estado").toString() : "PAGADO";

            Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            Curso curso = cursoRepository.findById(idCurso).orElseThrow(() -> new RuntimeException("Curso no encontrado"));

            // --- Lógica para asegurar que exista el registro en la tabla 'estudiantes' ---
            Estudiante estudiante = estudianteRepository.findByCorreo(usuario.getEmail())
                    .orElseGet(() -> {
                        Estudiante nuevo = new Estudiante();
                        nuevo.setNombres(usuario.getNombres());
                        nuevo.setDni(usuario.getDni());
                        nuevo.setCorreo(usuario.getEmail());
                        return estudianteRepository.save(nuevo);
                    });

            // Registrar Pago
            Pago pago = new Pago();
            pago.setUsuario(usuario);
            pago.setCurso(curso);
            pago.setMonto(java.math.BigDecimal.valueOf(monto));
            pago.setFechaPago(LocalDateTime.now());
            pago.setMetodoPago(metodo);
            pago.setNroOperacion(operacion);
            pago.setEstado(estado);
            pagoRepository.save(pago);

            return ResponseEntity.ok(Map.of("message", "Pago registrado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{idPago}")
    public ResponseEntity<?> actualizarEstadoPago(@PathVariable Integer idPago, @RequestBody Map<String, Object> payload) {
        try {
            Pago pago = pagoRepository.findById(idPago).orElseThrow(() -> new RuntimeException("Pago no encontrado"));
            
            if (payload.containsKey("status")) {
                pago.setEstado(payload.get("status").toString());
            } else if (payload.containsKey("estadoPago")) {
                pago.setEstado(payload.get("estadoPago").toString());
            }
            
            pagoRepository.save(pago);
            return ResponseEntity.ok(Map.of("message", "Estado actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Map<String, Object>> listarCursosUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // Ahora usa la tabla pagos en vez de matriculas
        return pagoRepository.findAll().stream()
                .filter(p -> p.getUsuario().getIdUsuario().equals(idUsuario) && "PAGADO".equals(p.getEstado()))
                .map(p -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("idPago", p.getIdPago());
                    map.put("idCurso", p.getCurso().getIdCurso());
                    map.put("titulo", p.getCurso().getTitulo());
                    map.put("imgCurso", p.getCurso().getImgCurso());
                    map.put("categoria", p.getCurso().getCategoria() != null ? p.getCurso().getCategoria().getCatNombre() : "");
                    map.put("progreso", 0);
                    map.put("status", "En Progreso");
                    return map;
                }).collect(Collectors.toList());
    }
}
