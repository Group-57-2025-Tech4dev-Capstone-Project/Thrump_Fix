package com.WTFCapestone.Capestone.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class AiMatchResponse {

    private Long jobId;
    private List<RecommendedPlumber> recommendedPlumbers;

    @Data
    public static class RecommendedPlumber {
        private Long plumberId;
        private Double score;
        private String reason;
    }
}






//@Getter
//@Setter
//public class AiMatchResponse {
//    private List<MatchedPlumber> plumbers;
//
//    @Data
//    public static class MatchedPlumber {
//        private Long userId;
//        private String phoneNumber;
//        private String verificationStatus;
//        private String subRegion;
//    }
//}
