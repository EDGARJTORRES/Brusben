package com.brusben.service;

import com.brusben.dto.CategoriaDTO;
import com.brusben.entity.Categoria;
import com.brusben.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaDTO> getAllCategorias() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO getCategoriaById(Integer id) {
        Optional<Categoria> categoria = categoriaRepository.findById(id);
        return categoria.map(this::convertToDTO).orElse(null);
    }

    public CategoriaDTO getCategoriaByNombre(String nombre) {
        Optional<Categoria> categoria = categoriaRepository.findByCatNombre(nombre);
        return categoria.map(this::convertToDTO).orElse(null);
    }

    public List<CategoriaDTO> getCategoriasByEstado(String estado) {
        List<Categoria> categorias = categoriaRepository.findByCatEstado(estado);
        return categorias.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO createCategoria(CategoriaDTO categoriaDTO) {
        // Validar que el nombre no exista
        if (categoriaRepository.findByCatNombre(categoriaDTO.getCatNombre()).isPresent()) {
            throw new RuntimeException("La categoría con nombre '" + categoriaDTO.getCatNombre() + "' ya existe");
        }

        // Si no viene estado, asignar "A" (Activo)
        if (categoriaDTO.getCatEstado() == null || categoriaDTO.getCatEstado().isEmpty()) {
            categoriaDTO.setCatEstado("A");
        }

        Categoria categoria = convertToEntity(categoriaDTO);
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return convertToDTO(savedCategoria);
    }

    public CategoriaDTO updateCategoria(Integer id, CategoriaDTO categoriaDTO) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (!categoriaOptional.isPresent()) {
            throw new RuntimeException("Categoría no encontrada");
        }

        Categoria categoria = categoriaOptional.get();
        
        // Validar que el nuevo nombre no exista (excepto el actual)
        if (!categoria.getCatNombre().equals(categoriaDTO.getCatNombre())) {
            if (categoriaRepository.findByCatNombre(categoriaDTO.getCatNombre()).isPresent()) {
                throw new RuntimeException("La categoría con nombre '" + categoriaDTO.getCatNombre() + "' ya existe");
            }
        }

        categoria.setCatNombre(categoriaDTO.getCatNombre());
        categoria.setCatDescripcion(categoriaDTO.getCatDescripcion());
        categoria.setCatColor(categoriaDTO.getCatColor());
        categoria.setCatEstado(categoriaDTO.getCatEstado());

        Categoria updatedCategoria = categoriaRepository.save(categoria);
        return convertToDTO(updatedCategoria);
    }

    public void deleteCategoria(Integer id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (!categoriaOptional.isPresent()) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }

    public CategoriaDTO toggleEstado(Integer id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (!categoriaOptional.isPresent()) {
            throw new RuntimeException("Categoría no encontrada");
        }

        Categoria categoria = categoriaOptional.get();
        String nuevoEstado = "A".equals(categoria.getCatEstado()) ? "I" : "A";
        categoria.setCatEstado(nuevoEstado);

        Categoria updatedCategoria = categoriaRepository.save(categoria);
        return convertToDTO(updatedCategoria);
    }

    private CategoriaDTO convertToDTO(Categoria categoria) {
        return new CategoriaDTO(
                categoria.getCatId(),
                categoria.getCatNombre(),
                categoria.getCatDescripcion(),
                categoria.getCatColor(),
                categoria.getCatEstado()
        );
    }

    private Categoria convertToEntity(CategoriaDTO categoriaDTO) {
        Categoria categoria = new Categoria();
        categoria.setCatId(categoriaDTO.getCatId());
        categoria.setCatNombre(categoriaDTO.getCatNombre());
        categoria.setCatDescripcion(categoriaDTO.getCatDescripcion());
        categoria.setCatColor(categoriaDTO.getCatColor());
        categoria.setCatEstado(categoriaDTO.getCatEstado());
        return categoria;
    }
}
