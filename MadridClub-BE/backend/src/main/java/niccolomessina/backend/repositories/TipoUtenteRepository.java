package niccolomessina.backend.repositories;

import niccolomessina.backend.entities.EnumTipoUtente;
import niccolomessina.backend.entities.TipoUtente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TipoUtenteRepository extends JpaRepository<TipoUtente, UUID> {


    Optional<TipoUtente> findByTipoUtente(EnumTipoUtente tipoUtente);

}