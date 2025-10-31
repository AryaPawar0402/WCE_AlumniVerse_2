package com.alumniportal.alumni.controller;

import com.alumniportal.alumni.entity.Connection;
import com.alumniportal.alumni.entity.User;
import com.alumniportal.alumni.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "*")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    // Student sends request
    @PostMapping("/send")
    public Map<String, String> sendRequest(@RequestParam Long studentId, @RequestParam Long alumniId) {
        connectionService.sendConnectionRequest(studentId, alumniId);
        return Map.of("message", "Connection request sent successfully");
    }

    // Alumni fetches pending requests
    @GetMapping("/pending/{alumniId}")
    public List<Connection> getPendingRequests(@PathVariable Long alumniId) {
        return connectionService.getPendingRequests(alumniId);
    }

    // Alumni accepts a request
    @PostMapping("/accept/{connectionId}")
    public Map<String, String> acceptRequest(@PathVariable Long connectionId) {
        connectionService.acceptConnection(connectionId);
        return Map.of("message", "Connection accepted successfully");
    }

    // Alumni rejects a request
    @PostMapping("/reject/{connectionId}")
    public Map<String, String> rejectRequest(@PathVariable Long connectionId) {
        connectionService.rejectConnection(connectionId);
        return Map.of("message", "Connection rejected");
    }

    // Student fetches accepted connections
    @GetMapping("/student/{studentId}")
    public List<Connection> getStudentConnections(@PathVariable Long studentId) {
        return connectionService.getStudentConnections(studentId);
    }

    // Alumni fetches accepted connections
    @GetMapping("/alumni/{alumniId}")
    public List<Connection> getAlumniConnections(@PathVariable Long alumniId) {
        return connectionService.getAlumniConnections(alumniId);
    }

    // Suggested Alumni list for Student
    @GetMapping("/suggested/{studentId}")
    public List<User> getSuggestedAlumni(@PathVariable Long studentId) {
        return connectionService.getSuggestedAlumni(studentId);
    }

    // ✅ Fetch all alumni (used by StudentNetwork.jsx)
    @GetMapping("/allAlumni")
    public List<User> getAllAlumni() {
        return connectionService.getAllAlumni();
    }

    // ✅ UPDATED: Return List instead of Map
    @GetMapping("/status/{studentId}")
    public List<ConnectionService.ConnectionStatusDTO> getConnectionStatus(@PathVariable Long studentId) {
        return connectionService.getConnectionStatus(studentId);
    }
}