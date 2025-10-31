package com.alumniportal.alumni.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User student;

    @ManyToOne
    private User alumni;

    @Enumerated(EnumType.STRING)
    private ConnectionStatus status;

    public enum ConnectionStatus {
        PENDING,
        ACCEPTED,   // <-- use this instead of CONNECTED
        REJECTED
    }
}
