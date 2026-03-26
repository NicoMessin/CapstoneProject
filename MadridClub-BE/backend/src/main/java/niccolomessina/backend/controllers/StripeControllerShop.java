package niccolomessina.backend.controllers;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.repositories.UtenteRepository;
import niccolomessina.backend.security.JWTTools;
import niccolomessina.backend.services.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/stripe")
public class StripeControllerShop {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private EmailService emailService;

    /*** CREAZIONE CHECKOUT SESSION PER PRODOTTI ***/
    @PostMapping("/checkout/shop")
    public Map<String, String> checkoutShop(
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
            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.get("quantity").toString()))
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    .setUnitAmount(Long.valueOf(item.get("price").toString()) * 100)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(item.get("name").toString())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();
            lineItems.add(lineItem);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/success?type=shop")
                .setCancelUrl("http://localhost:5173/carrelloItemsShop")
                .putMetadata("userId", utente.getId().toString()) // METADATA UTENTE
                .addAllLineItem(lineItems)
                .build();

        Session session = Session.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());
        return response;
    }

    /*** WEBHOOK STRIPE PER PRODOTTI ***/
    @PostMapping("/webhook-shop")
    public ResponseEntity<String> stripeWebhookShop(@RequestBody String payload,
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            System.out.println("EVENTO STRIPE SHOP: " + event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(payload);

                String sessionId = root.path("data").path("object").path("id").asText();
                Session session = Session.retrieve(sessionId);

                String userId = session.getMetadata().get("userId");
                if (userId == null) {
                    System.out.println(" Metadata mancante");
                    return ResponseEntity.ok("No metadata");
                }

                Utente utente = utenteRepository.findById(UUID.fromString(userId)).orElseThrow();

                // INVIO EMAIL DI CONFERMA
                emailService.sendEmail(
                        utente.getEmail(),
                        "Conferma acquisto prodotti",
                        "Acquisto completato! Grazie per il tuo ordine."
                );

                System.out.println("EMAIL INVIATA PER SHOP");
            }

            return ResponseEntity.ok("Received");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }
}