package niccolomessina.backend.repositories;

import niccolomessina.backend.entities.CarrelloTicket;
import niccolomessina.backend.entities.EnumFila;
import niccolomessina.backend.entities.EnumPosto;
import niccolomessina.backend.entities.EnumSettore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CarrelloTicketRepository extends JpaRepository<CarrelloTicket, UUID> {
    List<CarrelloTicket> findByUtenteIdOrderByIdAsc(UUID id);

    void deleteAllByUtenteId(UUID id);
    List<CarrelloTicket> findByTicketId(UUID ticketId);

    List<CarrelloTicket> findByUtenteId(UUID utenteId);
    List<CarrelloTicket> findByUtente_IdAndAcquistatoTrue(UUID userId);

    List<CarrelloTicket> findByTicketIdAndAcquistatoTrue(UUID ticketId);

    boolean existsByTicketIdAndEnumSettoreAndEnumFilaAndEnumPosto(
            UUID ticketId, EnumSettore settore, EnumFila fila, EnumPosto posto

    );


}