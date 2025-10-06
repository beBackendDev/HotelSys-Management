package com.thoaidev.bookinghotel.model.image.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class ImageService {

    public String upload(MultipartFile file, String folder) throws IOException {
        //Kiểm tra file rỗng
        if (file == null || file.isEmpty() || file.getOriginalFilename() == null) {
            throw new IllegalArgumentException("Files empty");
        }
        // Kiểm tra định dạng MIME
        System.out.println("--> Image Type: " + file.getContentType());
        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("File isnt Image_Type");
        }
        // String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();// radomUUID() để tạo một chuỗi ngẫu nhiên tránh trùng lặp tên
        String filename = file.getOriginalFilename();
        System.out.println("--> File Name: " + filename);
        Path path = Paths.get("uploads", folder, filename);
        Files.createDirectories(path.getParent());

        BufferedImage image = ImageIO.read(file.getInputStream());
        if (image == null) {
            throw new IllegalArgumentException("Image cant read, please try again!!");
        }
        try (OutputStream os = Files.newOutputStream(path)) {
            Thumbnails.of(image)
                    .size(800, 800)
                    .outputQuality(0.8)
                    .outputFormat("jpeg")
                    .toOutputStream(os);
        }

        return "/uploads/" + folder + "/" + filename;
    }
}
