package com.example.systemsanalysisfinalproject.Security.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;




import java.util.List;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    private final AuthenticationProvider    authenticationProvider;
    private final JwtAuthenticationFilter   jwtAuthenticationFilter;

    public SecurityConfiguration(AuthenticationProvider authenticationProvider,
                                 JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.authenticationProvider   = authenticationProvider;
        this.jwtAuthenticationFilter  = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth

                        // ── Swagger / OpenAPI (public) ─────────────────────────
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        // ── Auth endpoints (public) ────────────────────────────
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // ── Books: read-only is public, write needs ADMIN ──────
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/books/**",
                                "/api/v1/authors/**",
                                "/api/v1/genres/**"
                        ).permitAll()

                        // ── Everything else requires authentication ────────────
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}







//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
//public class SecurityConfiguration {
//    private final AuthenticationProvider authenticationProvider;
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    public SecurityConfiguration(
//            JwtAuthenticationFilter jwtAuthenticationFilter,
//            AuthenticationProvider authenticationProvider //ignore Bean warning we will get to that
//    ) {
//        this.authenticationProvider = authenticationProvider;
//        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//    }
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf
//                        .disable()
//                )
//                .authorizeHttpRequests(authorize -> authorize
//                        .requestMatchers(
//                                "/api/v1/auth/**",
//                                "/api/v1/demo/**",
//                                "/h2-console/**",
//                                "/swagger-ui.html",
//                                "/swagger-ui/**",
//                                "/api-docs/**",
//                                "/v3/api-docs/**",
//                                "/swagger-resources/**",
//                                "/webjars/**"
//                        ).permitAll()
//                        .requestMatchers("/api/v1/users/my-profile/**").authenticated()
//                        .requestMatchers("/api/v1/events/my-events/**").authenticated()
//                        .anyRequest().authenticated()
//                )
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//                .headers(headers -> headers
//                        .frameOptions(frameOptions -> frameOptions
//                                .disable()
//                        )
//                );
//
//        return http.build();
//    }
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http
////                .csrf(csrf -> csrf
////                        .disable() // Disable CSRF for H2 console
////                )
////                .authorizeHttpRequests(authorize -> authorize
////                        .requestMatchers(
////                                "/api/v1/auth/**",
////                                "/api/v1/demo/**",
////                                "/h2-console/**", // Allow H2 console access
////                                "/swagger-ui/**", // Allow Swagger UI access
////                                "/api-docs/**", // Allow OpenAPI/Swagger documentation access
////                                "/swagger-resources/**", // Allow Swagger resources
////                                "/webjars/**" // Allow webjars (used by Swagger)
////                        ).permitAll()
////                        .requestMatchers("/api/v1/users/my-profile/**").authenticated()
////                        .requestMatchers("/api/v1/events/my-events/**").authenticated()
////                        .anyRequest().authenticated()
////                )
////                .sessionManagement(session -> session
////                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
////                )
////                .authenticationProvider(authenticationProvider)
////                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
////                .headers(headers -> headers
////                        .frameOptions(frameOptions -> frameOptions
////                                .disable() // Disable X-Frame-Options for H2 console
////                        )
////                );
////
////        return http.build();
////    }
//
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("https://app-backend.com", "http://localhost:8080"));
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
//        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//}