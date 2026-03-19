package niccolomessina.backend.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.*;
import niccolomessina.backend.payloads.CarrelloTicketsDTO;
import niccolomessina.backend.repositories.CarrelloTicketRepository;
import niccolomessina.backend.repositories.TicketRepository;
import niccolomessina.backend.repositories.UtenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class CarrelloTicketService {

    private final CarrelloTicketRepository carrelloTicketRepository;
    private final TicketRepository ticketRepository;
    private final UtenteRepository utenteRepository;

    public CarrelloTicketService(CarrelloTicketRepository carrelloTicketRepository,
                                 TicketRepository ticketRepository,
                                 UtenteRepository utenteRepository) {
        this.carrelloTicketRepository = carrelloTicketRepository;
        this.ticketRepository = ticketRepository;
        this.utenteRepository = utenteRepository;
    }

    // SAVE
    public CarrelloTicket saveCarrelloTicket(CarrelloTicketsDTO payload, Utente utente) {

        Ticket ticket = ticketRepository.findById(payload.ticketId())
                .orElseThrow(() -> new IllegalArgumentException("Ticket non trovato"));

        // controllo posto già acquistato
        boolean postoGiaOccupato = carrelloTicketRepository
                .existsByTicketIdAndEnumSettoreAndEnumFilaAndEnumPosto(
                        ticket.getId(),
                        payload.enumSettore(),
                        payload.enumFila(),
                        payload.enumPosto()
                );
        if (postoGiaOccupato) {
            throw new IllegalArgumentException("Biglietto già prenotato per questo posto");
        }

        CarrelloTicket ct = new CarrelloTicket();

        ct.setTicket(ticket);
        ct.setUtente(utente);
        ct.setEnumSettore(payload.enumSettore());
        ct.setEnumFila(payload.enumFila());
        ct.setEnumPosto(payload.enumPosto());

        // FIX fondamentale
        ct.setAcquistato(false);

        ct.setNome(payload.nome());
        ct.setCognome(payload.cognome());
        ct.setDataNascita(payload.dataNascita());

        return carrelloTicketRepository.save(ct);
    }

    // FIND CARRELLO UTENTE
    public List<CarrelloTicket> findUtenteCarrelloTickets(UUID id) {
        return carrelloTicketRepository.findByUtenteIdOrderByIdAsc(id);
    }

    // DELETE SINGOLO
    public void deleteCarrelloTicket(UUID id) {
        carrelloTicketRepository.deleteById(id);
    }

    // UPDATE POSTO
    public CarrelloTicket aggiornaTicket(UUID id, EnumSettore enumSettore, EnumFila enumFila, EnumPosto enumPosto) {
        CarrelloTicket ticket = carrelloTicketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item non trovato"));

        ticket.setEnumSettore(enumSettore);
        ticket.setEnumFila(enumFila);
        ticket.setEnumPosto(enumPosto);

        return carrelloTicketRepository.save(ticket);
    }

    // SVUOTA CARRELLO
    @Transactional
    public void svuotaCarrello(Utente utente) {
        carrelloTicketRepository.deleteAllByUtenteId(utente.getId());
    }

    // POSTI OCCUPATI (solo acquistati)
    public List<CarrelloTicket> findPostiOccupati(UUID ticketId) {
        return carrelloTicketRepository.findByTicketIdAndAcquistatoTrue(ticketId);
    }

    // AGGIORNA INFO UTENTE
    public CarrelloTicket aggiornaInfo(UUID id, CarrelloTicketsDTO dto) {
        CarrelloTicket ticket = carrelloTicketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item non trovato"));

        if (dto.nome() != null) ticket.setNome(dto.nome());
        if (dto.cognome() != null) ticket.setCognome(dto.cognome());
        if (dto.dataNascita() != null) ticket.setDataNascita(dto.dataNascita());

        return carrelloTicketRepository.save(ticket);
    }

    // CONFERMA ACQUISTO
    @Transactional
    public List<CarrelloTicket> confermaAcquisto(List<CarrelloTicket> carrello) {
        return carrello.stream().map(ticket -> {
            ticket.setAcquistato(true);
            return carrelloTicketRepository.save(ticket);
        }).toList();
    }

    // TICKET ACQUISTATI UTENTE
    public List<CarrelloTicket> findAcquistatiUtente(UUID userId) {
        return carrelloTicketRepository.findByUtente_IdAndAcquistatoTrue(userId);
    }

    // TUTTI I TICKET UTENTE
    public List<CarrelloTicket> findAllByUtente(UUID userId) {
        return carrelloTicketRepository.findByUtenteId(userId);
    }

    public List<CarrelloTicket> findPostiOccupatiDettaglio(UUID ticketId) {
        return carrelloTicketRepository.findByTicketIdAndAcquistatoTrue(ticketId);
    }
}