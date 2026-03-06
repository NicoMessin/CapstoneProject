package niccolomessina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import niccolomessina.backend.entities.Ticket;
import java.util.UUID;

public interface TicketRepository extends JpaRepository< Ticket, UUID> {
}
