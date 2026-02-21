package com.WTFCapestone.Capestone.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpLoadProfilePhotoRequest {
    private MultipartFile imageUrl;
}
