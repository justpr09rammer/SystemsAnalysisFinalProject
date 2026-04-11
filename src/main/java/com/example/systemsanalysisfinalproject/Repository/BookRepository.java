package com.example.systemsanalysisfinalproject.Repository;
 
import com.example.systemsanalysisfinalproject.Model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.List;
import java.util.Optional;
 
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
 
    Optional<Book> findByIsbn10(String isbn10);
    Optional<Book> findByIsbn13(String isbn13);
    Optional<Book> findByOpenLibraryId(String openLibraryId);
 
    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchByTitle(@Param("query") String query, Pageable pageable);
 
    @Query("SELECT DISTINCT b FROM Book b JOIN b.authors a WHERE " +
            "LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchByAuthor(@Param("query") String query, Pageable pageable);
 
    @Query("SELECT DISTINCT b FROM Book b JOIN b.genres g WHERE g.id = :genreId")
    Page<Book> findByGenreId(@Param("genreId") Long genreId, Pageable pageable);
 
    @Query("SELECT DISTINCT b FROM Book b JOIN b.authors a WHERE a.id = :authorId")
    Page<Book> findByAuthorId(@Param("authorId") Long authorId, Pageable pageable);
 
    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "EXISTS (SELECT a FROM b.authors a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> search(@Param("query") String query, Pageable pageable);
 
    @Query("SELECT b FROM Book b ORDER BY b.averageRating DESC")
    Page<Book> findTopRated(Pageable pageable);
}