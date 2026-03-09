package niccolomessina.backend.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Setter
@ToString
@Table(name="Products")
public class Product {
    @Id
    @GeneratedValue
    @Column(name="id_product")
    private UUID id;
    private String name_product;
    private String description;
    private BigDecimal price;
    private String imageUrl;

    public Product( String name_product, String description, BigDecimal price, String imageUrl){
        this.name_product= name_product;
        this.description= description;
        this.price= price;
        this.imageUrl= imageUrl;

    }
}
