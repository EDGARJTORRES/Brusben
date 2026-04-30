package com.brusben.controller;

import com.brusben.dto.MaterialDTO;
import com.brusben.dto.ModuloDTO;
import com.brusben.service.ModuloMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/cursos-materiales")
@CrossOrigin(origins = "http://localhost:3000")
public class ModuloMaterialController {

    @Autowired
    private ModuloMaterialService service;

    // ─── MÓDULOS ─────────────────────────────────────────────────────────────

    @GetMapping("/{idCurso}/modulos")
    public ResponseEntity<?> getModulos(@PathVariable Integer idCurso) {
        try {
            return ResponseEntity.ok(service.getModulosByCurso(idCurso));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{idCurso}/modulos")
    public ResponseEntity<?> createModulo(
            @PathVariable Integer idCurso,
            @RequestBody ModuloDTO dto) {
        try {
            if (dto.getNombre() == null || dto.getNombre().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del módulo es requerido"));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.createModulo(idCurso, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/modulos/{idModulo}")
    public ResponseEntity<?> updateModulo(
            @PathVariable Integer idModulo,
            @RequestBody ModuloDTO dto) {
        try {
            return ResponseEntity.ok(service.updateModulo(idModulo, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/modulos/{idModulo}")
    public ResponseEntity<?> deleteModulo(@PathVariable Integer idModulo) {
        try {
            service.deleteModulo(idModulo);
            return ResponseEntity.ok(Map.of("message", "Módulo eliminado"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── MATERIALES ──────────────────────────────────────────────────────────

    /** POST con URL externa (YouTube, link directo, etc.) */
    @PostMapping("/modulos/{idModulo}/materiales")
    public ResponseEntity<?> createMaterial(
            @PathVariable Integer idModulo,
            @RequestBody MaterialDTO dto) {
        try {
            if (dto.getTitulo() == null || dto.getTitulo().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "El título es requerido"));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.createMaterial(idModulo, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** POST con archivo físico (multipart: PDF, DOCX, MP4) */
    @PostMapping("/modulos/{idModulo}/materiales/upload")
    public ResponseEntity<?> uploadMaterial(
            @PathVariable Integer idModulo,
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "tipoMaterial", defaultValue = "PDF") String tipoMaterial) {
        try {
            if (file.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.uploadMaterial(idModulo, titulo, tipoMaterial, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al subir archivo: " + e.getMessage()));
        }
    }

    @DeleteMapping("/materiales/{idMaterial}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Integer idMaterial) {
        try {
            service.deleteMaterial(idMaterial);
            return ResponseEntity.ok(Map.of("message", "Material eliminado"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}