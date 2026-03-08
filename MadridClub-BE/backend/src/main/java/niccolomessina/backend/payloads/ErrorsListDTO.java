package niccolomessina.backend.payloads;

import java.util.List;

public record ErrorsListDTO (String message, List<String> errors) {
}
