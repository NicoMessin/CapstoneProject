package niccolomessina.backend.services;

import lombok.extern.slf4j.Slf4j;
import niccolomessina.backend.entities.Match;
import niccolomessina.backend.entities.Product;
import niccolomessina.backend.exceptions.NotFoundException;
import niccolomessina.backend.payloads.MatchesDTO;
import niccolomessina.backend.payloads.ProductsDTO;
import niccolomessina.backend.repositories.MatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
 @Slf4j
public class MatchService {
    private  final MatchRepository matchRepository;
    public MatchService(MatchRepository matchRepository){
        this.matchRepository= matchRepository;
    }

    //SAVE
    public Match saveMatch(MatchesDTO payload){
        Match newMatch= new Match(
                payload.casa(), payload.trasferta(), payload.data()
        );
        return matchRepository.save(newMatch);
    }

    //FIND ALL
    public List<Match> findAllMatches(){
        return matchRepository.findAll();
    }

    //FIND BY ID
    public Match findById(UUID id){
      return matchRepository.findById(id)
        .orElseThrow(() -> new NotFoundException(id));

    }

    //DELETE
    public void deleteMatch(UUID id){
       Match match=  matchRepository.findById(id)
               .orElseThrow(() -> new NotFoundException(id));
       matchRepository.delete(match);
    }

    //UPDATE
    public Match updateMatch(UUID id, MatchesDTO payload)
    {
        Match aggiornaMatch= findById(id);
        aggiornaMatch.setCasa(payload.casa());
        aggiornaMatch.setTrasferta(payload.trasferta());
        aggiornaMatch.setData(payload.data());


        return matchRepository.save(aggiornaMatch);
    }

}
