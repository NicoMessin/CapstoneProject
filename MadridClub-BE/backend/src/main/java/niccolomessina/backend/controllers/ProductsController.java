package niccolomessina.backend.controllers;


import niccolomessina.backend.entities.Product;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.payloads.ProductsDTO;
import niccolomessina.backend.services.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@Controller
@RequestMapping("/products")

public class ProductsController {
    private final ProductService productService;
    public ProductsController(ProductService productService){
        this.productService= productService;
    }

    //GET ALL
    @GetMapping("")
    public List<Product> getAllProducts (){
        return productService.getAllProducts();
    }

    //CREA PRODOTTO
    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Product saveProduct(@RequestBody @Validated ProductsDTO productsDTO, BindingResult validation, @AuthenticationPrincipal Utente utente){
        if (validation.hasErrors()){
            throw new IllegalArgumentException("Errore nei dati del prodotto");}
        return productService.saveProduct(productsDTO);

    }

    //GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Product getProductById(@PathVariable UUID id){
        return productService.getProductById(id);

    }

    //DELETE BY ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable UUID id){
        productService.deleteProduct(id);
    }

}
