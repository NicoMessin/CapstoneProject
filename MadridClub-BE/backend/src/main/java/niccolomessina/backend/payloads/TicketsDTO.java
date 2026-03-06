package niccolomessina.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record TicketsDTO (
        @NotBlank(message="La giornata è obbligatoria")
        String day,
        @NotNull(message = "La data è obbligatoria")
        LocalDateTime date,
        @NotBlank(message = "Gli avversari sono obbligatori")
        String opponents,
         @NotBlank(message = "Lo stadio è obbligatorio")
                String stadium
) {
}
