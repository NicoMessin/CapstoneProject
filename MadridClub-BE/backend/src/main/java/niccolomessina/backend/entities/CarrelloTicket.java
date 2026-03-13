package niccolomessina.backend.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name= "Carrello_tickets")
@Getter
@Setter
@ToString
@NoArgsConstructor
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

    private String nome;
    private String cognome;
    private LocalDate dataNascita;

    public CarrelloTicket(EnumSettore enumSettore, EnumFila enumFila, EnumPosto enumPosto, Utente utente, Ticket ticket,String nome, String cognome, LocalDate dataNascita){
        this.enumSettore= enumSettore;
        this.enumFila= enumFila;
        this.enumPosto= enumPosto;
        this.utente= utente;
        this.ticket= ticket;
        this.nome= nome;
        this.cognome= cognome;
        this.dataNascita= dataNascita;
    }



}
