package niccolomessina.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name="tipo_utenti")
public class TipoUtente {
    @Id
    @GeneratedValue
    private UUID  id_tipo_utente;
    @Enumerated(EnumType.STRING)
    private EnumTipoUtente tipoUtente;
    public TipoUtente (EnumTipoUtente tipoUtente){
        this.tipoUtente= tipoUtente;
    }

}
