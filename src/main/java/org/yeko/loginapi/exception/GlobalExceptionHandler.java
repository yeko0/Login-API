package org.yeko.loginapi.exception;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.yeko.loginapi.dto.ApiMessage;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiMessage> handleArgumentValidationErrors(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        return ResponseEntity.badRequest().body(new ApiMessage(message));
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiMessage> handleTypeMismatchErrors(MethodArgumentTypeMismatchException ex) {
        String requiredType;
        if (ex.getRequiredType() != null) {
            requiredType = ex.getRequiredType().getSimpleName();
        } else {
            requiredType = "valid type";
        }
        return ResponseEntity.badRequest().body(new ApiMessage(
                "Invalid parameter '"+ ex.getName() +"'. Expected type: "+ requiredType
                                                               )
        );
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiMessage> handleValidationErrors(HandlerMethodValidationException ex) {
        return ResponseEntity.badRequest().body(new ApiMessage("Invalid 0 or negative number. Only positive numbers accepted"));
    }

}
