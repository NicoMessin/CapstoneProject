package niccolomessina.backend.services;


import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.CarrelloItemShop;
import niccolomessina.backend.entities.EnumTaglia;
import niccolomessina.backend.entities.Product;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.payloads.CarrelloItemsShopDTO;
import niccolomessina.backend.repositories.CarrelloItemShopRepository;
import niccolomessina.backend.repositories.ProductRepository;
import niccolomessina.backend.repositories.UtenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class CarrelloItemShopService {
    private final CarrelloItemShopRepository carrelloItemShopRepository;
    private final UtenteRepository utenteRepository;
    private final ProductRepository productRepository;
    public CarrelloItemShopService(CarrelloItemShopRepository carrelloItemShopRepository,  UtenteRepository utenteRepository, ProductRepository productRepository){
        this.carrelloItemShopRepository= carrelloItemShopRepository;
        this.utenteRepository = utenteRepository;
        this.productRepository = productRepository;
    }

    //SAVE
    public CarrelloItemShop saveCarrelloItem(CarrelloItemsShopDTO payload, Utente utente){
    // recupero Utente e Prodotto dal DB


    Product prodotto = productRepository.findById(payload.prodottoId())
            .orElseThrow(() -> new IllegalArgumentException("Prodotto non trovato"));

     CarrelloItemShop nuovoCarrelloItemShop= new CarrelloItemShop(
                payload.quantita(), payload.enumTaglia(), utente, prodotto
        );
        return carrelloItemShopRepository.save(nuovoCarrelloItemShop);
    }


    //FIND ALL PER MOSTRARE GLI ITEM DELL'UTENTE
    public List <CarrelloItemShop> findUtenteCarrelloItemShop(UUID id){
        return carrelloItemShopRepository.findByUtenteIdOrderByIdAsc(id);
    }

//DELETE
    public void deleteCarrelloItemShopById(UUID id){
        carrelloItemShopRepository.deleteById(id);
    }

    //PER AGGIORNARE
    public CarrelloItemShop aggiornaItem(UUID id, int quantita, EnumTaglia taglia){
        CarrelloItemShop item = carrelloItemShopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item non trovato"));
        item.setQuantita(quantita);
        item.setEnumTaglia(taglia);
        item.aggiornaTotale();
        return carrelloItemShopRepository.save(item);
    }
}
