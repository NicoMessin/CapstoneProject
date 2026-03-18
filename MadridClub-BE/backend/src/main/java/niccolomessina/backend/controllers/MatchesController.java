package niccolomessina.backend.controllers;

import niccolomessina.backend.entities.Match;
import niccolomessina.backend.entities.Product;
import niccolomessina.backend.entities.Utente;
import niccolomessina.backend.payloads.MatchesDTO;
import niccolomessina.backend.services.MatchService;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/partite")
public class MatchesController {
    public  final MatchService matchService;
    public MatchesController(MatchService matchService){
        this.matchService= matchService;
    }

    //SAVE
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ADMIN')")
    public Match saveMatch(@RequestBody @Validated MatchesDTO matchesDTO, BindingResult validation, Utente utente)
    {   if (validation.hasErrors()){
        throw new IllegalArgumentException("Errore nei dati del match");}
    return matchService.saveMatch(matchesDTO);}

    //GET ALL
    @GetMapping("")
    public List<Match> getAllMatch (){
        return matchService.findAllMatches();
    }


    //GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Match getMatchById(@PathVariable UUID id){
        return matchService.findById(id);

    }

    //DELETE BY ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMatch(@PathVariable UUID id){
        matchService.deleteMatch(id);
    }

}




