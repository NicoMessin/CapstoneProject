package niccolomessina.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name="News")
public class News {

    @Id
    @GeneratedValue
    @Column(name = "id_news")
    private UUID id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime publishedAt;

    public News(String title, String description, String imageUrl, LocalDateTime publishedAt) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.publishedAt = publishedAt;
    }
}