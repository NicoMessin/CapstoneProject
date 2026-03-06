package niccolomessina.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name="Tickets")
public class Ticket {
    @Id
    @GeneratedValue
    @Column(name="id_ticket")
    private UUID id;
    private String day;
    private LocalDateTime date;
    private String opponents;
    private String stadium;

    public  Ticket(String day, LocalDateTime date, String opponents, String stadium){
        this.day= day;
        this.date= date;
        this.opponents= opponents;
        this.stadium = stadium;
    }
}
