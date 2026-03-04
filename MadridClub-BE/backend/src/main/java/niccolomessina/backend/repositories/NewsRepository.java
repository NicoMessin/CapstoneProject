package niccolomessina.backend.repositories;

import niccolomessina.backend.entities.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NewsRepository extends JpaRepository<News, UUID> {
}
