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

    //OCCUPATI
    @GetMapping("/occupati/{ticketId}")
    public List<CarrelloTicket> postiOccupati(@PathVariable UUID ticketId){
        return carrelloTicketService.findPostiOccupati(ticketId);
    }

    @GetMapping("/postiDisponibili/{ticketId}")
    public List<String> postiDisponibili(@PathVariable UUID ticketId) {
        List<CarrelloTicket> occupati = carrelloTicketService.findPostiOccupati(ticketId);
        List<String> postiTutti = List.of("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R");

        // Filtra i posti occupati
        return postiTutti.stream()
                .filter(posto -> occupati.stream()
                        .noneMatch(c -> c.getEnumPosto().name().equals(posto)))
                .toList();
    }

    @PutMapping("/updateInfo/{id}")
    public CarrelloTicket aggiornaInfo(@PathVariable UUID id, @RequestBody CarrelloTicketsDTO dto) {
        return carrelloTicketService.aggiornaInfo(id, dto);
    }




    // Restituisce solo i ticket acquistati per MyTickets
    @GetMapping("/mieiTickets")
    public List<CarrelloTicket> getMieiTickets(@AuthenticationPrincipal Utente utente){
        return carrelloTicketService.findAcquistatiUtente(utente.getId());
    }
    @PostMapping("/conferma-acquisto")
    public List<CarrelloTicket> confermaAcquisto(@AuthenticationPrincipal Utente utente) {
        return carrelloTicketService.confermaAcquisto(
                carrelloTicketService.findUtenteCarrelloTickets(utente.getId())
        );
    }

    @GetMapping("/postiOccupatiDettaglio/{ticketId}")
    public List<CarrelloTicket> postiOccupatiDettaglio(@PathVariable UUID ticketId){
        return carrelloTicketService.findPostiOccupatiDettaglio(ticketId);
    }
}
