package niccolomessina.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record NewsDTO(
        @NotBlank(message = "Il titolo è obbligatorio")
        String title,

        @NotBlank(message = "La descrizione è obbligatoria")
        String description,

        @NotBlank(message = "L'URL dell'immagine è obbligatorio")
        String imageUrl,

        @NotNull(message = "La data di pubblicazione è obbligatoria")
        LocalDateTime publishedAt
) {
}