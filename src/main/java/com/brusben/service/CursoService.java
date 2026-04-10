package com.brusben.service;

import com.brusben.dto.CursoDTO;
import com.brusben.entity.Categoria;
import com.brusben.entity.Curso;
import com.brusben.repository.CategoriaRepository;
import com.brusben.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CursoDTO> getAllCursos() {
        return cursoRepository.findAll()
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CursoDTO getCursoById(Integer id) {
        return cursoRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public List<CursoDTO> getCursosByEstado(String estado) {
        return cursoRepository.findByCurEstado(estado)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CursoDTO createCurso(CursoDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCatId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Curso curso = new Curso();
        curso.setCurNombre(dto.getCurNombre());
        curso.setCurDescripcion(dto.getCurDescripcion());
        curso.setCurPrecio(dto.getCurPrecio());
        curso.setCurDuracion(dto.getCurDuracion());
        curso.setCurImagen(dto.getCurImagen());
        curso.setCurEstado(dto.getCurEstado() != null ? dto.getCurEstado() : "A");
        curso.setCategoria(categoria);

        return convertToDTO(cursoRepository.save(curso));
    }

    public CursoDTO updateCurso(Integer id, CursoDTO dto) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getCatId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        curso.setCurNombre(dto.getCurNombre());
        curso.setCurDescripcion(dto.getCurDescripcion());
        curso.setCurPrecio(dto.getCurPrecio());
        curso.setCurDuracion(dto.getCurDuracion());
        curso.setCurEstado(dto.getCurEstado());
        curso.setCategoria(categoria);

        // Only update image path if a new one is provided
        if (dto.getCurImagen() != null && !dto.getCurImagen().isEmpty()) {
            curso.setCurImagen(dto.getCurImagen());
        }

        return convertToDTO(cursoRepository.save(curso));
    }

    public CursoDTO toggleEstado(Integer id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        curso.setCurEstado("A".equals(curso.getCurEstado()) ? "I" : "A");
        return convertToDTO(cursoRepository.save(curso));
    }

    public void deleteCurso(Integer id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso no encontrado");
        }
        cursoRepository.deleteById(id);
    }

    private CursoDTO convertToDTO(Curso curso) {
        return new CursoDTO(
                curso.getCurId(),
                curso.getCurNombre(),
                curso.getCurDescripcion(),
                curso.getCurPrecio(),
                curso.getCurDuracion(),
                curso.getCurImagen(),
                curso.getCurEstado(),
                curso.getCategoria().getCatId(),
                curso.getCategoria().getCatNombre(),
                curso.getCategoria().getCatColor()
        );
    }
}
