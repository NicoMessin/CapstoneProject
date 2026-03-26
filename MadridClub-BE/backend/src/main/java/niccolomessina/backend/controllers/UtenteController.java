package niccolomessina.backend.controllers;

import niccolomessina.backend.entities.News;
import niccolomessina.backend.entities.Ticket;
import niccolomessina.backend.entities.TipoUtente;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.payloads.NewsDTO;
import niccolomessina.backend.payloads.UtentiDTO;
import niccolomessina.backend.services.UtenteService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/utenti")
public class UtenteController {
    private final UtenteService utenteService;
    public UtenteController(UtenteService utenteService){
        this.utenteService= utenteService;
    }


    //SAVE NEW USER
    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Utente saveUtente(@RequestBody @Validated UtentiDTO utentiDTO,
                           BindingResult validation,
                           @AuthenticationPrincipal Utente utente) {
        if (validation.hasErrors()) {
            throw new IllegalArgumentException("Errore nei dati dell'utente");
        }
        return utenteService.saveUtente(utentiDTO);
    }


    //GET ALL
    @GetMapping("")
    public List<Utente> getAllUsers (){return utenteService.getAllUsers();}

    //GET TICKET PER ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Utente  findById(@PathVariable UUID id){return utenteService. findById(id);}

    //DELETE TICKET CON ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void  deleteTicket(@PathVariable UUID id){utenteService.deleteTicket(id);}

    //GET CON TIPO UTENTE
    @GetMapping("/tipo/{tipoUtente}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public TipoUtente findByTipoUtente(@PathVariable String tipoUtente) {
        return utenteService.findByTipoUtente(tipoUtente);
    }

    // TROVA UTENTE PER EMAIL
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Utente getUtenteByEmail(@PathVariable String email) {
        return utenteService.findByEmail(email);
    }

    //CAMBIA RUOLO UTENTE
    @PatchMapping("/{id}/modify-role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Utente modifyRole(@PathVariable UUID id) {
        return utenteService.modifyRole(id);
    }
}
