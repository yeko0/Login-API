package org.yeko.loginapi.exception;


import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.yeko.loginapi.dto.ApiMessage;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiMessage> handleArgumentValidationErrors(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        if (message == null) { message = "Invalid request data"; }

        return ResponseEntity.badRequest().body(new ApiMessage(List.of(message)));
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiMessage> handleTypeMismatchErrors(MethodArgumentTypeMismatchException ex) {
        String requiredType;
        if (ex.getRequiredType() != null) {
            requiredType = ex.getRequiredType().getSimpleName();
        } else {
            requiredType = "valid type";
        }
        return ResponseEntity.badRequest().body(new ApiMessage(List.of(
                "Invalid parameter: "+ ex.getName(),
                "Expected type: "+ requiredType
        )));
    }


    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiMessage> handleValidationErrors(HandlerMethodValidationException ex) {
        return ResponseEntity.badRequest().body(new ApiMessage(List.of(
                "Invalid 0 or negative number",
                "Only positive numbers accepted"
        )));
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiMessage> handleDataIntegrityErrors(DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiMessage(List.of(
                        "Database conflict",
                        "The data already exists or",
                        "violates a database rule."
                )));
    }


    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiMessage> handleDatabaseErrors(DataAccessException ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiMessage(List.of(
                        "Database error",
                        "Please try again later."
                )));
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiMessage> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiMessage(List.of(ex.getMessage())));
    }


    @ExceptionHandler(DataConflictException.class)
    public ResponseEntity<ApiMessage> handleDataConflict(DataConflictException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiMessage(List.of(ex.getMessage())));
    }


    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiMessage> handleBadRequest(BadRequestException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiMessage(List.of(ex.getMessage())));
    }

}
