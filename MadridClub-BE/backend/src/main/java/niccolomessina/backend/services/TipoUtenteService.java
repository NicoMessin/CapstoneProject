package niccolomessina.backend.services;

import niccolomessina.backend.entities.TipoUtente;
import niccolomessina.backend.repositories.TipoUtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoUtenteService {
    @Autowired
    private TipoUtenteRepository tipoUtenteRepository;

    public TipoUtente save(TipoUtente tipoUtente) {
        this.tipoUtenteRepository.save(tipoUtente);
        return tipoUtente;
    }

}
