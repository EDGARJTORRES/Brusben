package com.brusben.service;

import com.brusben.dto.CursoDTO;
import com.brusben.entity.Categoria;
import com.brusben.entity.Curso;
import com.brusben.entity.Usuario;
import com.brusben.repository.CategoriaRepository;
import com.brusben.repository.CursoRepository;
import com.brusben.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<CursoDTO> getAllCursos() {
        return cursoRepository.findAll()
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CursoDTO getCursoById(Integer id) {
        return cursoRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public List<CursoDTO> getCursosByEstado(String estado) {
        return cursoRepository.findByEstCurso(estado)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CursoDTO createCurso(CursoDTO dto) {
        Usuario docente = usuarioRepository.findById(dto.getIdDocente())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getCatId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Curso curso = new Curso();
        curso.setDocente(docente);
        curso.setTitulo(dto.getTitulo());
        curso.setDescripcion(dto.getDescripcion());
        curso.setFechaRegistro(dto.getFechaRegistro() != null ? dto.getFechaRegistro() : LocalDate.now());
        curso.setCategoria(categoria);
        curso.setImgCurso(dto.getImgCurso());
        curso.setEstCurso(dto.getEstCurso() != null ? dto.getEstCurso() : "A");
        curso.setPrecioCurso(dto.getPrecioCurso());

        return convertToDTO(cursoRepository.save(curso));
    }

    public CursoDTO updateCurso(Integer id, CursoDTO dto) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Usuario docente = usuarioRepository.findById(dto.getIdDocente())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getCatId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        curso.setDocente(docente);
        curso.setTitulo(dto.getTitulo());
        curso.setDescripcion(dto.getDescripcion());
        curso.setCategoria(categoria);
        curso.setEstCurso(dto.getEstCurso());

        // Solo actualiza imagen si viene una nueva
        if (dto.getImgCurso() != null && !dto.getImgCurso().isEmpty()) {
            curso.setImgCurso(dto.getImgCurso());
        }

        return convertToDTO(cursoRepository.save(curso));
    }

    public CursoDTO toggleEstado(Integer id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        curso.setEstCurso("A".equals(curso.getEstCurso()) ? "I" : "A");
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
                curso.getIdCurso(),
                curso.getDocente().getIdUsuario(),
                curso.getDocente().getNombres(),
                curso.getTitulo(),
                curso.getDescripcion(),
                curso.getFechaRegistro(),
                curso.getCategoria() != null ? curso.getCategoria().getCatId() : null,
                curso.getCategoria() != null ? curso.getCategoria().getCatNombre() : null,
                curso.getCategoria() != null ? curso.getCategoria().getCatColor() : null,
                curso.getImgCurso(),
                curso.getEstCurso(),
                curso.getPrecioCurso()
        );
    }
}
