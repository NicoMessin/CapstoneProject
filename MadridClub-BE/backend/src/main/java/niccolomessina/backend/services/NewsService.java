package niccolomessina.backend.services;

import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.News;
import niccolomessina.backend.payloads.NewsDTO;
import niccolomessina.backend.repositories.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
        Optional<News> news = newsRepository.findById(id);

            return news.get();

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
}