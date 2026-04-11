package com.brusben.controller;

import com.brusben.dto.CursoDTO;
import com.brusben.dto.UsuarioDTO;
import com.brusben.service.CursoService;
import com.brusben.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "http://localhost:3000")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @Autowired
    private UsuarioService usuarioService;

    private static final String UPLOAD_DIR = "uploads/cursos/";

    // ─── GET todos los cursos ───────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllCursos() {
        try {
            return ResponseEntity.ok(cursoService.getAllCursos());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET curso por ID ───────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getCursoById(@PathVariable Integer id) {
        try {
            CursoDTO curso = cursoService.getCursoById(id);
            if (curso == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Curso no encontrado"));
            return ResponseEntity.ok(curso);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET docentes para el SELECT del formulario ─────────────────────────
    // Retorna solo usuarios con rol "docente"
    @GetMapping("/docentes")
    public ResponseEntity<?> getDocentes() {
        try {
            List<UsuarioDTO> docentes = usuarioService.getUsersByRol("docente");
            return ResponseEntity.ok(docentes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener docentes: " + e.getMessage()));
        }
    }

    // ─── POST subir imagen ──────────────────────────────────────────────────
    @PostMapping("/cursos")
    public ResponseEntity<?> uploadImagen(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(Map.of("path", "/" + UPLOAD_DIR + fileName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al subir imagen: " + e.getMessage()));
        }
    }

    // ─── POST crear curso ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createCurso(@RequestBody CursoDTO dto) {
        try {
            if (dto.getTitulo() == null || dto.getTitulo().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "El título del curso es requerido"));
            if (dto.getIdDocente() == null)
                return ResponseEntity.badRequest().body(Map.of("error", "El docente es requerido"));
            if (dto.getCatId() == null)
                return ResponseEntity.badRequest().body(Map.of("error", "La categoría es requerida"));

            return ResponseEntity.status(HttpStatus.CREATED).body(cursoService.createCurso(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PUT actualizar curso ───────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCurso(@PathVariable Integer id, @RequestBody CursoDTO dto) {
        try {
            if (dto.getTitulo() == null || dto.getTitulo().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "El título del curso es requerido"));
            if (dto.getIdDocente() == null)
                return ResponseEntity.badRequest().body(Map.of("error", "El docente es requerido"));
            if (dto.getCatId() == null)
                return ResponseEntity.badRequest().body(Map.of("error", "La categoría es requerida"));

            return ResponseEntity.ok(cursoService.updateCurso(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PUT toggle estado A/I ──────────────────────────────────────────────
    @PutMapping("/{id}/toggle-estado")
    public ResponseEntity<?> toggleEstado(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(cursoService.toggleEstado(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── DELETE curso ───────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCurso(@PathVariable Integer id) {
        try {
            cursoService.deleteCurso(id);
            return ResponseEntity.ok(Map.of("message", "Curso eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
