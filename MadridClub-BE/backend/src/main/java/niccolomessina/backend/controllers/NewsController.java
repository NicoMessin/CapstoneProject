package niccolomessina.backend.controllers;

import niccolomessina.backend.entities.News;
import niccolomessina.backend.payloads.NewsDTO;
import niccolomessina.backend.services.NewsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/news")
@Slf4j
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // GET /api/news → lista tutte le news
    @GetMapping
    public ResponseEntity<List<News>> getAllNews() {
        log.info("Chiamata GET /api/news");
        List<News> newsList = newsService.getAllNews();
        return ResponseEntity.ok(newsList);
    }

    // GET /api/news/{id} → recupera news per ID
    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable UUID id) {
        log.info("Chiamata GET /api/news/{}", id);
        News news = newsService.getNewsById(id);
        if (news == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(news);
    }

    // POST /api/news → crea nuova news
    @PostMapping
    public ResponseEntity<News> createNews(@Validated @RequestBody NewsDTO newsDTO) {
        log.info("Chiamata POST /api/news con titolo: {}", newsDTO.title());
        News created = newsService.createNews(newsDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // DELETE /api/news/{id} → elimina news
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable UUID id) {
        log.info("Chiamata DELETE /api/news/{}", id);
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}