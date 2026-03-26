package niccolomessina.backend.services;

import niccolomessina.backend.entities.EnumTipoUtente;
import niccolomessina.backend.entities.TipoUtente;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.exceptions.NotFoundException;
import niccolomessina.backend.payloads.UtentiDTO;
import niccolomessina.backend.repositories.TipoUtenteRepository;
import niccolomessina.backend.repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final TipoUtenteRepository tipoUtenteRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UtenteService(UtenteRepository utenteRepository, TipoUtenteRepository tipoUtenteRepository, PasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.tipoUtenteRepository = tipoUtenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utente> getAllUsers(){return utenteRepository.findAll();}


    public Utente findById(UUID id) {
        return utenteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(id));
    }

    public TipoUtente findByTipoUtente(String tipoUtente) {
        return tipoUtenteRepository.findByTipoUtente(EnumTipoUtente.valueOf(tipoUtente)).orElseThrow(() -> new NotFoundException(tipoUtente));
    }

    public Utente findByEmail(String email) {
        return utenteRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
    }

    public Utente saveUtente(UtentiDTO payload) {
        if (utenteRepository.findByEmail(payload.email()).isPresent()) {
            throw new IllegalArgumentException("Email già registrata");
        }
        if (utenteRepository.findByUsername(payload.username()).isPresent()) {
            throw new IllegalArgumentException("Username già utilizzato");
        }


        if (payload.password().length() < 6) {
            throw new IllegalArgumentException("La password deve essere lunga almeno 6 caratteri");
        }

        TipoUtente tipoUtente = this.findByTipoUtente(payload.tipoUtente());

        Utente nuovoUtente = new Utente(
                payload.username(),
                payload.email(),
                passwordEncoder.encode(payload.password()),
                payload.nome(),
                payload.cognome(),
                tipoUtente
        );

        return utenteRepository.save(nuovoUtente);
    }
    public void  deleteTicket(UUID id){
        Utente utenteDaEliminare = this.findById(id);
        utenteRepository.delete(utenteDaEliminare);
    }

    //MODIFICA RUOLO
    public Utente modifyRole(UUID id) {
        Utente utente = findById(id);


        EnumTipoUtente nuovoRuolo = utente.getTipoUtente().getTipoUtente() == EnumTipoUtente.ADMIN
                ? EnumTipoUtente.USER
                : EnumTipoUtente.ADMIN;


        TipoUtente tipoUtenteEntity = tipoUtenteRepository.findByTipoUtente(nuovoRuolo)
                .orElseThrow(() -> new NotFoundException(nuovoRuolo.name()));


        utente.setTipoUtente(tipoUtenteEntity);
        utente.setRuolo(nuovoRuolo.name());


        return utenteRepository.save(utente);
    }

}