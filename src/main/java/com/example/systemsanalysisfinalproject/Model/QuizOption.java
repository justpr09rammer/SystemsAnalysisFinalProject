package com.example.systemsanalysisfinalproject.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_options")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnoreProperties({"options"})
    private QuizQuestion question;

    @Column(nullable = false, length = 500)
    private String optionText;

    @Column(name = "is_correct", nullable = false)
    private boolean correct;

    @Column(name = "option_order")
    private Integer optionOrder;
}
