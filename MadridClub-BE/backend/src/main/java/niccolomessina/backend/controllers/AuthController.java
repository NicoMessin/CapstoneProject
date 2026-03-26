package niccolomessina.backend.controllers;

import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.exceptions.ValidationException;
import niccolomessina.backend.payloads.LoginDTO;
import niccolomessina.backend.payloads.LoginResponseDTO;
import niccolomessina.backend.payloads.UtentiDTO;
import niccolomessina.backend.services.AuthService;
import niccolomessina.backend.services.EmailService;
import niccolomessina.backend.services.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UtenteService utenteService;
    @Autowired
    private EmailService emailService;

    @Autowired
    public AuthController(AuthService authService, UtenteService utenteService) {
        this.authService = authService;
        this.utenteService = utenteService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginDTO body) {
        return new LoginResponseDTO(this.authService.checkCredentialAndGenerateToken(body));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Utente createUtente(@RequestBody @Validated UtentiDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            List<String> errorList = validationResult.getFieldErrors()
                    .stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();

            throw new ValidationException(errorList);
        } 
           Utente utente = this.utenteService.saveUtente(payload);
            // INVIO EMAIL
            String subject = "Benvenuto su MyApp!";
            String text = "Ciao " + utente.getNome() + ", Grazie per esserti registrato!";

            try {
                emailService.sendEmail(utente.getEmail(), subject, text);
                System.out.println("EMAIL DI BENVENUTO INVIATA A: " + utente.getEmail());
            } catch (Exception e) {
                System.out.println(" ERRORE INVIO EMAIL DI BENVENUTO");
                e.printStackTrace();
            }

            return utente;

    }
    @GetMapping("/me")
    public UtentiDTO getCurrentUser(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return new UtentiDTO(
                    null,
                    null,
                    null,
                    null,
                    null,
                    "NON_LOGGATO"
            );
        }

        Utente utente = (Utente) authentication.getPrincipal();

        return new UtentiDTO(
                utente.getUsername(),
                utente.getEmail(),
                null,
                utente.getNome(),
                utente.getCognome(),
                utente.getTipoUtente().getTipoUtente().name()
        );
    }


}
