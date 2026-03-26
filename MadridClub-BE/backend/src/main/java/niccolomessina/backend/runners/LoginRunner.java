package niccolomessina.backend.runners;


import niccolomessina.backend.entities.EnumTipoUtente;

import niccolomessina.backend.entities.TipoUtente;
import niccolomessina.backend.payloads.UtentiDTO;

import niccolomessina.backend.services.TipoUtenteService;
import niccolomessina.backend.services.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class LoginRunner implements CommandLineRunner {
    @Autowired
    private UtenteService utenteService;
    @Autowired
    private TipoUtenteService tipoUtenteService;

    @Value("${PASS}")
    private String secret;

    public void run(String... args) throws Exception {

        // DA RUNNARE UNA VOLTA
      // TipoUtente admin = new TipoUtente(EnumTipoUtente.ADMIN);
        //tipoUtenteService.save(admin);
      //  TipoUtente user = new TipoUtente(EnumTipoUtente.USER);
      // tipoUtenteService.save(user);
        // DA RUNNARE UNA VOLTA
       // UtentiDTO Admin = new UtentiDTO("admino", "admino01@email.com",
         //      secret, "Admin", "First", "ADMIN");
       //utenteService.saveUtente(Admin);
        //UtentiDTO userino = new UtentiDTO("userino", "userino@email.com",
        //secret, "Eva", "Mela", "USER");
        //utenteService.saveUtente(userino);


    }

}
