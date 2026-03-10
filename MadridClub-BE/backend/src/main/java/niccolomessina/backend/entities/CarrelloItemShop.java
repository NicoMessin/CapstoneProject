package niccolomessina.backend.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name="Carrello_Items_shop")
public class CarrelloItemShop {
    @Id
    @GeneratedValue
    @Column(name="id_carrelloItemShop")
    private UUID id;
    private int quantita;
    @Enumerated(EnumType.STRING)
    private EnumTaglia enumTaglia;
    private BigDecimal totale;

    @ManyToOne
    @JoinColumn(name="utente_id")
    private Utente utente;

    @ManyToOne
    @JoinColumn(name="prodotto_id")
    private Product prodotto;

    public CarrelloItemShop(int quantita, EnumTaglia enumTaglia, Utente utente, Product prodotto){
        this.quantita= quantita;
        this.enumTaglia= enumTaglia;
        this.totale = prodotto.getPrice().multiply(BigDecimal.valueOf(quantita));
        this.utente= utente;
        this.prodotto= prodotto;
    }
    // Calcolo totale dinamico
    public void aggiornaTotale() {
        this.totale = prodotto.getPrice().multiply(BigDecimal.valueOf(quantita));
    }

}
