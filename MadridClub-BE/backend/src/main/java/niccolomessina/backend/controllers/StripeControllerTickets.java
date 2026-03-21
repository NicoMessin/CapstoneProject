package niccolomessina.backend.controllers;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import niccolomessina.backend.entities.CarrelloTicket;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.repositories.UtenteRepository;
import niccolomessina.backend.services.CarrelloTicketService;
import niccolomessina.backend.services.EmailService;
import niccolomessina.backend.security.JWTTools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/stripe")
public class StripeControllerTickets {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Autowired
    private CarrelloTicketService carrelloTicketService;

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private EmailService emailService;

    /*** CREAZIONE CHECKOUT SESSION ***/
    @PostMapping("/checkout-tickets")
    public Map<String, String> checkoutTickets(
            @RequestBody List<Map<String, Object>> items,
            @RequestHeader("Authorization") String authHeader) throws Exception {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Utente non autenticato");
        }

        String token = authHeader.substring(7);
        UUID userId = jwtTools.getId(token);

        Utente utente = utenteRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        Stripe.apiKey = stripeSecretKey;

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (Map<String, Object> item : items) {
            String settore = item.get("settore").toString();
            Long price = Long.valueOf(item.get("price").toString());
            Long quantity = Long.valueOf(item.get("quantity").toString());
            String partita = item.get("partita").toString();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(quantity)
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    .setUnitAmount(price * 100)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName("Biglietto " + partita + " - " + settore)
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            lineItems.add(lineItem);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/success?type=tickets")
                .setCancelUrl("http://localhost:5173/carrelloTickets")
                .putMetadata("userId", utente.getId().toString())
                .addAllLineItem(lineItems)
                .build();

        Session session = Session.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());
        return response;
    }

    /*** WEBHOOK STRIPE ***/
    @PostMapping("/webhook")
    public ResponseEntity<String> stripeWebhook(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);

            System.out.println("EVENTO STRIPE: " + event.getType());

            if ("checkout.session.completed".equals(event.getType())) {

                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(payload);

                String sessionId = root
                        .path("data")
                        .path("object")
                        .path("id")
                        .asText();

                Session session = Session.retrieve(sessionId);

                String userId = session.getMetadata().get("userId");

                if (userId == null) {
                    System.out.println("❌ Metadata mancante");
                    return ResponseEntity.ok("No metadata");
                }

                Utente utente = utenteRepository.findById(UUID.fromString(userId))
                        .orElseThrow();

                List<CarrelloTicket> tickets = carrelloTicketService.findAllByUtente(utente.getId());

                System.out.println("TROVATI: " + tickets.size());

                if (tickets.isEmpty()) {
                    return ResponseEntity.ok("No tickets");
                }

                // Conferma acquisto
                carrelloTicketService.confermaAcquisto(tickets);

                // 👉 INVIO EMAIL
                emailService.sendEmail(
                        utente.getEmail(),
                        "Conferma acquisto biglietti",
                        "Acquisto completato! Grazie per il tuo ordine."
                );

                System.out.println("EMAIL CHIAMATA");
                System.out.println("✅ ACQUISTO COMPLETATO + EMAIL INVIATA");
            }

            return ResponseEntity.ok("Received");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }
}