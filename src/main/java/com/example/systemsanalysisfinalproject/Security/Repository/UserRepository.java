package com.example.systemsanalysisfinalproject.Security.Repository;


import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Model.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // Existing methods
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String userName);
    Optional<User> findById(Long id);
    Optional<User> findByPhone(String phone);
    List<User> findAll();

    // Pagination
    Page<User> findAll(Pageable pageable);

    // Filter by status
    Page<User> findByUserStatus(UserStatus status, Pageable pageable);
    List<User> findByUserStatus(UserStatus status);

    // Filter by enabled/verified status
    Page<User> findByEnabled(boolean enabled, Pageable pageable);

    // Search by username or email
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    // Complex filter: status and search
    @Query("SELECT u FROM User u WHERE " +
            "(:status IS NULL OR u.userStatus = :status) AND " +
            "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByFilters(
            @Param("status") UserStatus status,
            @Param("search") String search,
            Pageable pageable
    );

    // Count by status
    long countByUserStatus(UserStatus status);

    // Check if email exists (for validation)
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
}