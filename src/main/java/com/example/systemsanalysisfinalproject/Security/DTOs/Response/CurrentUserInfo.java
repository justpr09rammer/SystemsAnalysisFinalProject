package com.example.systemsanalysisfinalproject.Security.DTOs.Response;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CurrentUserInfo {
    private String name;
    private String surname;
    private String username;
    private String email;
    private boolean enabled;
}