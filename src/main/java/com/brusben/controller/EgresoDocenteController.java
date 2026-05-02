package com.brusben.controller;

import com.brusben.entity.Curso;
import com.brusben.entity.EgresoDocente;
import com.brusben.entity.Usuario;
import com.brusben.repository.CursoRepository;
import com.brusben.repository.EgresoDocenteRepository;
import com.brusben.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/egresos-docentes")
@CrossOrigin(origins = "*")
public class EgresoDocenteController {

    @Autowired
    private EgresoDocenteRepository egresoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // ── GET /api/egresos-docentes ─────────────────────────────────────────────
    @GetMapping
    public List<Map<String, Object>> listarEgresos() {
        return egresoRepository.findAllByOrderByIdEgresoDesc()
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    // ── GET /api/egresos-docentes/docentes ────────────────────────────────────
    // Devuelve todos los usuarios con rol "docente" activos
    @GetMapping("/docentes")
    public List<Map<String, Object>> listarDocentes() {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> u.getRol() != null
                        && u.getRol().getNombreRol().equalsIgnoreCase("docente")
                        && Boolean.TRUE.equals(u.getActivo()))
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("idUsuario", u.getIdUsuario());
                    m.put("nombres", u.getNombres());
                    m.put("dni", u.getDni());
                    m.put("email", u.getEmail());
                    m.put("nmrCelular", u.getNmrCelular());
                    return m;
                })
                .collect(Collectors.toList());
    }

    // ── GET /api/egresos-docentes/cursos-docente/{idDocente} ──────────────────
    // Devuelve los cursos activos de un docente específico que NO tienen egreso registrado
    @GetMapping("/cursos-docente/{idDocente}")
    public List<Map<String, Object>> cursosPorDocente(@PathVariable Integer idDocente) {
        // Obtener IDs de cursos que ya tienen egreso
        List<Integer> cursosConEgreso = egresoRepository.findByDocenteId(idDocente)
                .stream()
                .map(e -> e.getCurso().getIdCurso())
                .distinct()
                .collect(Collectors.toList());

        // Devolver solo cursos activos del docente que NO tienen egreso
        return cursoRepository.findAll()
                .stream()
                .filter(c -> c.getDocente() != null
                        && c.getDocente().getIdUsuario().equals(idDocente)
                        && "A".equals(c.getEstCurso())
                        && !cursosConEgreso.contains(c.getIdCurso())) // Excluir cursos con egreso
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("idCurso", c.getIdCurso());
                    m.put("titulo", c.getTitulo());
                    m.put("precioCurso", c.getPrecioCurso());
                    return m;
                })
                .collect(Collectors.toList());
    }

    // ── POST /api/egresos-docentes/registrar ──────────────────────────────────
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarEgreso(@RequestBody Map<String, Object> body) {
        try {
            Integer idDocente = Integer.parseInt(body.get("idDocente").toString());
            Integer idCurso   = Integer.parseInt(body.get("idCurso").toString());
            BigDecimal monto  = new BigDecimal(body.get("monto").toString());
            String concepto   = body.getOrDefault("concepto", "Pago por creación de módulos del curso").toString();
            String metodo     = body.getOrDefault("metodoPago", "TRANSFERENCIA").toString();
            String nroOp      = body.getOrDefault("nroOperacion", "").toString();

            Usuario docente = usuarioRepository.findById(idDocente)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            Curso curso = cursoRepository.findById(idCurso)
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

            EgresoDocente egreso = new EgresoDocente();
            egreso.setDocente(docente);
            egreso.setCurso(curso);
            egreso.setMonto(monto);
            egreso.setConcepto(concepto);
            egreso.setMetodoPago(metodo);
            egreso.setNroOperacion(nroOp.isBlank() ? null : nroOp);
            egreso.setFechaEgreso(LocalDateTime.now());
            egreso.setEstado("PAGADO");

            EgresoDocente saved = egresoRepository.save(egreso);

            // Devuelve el egreso completo para generar la boleta en el frontend
            Map<String, Object> response = toMap(saved);
            response.put("docenteDni", docente.getDni());
            response.put("docenteEmail", docente.getEmail());
            response.put("docenteCelular", docente.getNmrCelular());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── PUT /api/egresos-docentes/{id}/estado ─────────────────────────────────
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id,
                                               @RequestBody Map<String, String> body) {
        return egresoRepository.findById(id).map(e -> {
            e.setEstado(body.get("estado"));
            egresoRepository.save(e);
            return ResponseEntity.ok(Map.of("ok", true));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE /api/egresos-docentes/{id} ─────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEgreso(@PathVariable Integer id) {
        if (!egresoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        egresoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private Map<String, Object> toMap(EgresoDocente e) {
        Map<String, Object> m = new HashMap<>();
        m.put("idEgreso", e.getIdEgreso());
        m.put("idDocente", e.getDocente().getIdUsuario());
        m.put("docente", e.getDocente().getNombres());
        m.put("docenteDni", e.getDocente().getDni());
        m.put("docenteEmail", e.getDocente().getEmail());
        m.put("docenteCelular", e.getDocente().getNmrCelular());
        m.put("idCurso", e.getCurso().getIdCurso());
        m.put("curso", e.getCurso().getTitulo());
        m.put("monto", e.getMonto());
        m.put("concepto", e.getConcepto());
        m.put("metodoPago", e.getMetodoPago());
        m.put("nroOperacion", e.getNroOperacion());
        m.put("fechaEgreso", e.getFechaEgreso());
        m.put("estado", e.getEstado());
        return m;
    }
}
