package niccolomessina.backend.services;


import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.Product;
import niccolomessina.backend.exceptions.NotFoundException;
import niccolomessina.backend.payloads.ProductsDTO;
import niccolomessina.backend.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository= productRepository;
    }

    //SAVE PRODUCT

    public Product saveProduct(ProductsDTO payload){
    Product nuovoProduct= new Product(
            payload.name_product(), payload.description(), payload.price(), payload.imageUrl()
    );
    return productRepository.save(nuovoProduct);
    }

    //FIND ALL PRODUCTS
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    //GET PRODUCT BY ID
    public  Product getProductById(UUID id){
        return productRepository.findById(id)
         .orElseThrow(() -> new NotFoundException(id));
    }

    //DELETE PRODUCT
    public void deleteProduct(UUID id){
        Product productDaEliminare= this.getProductById(id);
        productRepository.delete(productDaEliminare);
    }

}
