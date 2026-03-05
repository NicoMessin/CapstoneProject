package niccolomessina.backend.controllers;

import niccolomessina.backend.entities.News;
import niccolomessina.backend.payloads.NewsDTO;
import niccolomessina.backend.services.NewsService;
import niccolomessina.backend.entities.Utente; // se hai un Utente simile al FattureController
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // GET /news → lista tutte le news (USER e ADMIN)
    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<News> getAllNews() {
        return newsService.getAllNews();
    }

    // GET /news/{id} → recupera news per ID (USER e ADMIN)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public News getNewsById(@PathVariable UUID id) {
        return newsService.getNewsById(id);
    }

    // POST /news → crea nuova news (solo ADMIN)
    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public News createNews(@RequestBody @Validated NewsDTO newsDTO,
                           BindingResult validation,
                           @AuthenticationPrincipal Utente utente) {
        if (validation.hasErrors()) {
            throw new IllegalArgumentException("Errore nei dati della news");
        }
        return newsService.createNews(newsDTO);
    }

    // DELETE /news/{id} → elimina news (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNews(@PathVariable UUID id) {
        newsService.deleteNews(id);
    }
}