package niccolomessina.backend.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name= "Carrello_tickets")
@Getter
@Setter
@ToString
public class CarrelloTicket {
    @Id
    @GeneratedValue
    @Column(name = "id_carrelloTicket")
    private UUID id;
    @Enumerated(EnumType.STRING)
    private EnumSettore enumSettore;
    @Enumerated(EnumType.STRING)
    private EnumFila enumFila;
    @Enumerated(EnumType.STRING)
    private EnumPosto enumPosto;
    @ManyToOne
    @JoinColumn(name="utente_id")
    private Utente utente;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    public CarrelloTicket(EnumSettore enumSettore, EnumFila enumFila, EnumPosto enumPosto, Utente utente, Ticket ticket){
        this.enumSettore= enumSettore;
        this.enumFila= enumFila;
        this.enumPosto= enumPosto;
        this.utente= utente;
        this.ticket= ticket;
    }
}
