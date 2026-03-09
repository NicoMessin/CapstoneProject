package niccolomessina.backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductsDTO (
    @NotBlank(message = "Il nome del prodotto è obbligatorio")
    String name_product,
    @NotBlank(message = "La descrizione del prodotto è obbligatoria")
    String description,
    @NotNull(message = "Il prezzo è obbligatorio")
    BigDecimal price,
    @NotBlank(message = "L'Url dell'immagine è obbligatorio")
    String imageUrl

    ){}
