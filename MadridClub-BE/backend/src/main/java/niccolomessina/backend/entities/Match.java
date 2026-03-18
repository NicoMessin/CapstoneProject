package niccolomessina.backend.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "Matches")
public class Match {
    @Id
    @GeneratedValue
    @Column(name= "id_match")
    private UUID id ;
    private String casa;
    private String trasferta;
    LocalDate data;

    public Match(String casa, String trasferta, LocalDate data){
        this.casa= casa;
        this.trasferta= trasferta;
        this.data= data;
    }
}
