package com.example.systemsanalysisfinalproject.Security.DTOs.Request;

import lombok.Getter;
import lombok.Setter;
//checking
@Getter
@Setter
public class UserLoginRequest {
    private String email;
    private String password;
}