package com.example.systemsanalysisfinalproject.Repository;
 
import com.example.systemsanalysisfinalproject.Model.ShelfBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.List;
import java.util.Optional;
 
@Repository
public interface ShelfBookRepository extends JpaRepository<ShelfBook, Long> {
    Optional<ShelfBook> findByShelfIdAndBookId(Long shelfId, Long bookId);
    boolean existsByShelfIdAndBookId(Long shelfId, Long bookId);
    List<ShelfBook> findByShelfId(Long shelfId);
 
    @Query("SELECT sb FROM ShelfBook sb WHERE sb.shelf.user.id = :userId AND sb.book.id = :bookId")
    List<ShelfBook> findByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId);
 
    @Query("SELECT COUNT(sb) FROM ShelfBook sb WHERE sb.shelf.user.id = :userId AND sb.shelf.name = 'Read'")
    long countBooksReadByUserId(@Param("userId") Long userId);
}
 