package com.WTFCapestone.Capestone.config;

import org.springframework.context.annotation.Configuration;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.InputStream;
import java.util.List;

@Configuration
public class GoogleDriveConfig {
    @Value("${google.credentials.file}")
    private Resource credentialsResource;

    @Bean
    public Drive googleDriveService() throws Exception {

        InputStream inputStream = credentialsResource.getInputStream();

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(inputStream)
                .createScoped(List.of("https://www.googleapis.com/auth/drive"));

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials)
        ).setApplicationName("Thrump Fix").build();
    }
}
