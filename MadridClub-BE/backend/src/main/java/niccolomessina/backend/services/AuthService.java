package niccolomessina.backend.services;

import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.exceptions.UnauthorizedException;
import niccolomessina.backend.payloads.LoginDTO;
import niccolomessina.backend.security.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UtenteService utenteService;
    private final JWTTools jwtTools;
    private final PasswordEncoder bcrypt;

    @Autowired
    public AuthService(UtenteService utenteService, JWTTools jwtTools, PasswordEncoder bcrypt) {
        this.utenteService = utenteService;
        this.jwtTools = jwtTools;
        this.bcrypt = bcrypt;
    }

    public String checkCredentialAndGenerateToken(LoginDTO body){
        Utente found = this.utenteService.findByEmail(body.email());

        if(bcrypt.matches(body.password(), found.getPassword())){
            String accessToken = jwtTools.generateToken(found);
            return accessToken;
        } else {
            throw new UnauthorizedException("Le tue credenziali sono errate!");
        }
    }
}