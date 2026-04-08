package com.brusben.controller;

import com.brusben.dto.CategoriaDTO;
import com.brusben.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    /**
     * GET all categories
     */
    @GetMapping
    public ResponseEntity<?> getAllCategorias() {
        try {
            List<CategoriaDTO> categorias = categoriaService.getAllCategorias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener categorías: " + e.getMessage()));
        }
    }

    /**
     * GET category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoriaById(@PathVariable Integer id) {
        try {
            CategoriaDTO categoria = categoriaService.getCategoriaById(id);
            if (categoria == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Categoría no encontrada"));
            }
            return ResponseEntity.ok(categoria);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener categoría: " + e.getMessage()));
        }
    }

    /**
     * GET categories by estado (A or I)
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> getCategoriasByEstado(@PathVariable String estado) {
        try {
            if (!estado.equals("A") && !estado.equals("I")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Estado inválido. Debe ser 'A' (Activo) o 'I' (Inactivo)"));
            }
            List<CategoriaDTO> categorias = categoriaService.getCategoriasByEstado(estado);
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener categorías: " + e.getMessage()));
        }
    }

    /**
     * CREATE new category
     */
    @PostMapping
    public ResponseEntity<?> createCategoria(@RequestBody CategoriaDTO categoriaDTO) {
        try {
            if (categoriaDTO.getCatNombre() == null || categoriaDTO.getCatNombre().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El nombre de la categoría es requerido"));
            }

            CategoriaDTO createdCategoria = categoriaService.createCategoria(categoriaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategoria);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear categoría: " + e.getMessage()));
        }
    }

    /**
     * UPDATE category
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategoria(@PathVariable Integer id, @RequestBody CategoriaDTO categoriaDTO) {
        try {
            if (categoriaDTO.getCatNombre() == null || categoriaDTO.getCatNombre().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El nombre de la categoría es requerido"));
            }

            if (categoriaDTO.getCatEstado() == null || categoriaDTO.getCatEstado().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El estado es requerido"));
            }

            if (!categoriaDTO.getCatEstado().equals("A") && !categoriaDTO.getCatEstado().equals("I")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Estado inválido. Debe ser 'A' (Activo) o 'I' (Inactivo)"));
            }

            CategoriaDTO updatedCategoria = categoriaService.updateCategoria(id, categoriaDTO);
            return ResponseEntity.ok(updatedCategoria);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("no encontrada")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar categoría: " + e.getMessage()));
        }
    }

    /**
     * DELETE category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoria(@PathVariable Integer id) {
        try {
            categoriaService.deleteCategoria(id);
            return ResponseEntity.ok(Map.of("message", "Categoría eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar categoría: " + e.getMessage()));
        }
    }

    /**
     * TOGGLE category estado (A <-> I)
     */
    @PutMapping("/{id}/toggle-estado")
    public ResponseEntity<?> toggleEstado(@PathVariable Integer id) {
        try {
            CategoriaDTO updatedCategoria = categoriaService.toggleEstado(id);
            return ResponseEntity.ok(updatedCategoria);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cambiar estado: " + e.getMessage()));
        }
    }
}
