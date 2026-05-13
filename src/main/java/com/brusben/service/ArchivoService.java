package com.brusben.service;

import com.brusben.entity.Archivo;
import com.brusben.entity.Material;
import com.brusben.repository.ArchivoRepository;
import com.brusben.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ArchivoService {
    
    @Autowired
    private ArchivoRepository archivoRepository;
    
    @Autowired
    private MaterialRepository materialRepository;
    
    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/public/uploads/archivos/";
    
    public List<Archivo> getArchivosByMaterial(Integer idMaterial) {
        return archivoRepository.findByMaterialIdMaterial(idMaterial);
    }
    
    public Archivo createArchivo(Integer idMaterial, String titulo, String tipoArchivo, 
                               String urlArchivo, MultipartFile file) throws IOException {
        
        // Validar que el material existe
        Material material = materialRepository.findById(idMaterial)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));
        
        // Validar límite de videos por clase
        if ("VIDEO".equals(tipoArchivo)) {
            Long videoCount = archivoRepository.countByMaterialAndTipoArchivo(idMaterial, "VIDEO");
            if (videoCount >= 1) {
                throw new RuntimeException("Esta clase ya tiene un video. Solo se permite 1 video por clase.");
            }
        }
        
        Archivo archivo = new Archivo();
        archivo.setMaterial(material);
        archivo.setTitulo(titulo);
        archivo.setTipoArchivo(tipoArchivo);
        archivo.setUrlArchivo(urlArchivo);
        
        // Si hay archivo físico, guardarlo
        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadDir = Paths.get(UPLOAD_DIR);
            
            // Crear directorio si no existe
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path uploadPath = uploadDir.resolve(fileName);
            
            // Guardar archivo
            Files.copy(file.getInputStream(), uploadPath);
            
            archivo.setNombreArchivo(fileName);
            archivo.setTamanoArchivo(file.getSize());
            archivo.setUrlArchivo("/uploads/archivos/" + fileName);
        }
        
        return archivoRepository.save(archivo);
    }
    
    public Archivo createArchivoConUrl(Integer idMaterial, String titulo, String tipoArchivo, String urlArchivo) {
        try {
            return createArchivo(idMaterial, titulo, tipoArchivo, urlArchivo, null);
        } catch (IOException e) {
            throw new RuntimeException("Error al crear archivo", e);
        }
    }
    
    public void deleteArchivo(Integer idArchivo) {
        Archivo archivo = archivoRepository.findById(idArchivo)
                .orElseThrow(() -> new RuntimeException("Archivo no encontrado"));
        
        // Eliminar archivo físico si existe
        if (archivo.getNombreArchivo() != null && archivo.getUrlArchivo() != null) {
            try {
                Path filePath = Paths.get(archivo.getUrlArchivo());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            } catch (IOException e) {
                System.err.println("Error al eliminar archivo físico: " + e.getMessage());
            }
        }
        
        archivoRepository.deleteById(idArchivo);
    }
    
    public Long contarArchivosPorTipo(Integer idMaterial, String tipoArchivo) {
        return archivoRepository.countByMaterialAndTipoArchivo(idMaterial, tipoArchivo);
    }
}
