package niccolomessina.backend.payloads;
import jakarta.validation.constraints.NotNull;
import niccolomessina.backend.entities.EnumFila;
import niccolomessina.backend.entities.EnumPosto;
import niccolomessina.backend.entities.EnumSettore;

import java.util.UUID;

public record CarrelloTicketsDTO (
        @NotNull(message = "Il settore è obbligatorio")
        EnumSettore enumSettore,
        @NotNull(message = "La fila è obbligatoria")
        EnumFila enumFila,
        @NotNull(message = "Il posto è obbligatorio")
        EnumPosto enumPosto,
        @NotNull(message = "L'id del ticket è obbligatorio")
        UUID ticketId
) {

}
