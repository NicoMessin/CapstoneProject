package niccolomessina.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MatchesDTO (
        @NotBlank
        String casa,
        @NotBlank
        String trasferta,
        @NotNull
        LocalDate data
) {
}
