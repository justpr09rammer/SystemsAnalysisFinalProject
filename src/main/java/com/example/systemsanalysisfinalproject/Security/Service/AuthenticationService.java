package com.example.systemsanalysisfinalproject.Security.Service;


import com.example.systemsanalysisfinalproject.Security.DTOs.Request.UserRegisterRequest;
import com.example.systemsanalysisfinalproject.Security.Model.*;
import com.example.systemsanalysisfinalproject.Security.DTOs.Request.UserLoginRequest;
import com.example.systemsanalysisfinalproject.Security.DTOs.Request.VerifyUserRequest;
import com.example.systemsanalysisfinalproject.Security.Repository.EventRepository;
import com.example.systemsanalysisfinalproject.Security.Repository.UserRepository;

import com.example.systemsanalysisfinalproject.Service.ShelfService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final EventRepository eventRepository;
    private final ShelfService shelfService; // Inject ShelfService

    public User signup(UserRegisterRequest input) {
        User user = User.builder()
                .name(input.getName())
                .surname(input.getSurname())
                .username(input.getUserName())
                .phone(input.getPhone())
                .email(input.getEmail())
                .password(passwordEncoder.encode(input.getPassword()))
                .userStatus(UserStatus.ACTIVE)
                .passwordChangeAttempts(0)
                .verificationCode(generateVerificationCode())
                .verificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15))
                .enabled(false) // User is disabled until verified
                .userRole(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);

        sendVerificationEmail(savedUser);
        UserEvent event = UserEvent.builder()
                .eventTime(LocalDateTime.now())
                .eventType(EventType.USER_REGISTERED)
                .user(savedUser)
                .build();
        UserEvent savedEvent = eventRepository.save(event);

        return savedUser;
    }

    public User authenticate(UserLoginRequest input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }
        if (user.getUserStatus() == UserStatus.DELETED) {
            throw new RuntimeException("user has been deleted");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return user;
    }

    public void verifyUser(VerifyUserRequest input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                userRepository.save(user);
                shelfService.createDefaultShelves(user);

                UserEvent event = UserEvent.builder()
                        .eventTime(LocalDateTime.now())
                        .eventType(EventType.USER_VERIFIED)
                        .user(user)
                        .build();
                UserEvent savedEvent = eventRepository.save(event);

            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}