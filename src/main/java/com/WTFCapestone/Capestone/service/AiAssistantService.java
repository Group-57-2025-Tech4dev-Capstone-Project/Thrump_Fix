package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.response.AiMatchResponse;
import com.WTFCapestone.Capestone.entity.Job;

public interface AiAssistantService {
    AiMatchResponse matchPlumbers(Job job);
}
