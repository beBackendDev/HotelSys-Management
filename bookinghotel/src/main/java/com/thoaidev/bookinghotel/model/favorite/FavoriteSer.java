package com.thoaidev.bookinghotel.model.favorite;

import java.util.Set;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

public interface FavoriteSer {
    //Add Favorite
    void addFavorite(Integer userId, Integer hotelId);
    void removeFavorite(Integer userId, Integer hotelId);
    Set<Hotel> getFavorites(Integer userId);
}
