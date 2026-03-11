package niccolomessina.backend.repositories;

import niccolomessina.backend.entities.CarrelloTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CarrelloTicketRepository extends JpaRepository<CarrelloTicket, UUID> {
    List<CarrelloTicket> findByUtenteIdOrderByIdAsc(UUID id);
        void deleteAllByUtenteId(UUID id);
}
