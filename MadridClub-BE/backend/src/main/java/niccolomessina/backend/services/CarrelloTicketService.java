package niccolomessina.backend.services;


import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.*;
import niccolomessina.backend.payloads.CarrelloTicketsDTO;
import niccolomessina.backend.repositories.CarrelloTicketRepository;
import niccolomessina.backend.repositories.TicketRepository;
import niccolomessina.backend.repositories.UtenteRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class CarrelloTicketService {
    private final CarrelloTicketRepository carrelloTicketRepository;
    private final TicketRepository ticketRepository;
    private final UtenteRepository utenteRepository;
    public CarrelloTicketService(CarrelloTicketRepository carrelloTicketRepository, TicketRepository ticketRepository,UtenteRepository utenteRepository){
        this.carrelloTicketRepository= carrelloTicketRepository;
        this.ticketRepository= ticketRepository;
        this.utenteRepository= utenteRepository;}

        //SAVE
        public CarrelloTicket saveCarrelloTicket(CarrelloTicketsDTO payload, Utente utente) {
            Ticket ticket = ticketRepository.findById(payload.ticketId())
            .orElseThrow(() -> new IllegalArgumentException("Ticket non trovato"));

            // CONTROLLO SE TICKET GIA' PRESO QUEL POSTO PRECISO
            boolean postoGiaPrenotato = carrelloTicketRepository.existsByTicketIdAndEnumSettoreAndEnumFilaAndEnumPosto(
                    ticket.getId(),
                    payload.enumSettore(),
                    payload.enumFila(),
                    payload.enumPosto()
            );

            if (postoGiaPrenotato) {
                throw new IllegalArgumentException("Biglietto già prenotato per questo posto");
            }


            // CALCOLO PREZZO IN BASE AL SETTORE
            BigDecimal prezzo = ticket.getPrezzoBySettore(payload.enumSettore());

            CarrelloTicket nuovoCarrelloTicket = new CarrelloTicket(payload.enumSettore(), payload.enumFila(), payload.enumPosto(), utente, ticket);
            return  carrelloTicketRepository.save(nuovoCarrelloTicket);
    }

    //FIND ALL PER MOSTRARE I TICKET DELL'UTENTE
    public List<CarrelloTicket> findUtenteCarrelloTickets(UUID id){
        return carrelloTicketRepository.findByUtenteIdOrderByIdAsc(id);
    }

    //DELETE
    public void  deleteCarrelloTicket(UUID id){ carrelloTicketRepository.deleteById(id);}

    //PER AGGIORNARE
   public CarrelloTicket aggiornaTicket(UUID id, EnumSettore enumSettore, EnumFila enumFila, EnumPosto enumPosto){
        CarrelloTicket ticket= carrelloTicketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item non trovato"));
        ticket.setEnumSettore(enumSettore);
        ticket.setEnumFila(enumFila);
        ticket.setEnumPosto(enumPosto);
        return carrelloTicketRepository.save(ticket);
   }
   //SVUOTA TUTTO IL CARRELLO
    @Transactional
    public void  svuotaCarrello(Utente utente){
        carrelloTicketRepository.deleteAllByUtenteId(utente.getId());
    }


    //POSTI OCCUPATI
    public List<CarrelloTicket> findPostiOccupati(UUID ticketId){
        return carrelloTicketRepository.findByTicketId(ticketId);
    }


}
