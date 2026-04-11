package com.example.systemsanalysisfinalproject.Repository;
 
import com.example.systemsanalysisfinalproject.Model.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.Optional;
 
@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findByOpenLibraryId(String openLibraryId);
    Optional<Author> findByName(String name);

    //finding by query
    @Query("SELECT a FROM Author a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Author> searchByName(@Param("query") String query, Pageable pageable);
}
 