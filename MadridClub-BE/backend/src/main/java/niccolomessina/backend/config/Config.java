package niccolomessina.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class Config {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())      // CSRF disabilitato in Spring Security 6+
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // tutte le richieste permesse

        return http.build();
    }
}
