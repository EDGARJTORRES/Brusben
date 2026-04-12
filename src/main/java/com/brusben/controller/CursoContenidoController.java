package com.brusben.controller;

import com.brusben.dto.ForoDTO;
import com.brusben.dto.MaterialDTO;
import com.brusben.dto.ModuloDTO;
import com.brusben.entity.Curso;
import com.brusben.entity.Foro;
import com.brusben.entity.Material;
import com.brusben.entity.Modulo;
import com.brusben.repository.CursoRepository;
import com.brusben.repository.ForoRepository;
import com.brusben.repository.MaterialRepository;
import com.brusben.repository.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cursos-contenido")
@CrossOrigin(origins = "*") // Loosening for testing
public class CursoContenidoController {

    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private ForoRepository foroRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // --- MÓDULOS ---

    @GetMapping("/{idCurso}/modulos")
    public ResponseEntity<List<ModuloDTO>> getModulos(@PathVariable Integer idCurso) {
        System.out.println(">>> Recibiendo GET modulos para curso: " + idCurso);
        List<Modulo> modulos = moduloRepository.findByCursoIdCursoOrderByOrdenAsc(idCurso);
        List<ModuloDTO> dtos = modulos.stream().map(this::mapToModuloDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{idCurso}/modulos")
    public ResponseEntity<?> createModulo(@PathVariable Integer idCurso, @RequestBody Modulo modulo) {
        return cursoRepository.findById(idCurso).map(curso -> {
            modulo.setCurso(curso);
            if (modulo.getOrden() == null) {
                modulo.setOrden(moduloRepository.findByCursoIdCursoOrderByOrdenAsc(idCurso).size() + 1);
            }
            Modulo saved = moduloRepository.save(modulo);
            return ResponseEntity.ok(mapToModuloDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/modulos/{id}")
    public ResponseEntity<?> deleteModulo(@PathVariable Integer id) {
        moduloRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- MATERIALES ---

    @PostMapping("/modulos/{idModulo}/materiales")
    public ResponseEntity<?> createMaterial(@PathVariable Integer idModulo, @RequestBody Material material) {
        return moduloRepository.findById(idModulo).map(modulo -> {
            material.setModulo(modulo);
            Material saved = materialRepository.save(material);
            return ResponseEntity.ok(mapToMaterialDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/materiales/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Integer id) {
        materialRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- FOROS ---

    @GetMapping("/{idCurso}/foros")
    public ResponseEntity<List<ForoDTO>> getForos(@PathVariable Integer idCurso) {
        // Obtenemos solo los foros con estado 'A' (Activos)
        List<Foro> foros = foroRepository.findByCursoIdCursoOrderByFechaCreacionDesc(idCurso)
                           .stream()
                           .filter(f -> "A".equals(f.getEstado()))
                           .collect(Collectors.toList());
        List<ForoDTO> dtos = foros.stream().map(this::mapToForoDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{idCurso}/foros")
    public ResponseEntity<?> createForo(@PathVariable Integer idCurso, @RequestBody Foro foro) {
        System.out.println(">>> Recibiendo POST foro para curso ID: " + idCurso);
        try {
            return cursoRepository.findById(idCurso).map(curso -> {
                System.out.println(">>> Curso encontrado: " + curso.getTitulo());
                foro.setCurso(curso);
                foro.setEstado("A"); // Asegurar que nace activo
                Foro saved = foroRepository.save(foro);
                System.out.println(">>> Foro guardado con éxito ID: " + saved.getIdForo());
                return ResponseEntity.ok(mapToForoDTO(saved));
            }).orElseGet(() -> {
                System.out.println(">>> ERROR: Curso no encontrado ID: " + idCurso);
                return ResponseEntity.notFound().build();
            });
        } catch (Exception e) {
            System.err.println(">>> ERROR CRÍTICO al guardar foro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }

    @DeleteMapping("/foros/{id}")
    public ResponseEntity<?> deleteForo(@PathVariable Integer id) {
        // Borrado lógico: Actualizar estado a 'I'
        return foroRepository.findById(id).map(foro -> {
            foro.setEstado("I");
            foroRepository.save(foro);
            System.out.println(">>> Foro desactivado lógicamente ID: " + id);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- MAPPERS ---

    private ModuloDTO mapToModuloDTO(Modulo m) {
        ModuloDTO dto = new ModuloDTO();
        dto.setIdModulo(m.getIdModulo());
        dto.setNombre(m.getNombre());
        dto.setOrden(m.getOrden());
        if (m.getMateriales() != null) {
            dto.setMateriales(m.getMateriales().stream().map(this::mapToMaterialDTO).collect(Collectors.toList()));
        }
        return dto;
    }

    private MaterialDTO mapToMaterialDTO(Material m) {
        MaterialDTO dto = new MaterialDTO();
        dto.setIdMaterial(m.getIdMaterial());
        dto.setTitulo(m.getTitulo());
        dto.setTipoMaterial(m.getTipoMaterial());
        dto.setUrlMaterial(m.getUrlMaterial());
        return dto;
    }

    private ForoDTO mapToForoDTO(Foro f) {
        ForoDTO dto = new ForoDTO();
        dto.setIdForo(f.getIdForo());
        dto.setTitulo(f.getTitulo());
        dto.setTemaDiscusion(f.getTemaDiscusion());
        dto.setDescripcion(f.getDescripcion());
        dto.setEstado(f.getEstado());
        dto.setFechaCreacion(f.getFechaCreacion());
        return dto;
    }
}
