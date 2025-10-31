package com.alumniportal.alumni.service;

import com.alumniportal.alumni.entity.Connection;
import com.alumniportal.alumni.entity.User;
import com.alumniportal.alumni.repository.ConnectionRepository;
import com.alumniportal.alumni.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    // Student sends connection request
    public void sendConnectionRequest(Long studentId, Long alumniId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        User alumni = userRepository.findById(alumniId)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));

        if (connectionRepository.existsByStudentAndAlumni(student, alumni)) {
            throw new RuntimeException("Connection request already sent");
        }

        Connection connection = Connection.builder()
                .student(student)
                .alumni(alumni)
                .status(Connection.ConnectionStatus.PENDING)
                .build();
        connectionRepository.save(connection);
    }

    // Alumni: pending connection requests
    public List<Connection> getPendingRequests(Long alumniId) {
        return connectionRepository.findPendingRequestsForAlumniWithStudentDetails(alumniId);
    }

    // Alumni: accept connection
    public void acceptConnection(Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        connection.setStatus(Connection.ConnectionStatus.ACCEPTED);
        connectionRepository.save(connection);
    }

    // Alumni: reject connection
    public void rejectConnection(Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        connection.setStatus(Connection.ConnectionStatus.REJECTED);
        connectionRepository.save(connection);
    }

    // Student: accepted connections
    public List<Connection> getStudentConnections(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return connectionRepository.findByStudentAndStatus(student, Connection.ConnectionStatus.ACCEPTED);
    }

    // Alumni: accepted connections
    public List<Connection> getAlumniConnections(Long alumniId) {
        User alumni = userRepository.findById(alumniId)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));
        return connectionRepository.findByAlumniAndStatus(alumni, Connection.ConnectionStatus.ACCEPTED);
    }

    // Suggested alumni list for student
    public List<User> getSuggestedAlumni(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        List<User> allAlumni = userRepository.findAll().stream()
                .filter(u -> u.getRole().getName().equalsIgnoreCase("ALUMNI"))
                .collect(Collectors.toList());

        Set<Long> connectedIds = connectionRepository
                .findByStudentAndStatus(student, Connection.ConnectionStatus.ACCEPTED)
                .stream().map(c -> c.getAlumni().getId()).collect(Collectors.toSet());

        return allAlumni.stream()
                .filter(a -> !connectedIds.contains(a.getId()))
                .collect(Collectors.toList());
    }

    // ✅ Fetch all alumni (for StudentNetwork.jsx)
    public List<User> getAllAlumni() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole().getName().equalsIgnoreCase("ALUMNI"))
                .collect(Collectors.toList());
    }

    // ✅ UPDATED: Return List of ConnectionStatusDTO instead of Map
    public List<ConnectionStatusDTO> getConnectionStatus(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Connection> connections = connectionRepository.findByStudent(student);

        // Convert to DTO list for frontend
        return connections.stream()
                .map(conn -> new ConnectionStatusDTO(conn.getAlumni().getId(), conn.getStatus().name()))
                .collect(Collectors.toList());
    }

    // ✅ ADD THIS DTO CLASS
    public static class ConnectionStatusDTO {
        private Long alumniId;
        private String status;

        public ConnectionStatusDTO() {}

        public ConnectionStatusDTO(Long alumniId, String status) {
            this.alumniId = alumniId;
            this.status = status;
        }

        // Getters and setters
        public Long getAlumniId() {
            return alumniId;
        }

        public void setAlumniId(Long alumniId) {
            this.alumniId = alumniId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}