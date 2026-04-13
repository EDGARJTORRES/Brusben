package com.brusben.controller;

import com.brusben.entity.Matricula;
import com.brusben.entity.Pago;
import com.brusben.entity.Usuario;
import com.brusben.entity.Curso;
import com.brusben.repository.MatriculaRepository;
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
    private MatriculaRepository matriculaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping
    public List<Map<String, Object>> listarPagos() {
        return pagoRepository.findAll().stream().map(p -> {
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
    public ResponseEntity<?> registrarPagoEInscribir(@RequestBody Map<String, Object> payload) {
        try {
            Integer idUsuario = Integer.parseInt(payload.get("idUsuario").toString());
            Integer idCurso = Integer.parseInt(payload.get("idCurso").toString());
            Double monto = Double.valueOf(payload.get("monto").toString());
            String metodo = (String) payload.get("metodoPago");
            String operacion = (String) payload.get("nroOperacion");

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

            // 1. Registrar Pago
            Pago pago = new Pago();
            pago.setUsuario(usuario);
            pago.setCurso(curso);
            pago.setMonto(java.math.BigDecimal.valueOf(monto));
            pago.setFechaPago(LocalDateTime.now());
            pago.setMetodoPago(metodo);
            pago.setNroOperacion(operacion);
            pago.setEstado("COMPLETADO");
            pagoRepository.save(pago);

            // 2. Crear Matrícula (Solo si no está ya matriculado)
            if (matriculaRepository.findByUsuarioAndCurso(usuario, curso).isEmpty()) {
                Matricula matricula = new Matricula();
                matricula.setUsuario(usuario);
                matricula.setEstudiante(estudiante); // <--- AHORA SE SETEA EL ESTUDIANTE
                matricula.setCurso(curso);
                matricula.setFechaMatricula(LocalDateTime.now());
                matricula.setEstado("ACTIVA");
                matriculaRepository.save(matricula);
            }

            return ResponseEntity.ok(Map.of("message", "Pago registrado y matrícula activa"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public List<Map<String, Object>> listarCursosUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return matriculaRepository.findByUsuario(usuario).stream().map(m -> {
             Map<String, Object> map = new java.util.HashMap<>();
             map.put("idMatricula", m.getIdMatricula());
             map.put("idCurso", m.getCurso().getIdCurso());
             map.put("titulo", m.getCurso().getTitulo());
             map.put("imgCurso", m.getCurso().getImgCurso());
             map.put("categoria", m.getCurso().getCategoria() != null ? m.getCurso().getCategoria().getCatNombre() : "");
             map.put("progreso", 0); // Placeholder
             map.put("status", "En Progreso");
             return map;
        }).collect(Collectors.toList());
    }
}
