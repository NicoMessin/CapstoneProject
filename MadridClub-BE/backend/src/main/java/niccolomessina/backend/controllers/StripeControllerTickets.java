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
        System.out.println("🚀 Webhook ricevuto!");
        System.out.println("Payload: " + payload);
        System.out.println("Stripe-Signature: " + sigHeader);

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            System.out.println("Event type: " + event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                // Deserializza session
                Session session;
                try {
                    session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();
                } catch (Exception e) {
                    session = (Session) event.getDataObjectDeserializer()
                            .getObject()
                            .orElseThrow(() -> new IllegalArgumentException("Sessione non valida"));
                }

                // Recupera ID utente dai metadata
                String userId = session.getMetadata().get("userId");
                System.out.println("UserId dal webhook: " + userId);

                Utente utente = utenteRepository.findById(UUID.fromString(userId))
                        .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

                List<CarrelloTicket> carrello = carrelloTicketService.findUtenteCarrelloTickets(utente.getId());
                System.out.println("Carrello trovato: " + carrello.size() + " ticket");

                carrelloTicketService.confermaAcquisto(carrello);
                System.out.println("✅ Ticket confermati come acquistati");
            }

            return ResponseEntity.ok("Received");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }
}