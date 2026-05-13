package com.brusben.controller;

import com.brusben.service.ArchivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cursos-materiales/materiales")
@CrossOrigin(origins = "http://localhost:3000")
public class ArchivoController {
    
    @Autowired
    private ArchivoService archivoService;
    
    // POST /api/cursos-materiales/materiales/{idMaterial}/archivos/upload
    @PostMapping("/{idMaterial}/archivos/upload")
    public ResponseEntity<?> uploadArchivo(
            @PathVariable Integer idMaterial,
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam("tipoArchivo") String tipoArchivo) {
        
        try {
            System.out.println("=== INICIANDO SUBIDA DE ARCHIVO ===");
            System.out.println("idMaterial: " + idMaterial);
            System.out.println("titulo: " + titulo);
            System.out.println("tipoArchivo: " + tipoArchivo);
            System.out.println("file: " + (file != null ? file.getOriginalFilename() : "null"));
            
            var archivo = archivoService.createArchivo(idMaterial, titulo, tipoArchivo, null, file);
            
            System.out.println("=== ARCHIVO CREADO EXITOSAMENTE ===");
            System.out.println("ID: " + archivo.getIdArchivo());
            System.out.println("URL: " + archivo.getUrlArchivo());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Archivo subido exitosamente");
            response.put("archivo", archivo);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("=== ERROR AL SUBIR ARCHIVO ===");
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            System.err.println("=== ERROR AL SUBIR ARCHIVO ===");
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Error al subir archivo: " + e.getMessage());
            response.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // POST /api/cursos-materiales/materiales/{idMaterial}/archivos
    @PostMapping("/{idMaterial}/archivos")
    public ResponseEntity<?> createArchivoConUrl(
            @PathVariable Integer idMaterial,
            @RequestBody Map<String, String> requestBody) {
        
        try {
            String titulo = requestBody.get("titulo");
            String tipoArchivo = requestBody.get("tipoArchivo");
            String urlArchivo = requestBody.get("urlArchivo");
            
            if (titulo == null || tipoArchivo == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "El título y tipo de archivo son obligatorios");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            var archivo = archivoService.createArchivoConUrl(idMaterial, titulo, tipoArchivo, urlArchivo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Archivo creado exitosamente");
            response.put("archivo", archivo);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Error al crear archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // GET /api/cursos-materiales/materiales/{idMaterial}/archivos
    @GetMapping("/{idMaterial}/archivos")
    public ResponseEntity<?> getArchivosByMaterial(@PathVariable Integer idMaterial) {
        try {
            System.out.println("=== OBTENIENDO ARCHIVOS PARA MATERIAL ===");
            System.out.println("idMaterial: " + idMaterial);
            
            var archivos = archivoService.getArchivosByMaterial(idMaterial);
            
            System.out.println("=== ARCHIVOS OBTENIDOS ===");
            System.out.println("Cantidad: " + archivos.size());
            archivos.forEach(a -> {
                System.out.println(" - ID: " + a.getIdArchivo());
                System.out.println(" - Título: " + a.getTitulo());
                System.out.println(" - Tipo: " + a.getTipoArchivo());
                System.out.println(" - URL: " + a.getUrlArchivo());
            });
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("archivos", archivos);
            
            System.out.println("=== CREANDO RESPUESTA JSON ===");
            System.out.println("Response map created");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== ERROR AL OBTENER ARCHIVOS ===");
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Error al obtener archivos: " + e.getMessage());
            response.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // DELETE /api/cursos-materiales/archivos/{idArchivo}
    @DeleteMapping("/archivos/{idArchivo}")
    public ResponseEntity<?> deleteArchivo(@PathVariable Integer idArchivo) {
        try {
            archivoService.deleteArchivo(idArchivo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Archivo eliminado exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Error al eliminar archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
