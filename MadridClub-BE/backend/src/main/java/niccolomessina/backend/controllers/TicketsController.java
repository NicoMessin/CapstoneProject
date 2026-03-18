package niccolomessina.backend.controllers;

import niccolomessina.backend.entities.Product;
import niccolomessina.backend.entities.Ticket;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.payloads.ProductsDTO;
import niccolomessina.backend.payloads.TicketsDTO;
import niccolomessina.backend.services.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tickets")
public class TicketsController {
    private final TicketService ticketService;

    public TicketsController(TicketService ticketService){
        this.ticketService= ticketService;
    }
    @GetMapping("")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket createTicket(@RequestBody @Validated TicketsDTO ticketsDTO, BindingResult validation, @AuthenticationPrincipal Utente utente) {
        if (validation.hasErrors()) {
            throw new IllegalArgumentException("Errore nei dati del ticket");
        }
        return ticketService.createTicket(ticketsDTO);
    }

    //GET TICKET PER ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Ticket getTicketById(@PathVariable UUID id){return ticketService.getTicketById(id);}

   //DELETE TICKET CON ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void  deleteTicket(@PathVariable UUID id){ticketService.deleteTicket(id);}

    //UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Ticket editTicket(@PathVariable UUID id, @RequestBody @Validated TicketsDTO payload) {
        return ticketService.updateTicket(id, payload);
    }

}
