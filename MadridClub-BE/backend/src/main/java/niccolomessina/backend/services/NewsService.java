package niccolomessina.backend.services;

import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.News;
import niccolomessina.backend.exceptions.NotFoundException;
import niccolomessina.backend.payloads.NewsDTO;
import niccolomessina.backend.repositories.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@Slf4j
public class NewsService {

    private final NewsRepository newsRepository;


    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    // CREA NEWS
    public News createNews(NewsDTO payload) {
        News nuovaNews = new News(
                payload.title(),
                payload.description(),
                payload.imageUrl(),
                payload.publishedAt()
        );
        return newsRepository.save(nuovaNews);
    }

    // CERCA NEWS PER ID
    public News getNewsById(UUID id) {

            return newsRepository.findById(id)
               .orElseThrow(() -> new NotFoundException(id));

    }

    // GET ALL NEWS
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    // DELETE NEWS
    public void deleteNews(UUID id) {
        News news = getNewsById(id);
        if (news != null) {
            newsRepository.delete(news);
        }
    }

    // MODIFICA NEWS
    public News updateNews(UUID id, NewsDTO payload) {
        // Cerco la news esistente
        News newsEsistente = getNewsById(id);

        // Aggiorno i campi
        newsEsistente.setTitle(payload.title());
        newsEsistente.setDescription(payload.description());
        newsEsistente.setImageUrl(payload.imageUrl());
        newsEsistente.setPublishedAt(payload.publishedAt());

        // Salvo le modifiche
        return newsRepository.save(newsEsistente);
    }
}