package com.example.systemsanalysisfinalproject.Security.DTOs.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    private String name;
    private String surname;
    private String userName;
    private String email;
    private String password;
    private String phone;
}