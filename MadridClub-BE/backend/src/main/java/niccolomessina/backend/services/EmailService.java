package niccolomessina.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.util.*;

import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class EmailService {

    @Value("${mailgun.apiKey}")
    private String apiKey;

    @Value("${mailgun.domain}")
    private String domain;

    public void sendEmail(String to, String subject, String text) {

        try {
            System.out.println("=== INVIO EMAIL ===");
            System.out.println("TO: " + to);
            System.out.println("DOMAIN: " + domain);

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();

            // AUTH
            String auth = "api:" + apiKey;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes());
            headers.set("Authorization", "Basic " + new String(encodedAuth));

            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("from", "Mailgun Sandbox <postmaster@" + domain + ">");
            body.add("to", to);
            body.add("subject", subject);
            body.add("text", text);

            HttpEntity<MultiValueMap<String, String>> request =
                    new HttpEntity<>(body, headers);

            String response = restTemplate.postForObject(
                    "https://api.mailgun.net/v3/" + domain + "/messages",
                    request,
                    String.class
            );

            System.out.println("RISPOSTA MAILGUN: " + response);
            System.out.println("EMAIL INVIATA");

        } catch (Exception e) {
            System.out.println("❌ ERRORE INVIO EMAIL");
            e.printStackTrace();
        }
    }
}