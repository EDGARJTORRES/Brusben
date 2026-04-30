package com.brusben.service;

import com.brusben.dto.MaterialDTO;
import com.brusben.dto.ModuloDTO;
import com.brusben.entity.Curso;
import com.brusben.entity.Material;
import com.brusben.entity.Modulo;
import com.brusben.repository.CursoRepository;
import com.brusben.repository.MaterialRepository;
import com.brusben.repository.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ModuloMaterialService {

    @Autowired private ModuloRepository moduloRepository;
    @Autowired private MaterialRepository materialRepository;
    @Autowired private CursoRepository cursoRepository;

    private static final String UPLOAD_DIR_VIDEOS = "public/materiales/videos/";
    private static final String UPLOAD_DIR_DOCS   = "public/materiales/docs/";

    // ─── MÓDULOS ────────────────────────────────────────────────────────────

    public List<ModuloDTO> getModulosByCurso(Integer idCurso) {
        return moduloRepository.findByCursoIdCursoOrderByOrdenAsc(idCurso)
                .stream().map(this::toModuloDTO).collect(Collectors.toList());
    }

    public ModuloDTO createModulo(Integer idCurso, ModuloDTO dto) {
        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // Calcular el siguiente orden automáticamente
        List<Modulo> existentes = moduloRepository.findByCursoIdCursoOrderByOrdenAsc(idCurso);
        int siguienteOrden = existentes.size() + 1;

        Modulo modulo = new Modulo();
        modulo.setCurso(curso);
        modulo.setNombreModulo(dto.getNombre() != null ? dto.getNombre() : dto.getNombreModulo());
        modulo.setNombre(dto.getNombre() != null ? dto.getNombre() : dto.getNombreModulo());
        modulo.setOrden(siguienteOrden);

        return toModuloDTO(moduloRepository.save(modulo));
    }

    public ModuloDTO updateModulo(Integer idModulo, ModuloDTO dto) {
        Modulo modulo = moduloRepository.findById(idModulo)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        if (dto.getNombre() != null) {
            modulo.setNombre(dto.getNombre());
            modulo.setNombreModulo(dto.getNombre());
        }
        if (dto.getOrden() != null) modulo.setOrden(dto.getOrden());

        return toModuloDTO(moduloRepository.save(modulo));
    }

    public void deleteModulo(Integer idModulo) {
        if (!moduloRepository.existsById(idModulo))
            throw new RuntimeException("Módulo no encontrado");
        moduloRepository.deleteById(idModulo);
    }

    // ─── MATERIALES ─────────────────────────────────────────────────────────

    public List<MaterialDTO> getMaterialesByModulo(Integer idModulo) {
        return materialRepository.findByModuloIdModulo(idModulo)
                .stream().map(this::toMaterialDTO).collect(Collectors.toList());
    }

    /** Crea material con URL externa (VIDEO de YouTube, LINK, etc.) */
    public MaterialDTO createMaterial(Integer idModulo, MaterialDTO dto) {
        Modulo modulo = moduloRepository.findById(idModulo)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        Material material = new Material();
        material.setModulo(modulo);
        material.setTitulo(dto.getTitulo());
        material.setTipoMaterial(dto.getTipoMaterial() != null ? dto.getTipoMaterial().toUpperCase() : "LINK");
        material.setTipoArchivo(dto.getTipoArchivo());
        material.setUrlMaterial(dto.getUrlMaterial());
        material.setUrlRecurso(dto.getUrlRecurso() != null ? dto.getUrlRecurso() : dto.getUrlMaterial());
        material.setMatEstado("A");

        return toMaterialDTO(materialRepository.save(material));
    }

    /** Sube archivo físico (PDF, DOCX, MP4, etc.) y crea el registro */
    public MaterialDTO uploadMaterial(Integer idModulo, String titulo,
                                      String tipoMaterial, MultipartFile file) throws IOException {
        Modulo modulo = moduloRepository.findById(idModulo)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        String tipo = tipoMaterial.toUpperCase();
        String uploadDir = tipo.equals("VIDEO") ? UPLOAD_DIR_VIDEOS : UPLOAD_DIR_DOCS;

        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) Files.createDirectories(dirPath);

        String originalName = file.getOriginalFilename();
        String extension = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID() + extension;
        Path filePath = dirPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String urlGuardada = uploadDir.replace("public/", "") + fileName;

        Material material = new Material();
        material.setModulo(modulo);
        material.setTitulo(titulo);
        material.setTipoMaterial(tipo);
        material.setTipoArchivo(extension.replace(".", "").toUpperCase());
        material.setUrlMaterial(urlGuardada);
        material.setUrlRecurso(urlGuardada);
        material.setMatEstado("A");

        return toMaterialDTO(materialRepository.save(material));
    }

    public void deleteMaterial(Integer idMaterial) {
        if (!materialRepository.existsById(idMaterial))
            throw new RuntimeException("Material no encontrado");
        materialRepository.deleteById(idMaterial);
    }

    // ─── CONVERSORES ────────────────────────────────────────────────────────

    private ModuloDTO toModuloDTO(Modulo m) {
        ModuloDTO dto = new ModuloDTO();
        dto.setIdModulo(m.getIdModulo());
        dto.setIdCurso(m.getCurso() != null ? m.getCurso().getIdCurso() : null);
        dto.setNombreModulo(m.getNombreModulo());
        dto.setNombre(m.getNombre() != null ? m.getNombre() : m.getNombreModulo());
        dto.setOrden(m.getOrden());
        dto.setMateriales(
            m.getMateriales() != null
                ? m.getMateriales().stream()
                    .filter(mat -> "A".equals(mat.getMatEstado()))
                    .map(this::toMaterialDTO)
                    .collect(Collectors.toList())
                : List.of()
        );
        return dto;
    }

    private MaterialDTO toMaterialDTO(Material m) {
        MaterialDTO dto = new MaterialDTO();
        dto.setIdMaterial(m.getIdMaterial());
        dto.setIdModulo(m.getModulo() != null ? m.getModulo().getIdModulo() : null);
        dto.setTitulo(m.getTitulo());
        dto.setTipoMaterial(m.getTipoMaterial());
        dto.setTipoArchivo(m.getTipoArchivo());
        dto.setUrlMaterial(m.getUrlMaterial());
        dto.setUrlRecurso(m.getUrlRecurso());
        dto.setMatEstado(m.getMatEstado());
        return dto;
    }
}