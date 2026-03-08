package niccolomessina.backend.services;

import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.Ticket;
import niccolomessina.backend.exceptions.NotFoundException;
import niccolomessina.backend.payloads.TicketsDTO;
import niccolomessina.backend.repositories.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository){
        this.ticketRepository= ticketRepository;
    }

    //CREA TICKETS
    public Ticket createTicket(TicketsDTO payload){
        Ticket nuovoTicket = new Ticket(
                payload.day(),
                payload.date(),
                payload.opponents(),
                payload.stadium()
        ) ;
        return ticketRepository.save(nuovoTicket);
    }

  // GET TUTTI BIGLIETTI
    public List<Ticket> getAllTickets(){ return ticketRepository.findAll();}

    // GET BY ID
    public Ticket getTicketById(UUID id){
      return ticketRepository.findById(id)
              .orElseThrow(() -> new NotFoundException(id));
    }



    //DELETE TICKET
    public void deleteTicket(UUID id){
        Ticket ticketDaEliminare= this.getTicketById(id);
                ticketRepository.delete(ticketDaEliminare);
    }

}
