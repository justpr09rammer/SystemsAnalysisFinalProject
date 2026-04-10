package com.example.systemsanalysisfinalproject.Security.Controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/v1/demo")
public class demoController {
    @GetMapping("/greet")
    @PreAuthorize("hasRole('ADMIN')")
    public String greet(){
        return "hello";
    }

    @GetMapping("/bye")
    public String bye() {
        return "bye";
    }
}