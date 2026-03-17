package niccolomessina.backend.controllers;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.util.*;

@RestController
@RequestMapping("/stripe")
public class StripeControllerTickets {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/checkout-tickets")
    public Map<String, String> checkoutTickets(@RequestBody List<Map<String, Object>> items) throws Exception {

        Stripe.apiKey = stripeSecretKey;

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (Map<String, Object> item : items) {

            String settore = item.get("settore").toString();
            Long price = Long.valueOf(item.get("price").toString());
            Long quantity = Long.valueOf(item.get("quantity").toString());
            String partita = item.get("partita").toString();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
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

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:5173/success?type=tickets")
                        .setCancelUrl("http://localhost:5173/carrelloTickets")
                        .addAllLineItem(lineItems)
                        .build();

        Session session = Session.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());

        return response;


    }

    
}