package niccolomessina.backend.repositories;

import niccolomessina.backend.entities.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MatchRepository extends JpaRepository<Match, UUID> {
}
