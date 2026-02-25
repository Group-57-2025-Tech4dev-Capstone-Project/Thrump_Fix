package com.WTFCapestone.Capestone.config;


import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
import com.WTFCapestone.Capestone.dto.response.CreateJobResponse;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Configuration
public class OpenApiConfig {

//    @Bean
//    public OpenAPI plumbConnectOpenAPI() {
//        return new OpenAPI()
//                .info(new Info()
//                        .title("PlumbConnect API")
//                        .description("Backend API for PlumbConnect platform")
//                        .version("1.0")
//                        .contact(new Contact()
//                                .name("PlumbConnect Dev Team")
//                                .email("dev@plumbconnect.com"))
//                        .license(new License()
//                                .name("Internal Use Only")));
//    }

    @Bean
    public OpenAPI plumbConnectOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("PlumbConnect API")
                        .version("1.0")
                        .description("Secure REST API for PlumbConnect"))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

//    @Operation(summary = "Create a new job")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Job created"),
//            @ApiResponse(responseCode = "403", description = "Unauthorized"),
//            @ApiResponse(responseCode = "404", description = "Location not found")
//    })
//    @PostMapping
//    public ResponseEntity<CreateJobResponse> createJob(
//            @Valid @RequestBody CreateJobRequest request) {
//    }

}
