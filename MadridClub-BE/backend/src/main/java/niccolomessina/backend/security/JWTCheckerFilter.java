package niccolomessina.backend.security;

import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.exceptions.UnauthorizedException;
import niccolomessina.backend.services.UtenteService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTCheckerFilter extends OncePerRequestFilter {
    private JWTTools jwtTools;
    private UtenteService utenteService;

    @Autowired
    public JWTCheckerFilter(JWTTools jwtTools, UtenteService utenteService) {
        this.jwtTools = jwtTools;
        this.utenteService = utenteService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) //deve iniziare con Baerer
            throw new UnauthorizedException("Sembra tu abbia perso la tua chiave d'accesso. Cerca nelle tasche!");
        String accessToken = authHeader.replace("Bearer ", ""); //rimuovo la parola baerer per avere solo JWT
        jwtTools.verifyToken(accessToken); //controllo firma scadenza e integrità

        // verify authorization
        Utente authUtente = this.utenteService.findById(jwtTools.getId(accessToken)); //carico l'utente ed estraggo UUID
        Authentication authentication = new UsernamePasswordAuthenticationToken(authUtente, null, authUtente.getAuthorities()); //oggetti per sapere i ruoli
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //*************************************
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath()); //su questa rotta non va controllato il token perchè chiunque deveentrare senza essere autenticato
    }
}
