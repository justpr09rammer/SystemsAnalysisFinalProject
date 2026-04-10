package com.example.systemsanalysisfinalproject.Security.Controller;

import com.example.systemsanalysisfinalproject.Security.DTOs.Request.UserLoginRequest;
import com.example.systemsanalysisfinalproject.Security.DTOs.Request.UserRegisterRequest;
import com.example.systemsanalysisfinalproject.Security.DTOs.Request.VerifyUserRequest;
import com.example.systemsanalysisfinalproject.Security.DTOs.Response.LoginResponse;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Service.AuthenticationService;
import com.example.systemsanalysisfinalproject.Security.Service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs for user authentication and registration")
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid registration data"),
            @ApiResponse(responseCode = "409", description = "User already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.OK)
    public User register(@Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        return authenticationService.signup(userRegisterRequest);
    }

    @Operation(summary = "Authenticate user and get JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid login credentials"),
            @ApiResponse(responseCode = "401", description = "Authentication failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse authenticate(@Valid @RequestBody UserLoginRequest loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        return new LoginResponse(jwtToken, jwtService.getExpirationTime());
    }

    @Operation(summary = "Verify user account with verification code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid verification code"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.OK)
    public String verifyUser(@Valid @RequestBody VerifyUserRequest verifyUserDto) {
        authenticationService.verifyUser(verifyUserDto);
        return "Account verified successfully";
    }

    @Operation(summary = "Resend verification code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Verification code sent successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email or user already verified"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/resend")
    @ResponseStatus(HttpStatus.OK)
    public String resendVerificationCode(
            @Parameter(description = "Email address to resend verification code", required = true, example = "user@example.com")
            @RequestParam String email) {
        authenticationService.resendVerificationCode(email);
        return "Verification code sent";
    }
}