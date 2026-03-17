package niccolomessina.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "utenti")
@NoArgsConstructor
@Getter
@Setter
public class Utente implements UserDetails {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;

    private String nome;
    private String cognome;
    private String avatar;

    @ManyToOne
    @JoinColumn(name = "tipo_utenti", nullable = false)
    private TipoUtente tipoUtente;
    private String ruolo;


    public Utente(String username, String email, String password,
                  String nome, String cognome, TipoUtente tipoUtente) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.tipoUtente = tipoUtente;
        this.ruolo = tipoUtente.getTipoUtente().toString();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(tipoUtente.getTipoUtente().name()));
    }
}