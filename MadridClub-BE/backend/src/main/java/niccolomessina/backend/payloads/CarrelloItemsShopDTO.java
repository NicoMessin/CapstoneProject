package niccolomessina.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import niccolomessina.backend.entities.EnumTaglia;

import java.math.BigDecimal;
import java.util.UUID;

public record CarrelloItemsShopDTO (
        @NotNull(message = "La quantità è obbligatoria")
        int quantita,
        @NotNull(message = "La taglia è obbligatoria")
        EnumTaglia enumTaglia,

        @NotNull(message = "L'id del prodotto è obbligatorio")
        UUID prodottoId


){
}
