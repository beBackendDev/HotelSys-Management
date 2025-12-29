package com.thoaidev.bookinghotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import lombok.RequiredArgsConstructor;

@ComponentScan("com.thoaidev.bookinghotel")
@SpringBootApplication
@RequiredArgsConstructor
@EnableScheduling // cần để chạy @Scheduled
public class BookinghotelApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookinghotelApplication.class, args);
		
	}

}
