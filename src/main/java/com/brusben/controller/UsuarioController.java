package com.brusben.controller;

import com.brusben.dto.UsuarioDTO;
import com.brusben.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsers() {
        return ResponseEntity.ok(usuarioService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> createUser(@RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.createUser(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> updateUser(@PathVariable Integer id, @RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.updateUser(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        usuarioService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
