package niccolomessina.backend.controllers;


import niccolomessina.backend.entities.*;
import niccolomessina.backend.payloads.CarrelloTicketsDTO;
import niccolomessina.backend.repositories.CarrelloTicketRepository;
import niccolomessina.backend.services.CarrelloTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/carrelloTickets")
public class CarrelloTicketsController {
    private final CarrelloTicketService carrelloTicketService;
    public  CarrelloTicketsController(CarrelloTicketService carrelloTicketService){
        this.carrelloTicketService= carrelloTicketService;
    }

    //AGGIUNGI TICKET
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public CarrelloTicket addTicket (@RequestBody @Validated CarrelloTicketsDTO carrelloTicketsDTO, BindingResult validation, @AuthenticationPrincipal Utente utente)
    {if (validation.hasErrors()){
        throw new IllegalArgumentException("Errore nei dati del ticket");}
        return carrelloTicketService.saveCarrelloTicket(carrelloTicketsDTO, utente);
}

//OTTENTO IL CARRELLO DELL'UTENTE
@GetMapping("/mio")
    public List<CarrelloTicket> getMioCarrello(@AuthenticationPrincipal Utente utente){
        return carrelloTicketService.findUtenteCarrelloTickets(utente.getId());
}

//SVUOTARE IL CARRELLO
    @DeleteMapping("/mio")
    public void svuotaCarrello (@AuthenticationPrincipal Utente utente){
        carrelloTicketService.svuotaCarrello(utente);
    }

    //AGGIORNA TICKET
    @PutMapping("{id}")
    public  CarrelloTicket updateTicket(@PathVariable UUID id, @RequestParam EnumSettore enumSettore, @RequestParam EnumFila enumFila, @RequestParam EnumPosto enumPosto)
    {
        return carrelloTicketService.aggiornaTicket(id, enumSettore, enumFila, enumPosto);

    }

    //ELIMINA UN TICKET
    @DeleteMapping("/{id}")
    public void eliminaTicket (@PathVariable UUID id){ carrelloTicketService.deleteCarrelloTicket(id);}
}
