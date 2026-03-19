package niccolomessina.backend.controllers;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import niccolomessina.backend.entities.CarrelloTicket;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.repositories.UtenteRepository;
import niccolomessina.backend.services.CarrelloTicketService;
import niccolomessina.backend.security.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    /*** CREAZIONE CHECKOUT SESSION ***/
    @PostMapping("/checkout-tickets")
    public Map<String, String> checkoutTickets(
            @RequestBody List<Map<String, Object>> items,
            @RequestHeader("Authorization") String authHeader) throws Exception {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Utente non autenticato");
        }

        // Estrazione token JWT
        String token = authHeader.substring(7); // rimuove "Bearer "
        UUID userId = jwtTools.getId(token);

        // Recupero utente
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
                .putMetadata("userId", utente.getId().toString()) // fondamentale per il webhook
                .addAllLineItem(lineItems)
                .build();

        Session session = Session.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());
        return response;
    }

    /*** WEBHOOK STRIPE: CONFERMA ACQUISTO TICKET ***/

    @PostMapping("/webhook")
    public ResponseEntity<String> stripeWebhook(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);

            System.out.println("Evento: " + event.getType());

            if ("checkout.session.completed".equals(event.getType())) {

                // Recupero sessionId dal payload
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(payload);

                String sessionId = root
                        .path("data")
                        .path("object")
                        .path("id")
                        .asText();

                // Recupero session completa da Stripe
                Session session = Session.retrieve(sessionId);

                // Metadata
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

                carrelloTicketService.confermaAcquisto(tickets);


                System.out.println("✅ ACQUISTO COMPLETATO");
            }

            return ResponseEntity.ok("Received");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }}