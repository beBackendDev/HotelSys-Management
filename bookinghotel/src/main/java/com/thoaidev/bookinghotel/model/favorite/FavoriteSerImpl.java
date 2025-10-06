package com.thoaidev.bookinghotel.model.favorite;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.model.favorite.FavoriteSer;

@Service
public class FavoriteSerImpl implements FavoriteSer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Override
    public void addFavorite(Integer userId, Integer hotelId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        user.getFavoriteHotels().add(hotel);
        userRepository.save(user);
    }

    @Override
    public void removeFavorite(Integer userId, Integer hotelId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        user.getFavoriteHotels().remove(hotel);
        userRepository.save(user);
    }
    @Override
    public Set<Hotel> getFavorites(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getFavoriteHotels();
    }

}
