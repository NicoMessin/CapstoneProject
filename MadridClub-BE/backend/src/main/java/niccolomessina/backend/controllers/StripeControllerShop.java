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
import niccolomessina.backend.services.CarrelloItemShopService;
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


}