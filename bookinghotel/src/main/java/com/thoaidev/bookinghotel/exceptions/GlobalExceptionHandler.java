package com.thoaidev.bookinghotel.exceptions;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;


@RestControllerAdvice
public class GlobalExceptionHandler {
        @ExceptionHandler(NotFoundException.class)
        public ResponseEntity<ErrorObject> handleHotelNotFoundException(NotFoundException ex, WebRequest request){
            ErrorObject errorObject= new ErrorObject();
            errorObject.setStatusCode(HttpStatus.NOT_FOUND.value());
            errorObject.setMessage(ex.getMessage());
            errorObject.setTimestamp(new Date());

            return new ResponseEntity<ErrorObject>(errorObject, HttpStatus.NOT_FOUND);
        }

}
