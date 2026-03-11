package niccolomessina.backend.controllers;


import niccolomessina.backend.entities.CarrelloItemShop;
import niccolomessina.backend.entities.EnumTaglia;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.payloads.CarrelloItemsShopDTO;
import niccolomessina.backend.payloads.TicketsDTO;
import niccolomessina.backend.services.CarrelloItemShopService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/carrelloItemsShop")
public class CarrelloItemsShopController {

        private final CarrelloItemShopService carrelloItemShopService;

        public CarrelloItemsShopController(CarrelloItemShopService carrelloItemShopService) {
            this.carrelloItemShopService = carrelloItemShopService;
        }

        //AGGIUNGI ITEM
        @PostMapping("")
        @ResponseStatus(HttpStatus.CREATED)
        public CarrelloItemShop addItem(@RequestBody @Validated CarrelloItemsShopDTO carrelloItemsShopDTO, BindingResult validation, @AuthenticationPrincipal Utente utente) {
            if (validation.hasErrors()){
                throw new IllegalArgumentException("Errore nei dati del prodotto");}
            return carrelloItemShopService.saveCarrelloItem(carrelloItemsShopDTO, utente);

        }


        //OTTENGO TUTTI GLI ITEM DI UN UTENTE
        @GetMapping("/mio")
        public List<CarrelloItemShop> getMyCart(@AuthenticationPrincipal Utente utente) {
            return carrelloItemShopService.findUtenteCarrelloItemShop(utente.getId());
        }

        //PER SVUOTARE IL CARRELLO
    @DeleteMapping("/mio")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void svuotaCarrello(@AuthenticationPrincipal Utente utente) {
        carrelloItemShopService.svuotaCarrello(utente);
    }

    //AGGIORNA ITEM
    @PutMapping("/{id}")
    public CarrelloItemShop updateItem(@PathVariable UUID id,
                                       @RequestParam int quantita,
                                       @RequestParam EnumTaglia taglia) {

        if (quantita <= 0) {
            throw new IllegalArgumentException("La quantità deve essere almeno 1");
        }

        return carrelloItemShopService.aggiornaItem(id, quantita, taglia);
    }

    // Elimina un item
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable UUID id) {
        carrelloItemShopService.deleteCarrelloItemShopById(id);
    }

    }
