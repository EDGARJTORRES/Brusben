package com.brusben.controller;

import com.brusben.dto.CursoDTO;
import com.brusben.service.CursoService;
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

    private static final String UPLOAD_DIR = "uploads/cursos/";

    @GetMapping
    public ResponseEntity<?> getAllCursos() {
        try {
            return ResponseEntity.ok(cursoService.getAllCursos());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCursoById(@PathVariable Integer id) {
        try {
            CursoDTO curso = cursoService.getCursoById(id);
            if (curso == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Curso no encontrado"));
            return ResponseEntity.ok(curso);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Upload image and return the saved path
     */
    @PostMapping("/upload-imagen")
    public ResponseEntity<?> uploadImagen(@RequestParam("file") MultipartFile file) {
        try {
            // Create directory if not exists
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

            String relativePath = "/" + UPLOAD_DIR + fileName;
            return ResponseEntity.ok(Map.of("path", relativePath));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al subir imagen: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCurso(@RequestBody CursoDTO dto) {
        try {
            if (dto.getCurNombre() == null || dto.getCurNombre().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del curso es requerido"));
            if (dto.getCatId() == null)
                return ResponseEntity.badRequest().body(Map.of("error", "La categoría es requerida"));
            return ResponseEntity.status(HttpStatus.CREATED).body(cursoService.createCurso(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCurso(@PathVariable Integer id, @RequestBody CursoDTO dto) {
        try {
            if (dto.getCurNombre() == null || dto.getCurNombre().isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del curso es requerido"));
            return ResponseEntity.ok(cursoService.updateCurso(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle-estado")
    public ResponseEntity<?> toggleEstado(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(cursoService.toggleEstado(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

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
