package niccolomessina.backend.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UtentiDTO(

        @NotBlank(message = "Username obbligatorio")
        String username,

        @Email(message = "Email non valida")
        @NotBlank(message = "Email obbligatoria")
        String email,
        @NotBlank
        String password,
        String nome,
        String cognome,
        String tipoUtente

) {
}