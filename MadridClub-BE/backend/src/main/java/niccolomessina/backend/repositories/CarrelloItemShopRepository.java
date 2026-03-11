package niccolomessina.backend.repositories;

import niccolomessina.backend.entities.CarrelloItemShop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CarrelloItemShopRepository extends JpaRepository<CarrelloItemShop, UUID> {
    List<CarrelloItemShop> findByUtenteIdOrderByIdAsc(UUID id);
    void deleteAllByUtenteId(UUID utenteId);}
