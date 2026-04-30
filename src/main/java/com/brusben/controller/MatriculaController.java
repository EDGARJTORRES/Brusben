package com.brusben.controller;

import com.brusben.entity.Pago;
import com.brusben.repository.CursoRepository;
import com.brusben.repository.PagoRepository;
import com.brusben.entity.Curso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matriculas")
@CrossOrigin(origins = "*")
public class MatriculaController {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    /**
     * Devuelve todos los cursos activos con sus estudiantes que tienen estado PAGADO.
     * Estructura: [ { idCurso, titulo, imgCurso, categoria, docente, precioCurso,
     *                 totalEstudiantes, estudiantes: [ { idUsuario, nombre, email, fechaPago, metodoPago } ] } ]
     */
    @GetMapping("/por-curso")
    public List<Map<String, Object>> matriculasPorCurso() {

        // Obtener todos los cursos activos
        List<Curso> cursosActivos = cursoRepository.findByEstCurso("A");

        // Obtener todos los pagos con estado PAGADO
        List<Pago> pagados = pagoRepository.findAllPagados();

        // Agrupar pagos por idCurso
        Map<Integer, List<Pago>> pagosPorCurso = pagados.stream()
                .collect(Collectors.groupingBy(p -> p.getCurso().getIdCurso()));

        // Construir respuesta
        return cursosActivos.stream().map(curso -> {
            Map<String, Object> cursoMap = new LinkedHashMap<>();
            cursoMap.put("idCurso", curso.getIdCurso());
            cursoMap.put("titulo", curso.getTitulo());
            cursoMap.put("imgCurso", curso.getImgCurso());
            cursoMap.put("precioCurso", curso.getPrecioCurso());
            cursoMap.put("categoria", curso.getCategoria() != null ? curso.getCategoria().getCatNombre() : "Sin categoría");
            cursoMap.put("categoriaColor", curso.getCategoria() != null ? curso.getCategoria().getCatColor() : "#6366f1");
            cursoMap.put("docente", curso.getDocente() != null ? curso.getDocente().getNombres() : "Sin docente");

            List<Pago> pagosDelCurso = pagosPorCurso.getOrDefault(curso.getIdCurso(), Collections.emptyList());

            List<Map<String, Object>> estudiantes = pagosDelCurso.stream().map(p -> {
                Map<String, Object> est = new LinkedHashMap<>();
                est.put("idUsuario", p.getUsuario().getIdUsuario());
                est.put("nombre", p.getUsuario().getNombres());
                est.put("email", p.getUsuario().getEmail());
                est.put("dni", p.getUsuario().getDni());
                est.put("fechaPago", p.getFechaPago() != null ? p.getFechaPago().toString() : null);
                est.put("metodoPago", p.getMetodoPago());
                est.put("monto", p.getMonto());
                est.put("idPago", p.getIdPago());
                return est;
            }).collect(Collectors.toList());

            cursoMap.put("totalEstudiantes", estudiantes.size());
            cursoMap.put("estudiantes", estudiantes);

            return cursoMap;
        }).collect(Collectors.toList());
    }
}
