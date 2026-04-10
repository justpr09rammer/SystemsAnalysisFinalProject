package com.example.systemsanalysisfinalproject.Security.Utils;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class LimitProperties {
    private final int maxPasswordChangeAttempts = 1;
}