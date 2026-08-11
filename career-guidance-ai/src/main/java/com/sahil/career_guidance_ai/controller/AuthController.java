git pushpackage com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.entity.User;
import com.sahil.career_guidance_ai.security.JwtUtil;
import com.sahil.career_guidance_ai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User created = userService.registerUser(user);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }

    // LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.findByEmail(user.getEmail());

        if (existingUser != null &&
                passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {

            String token = JwtUtil.generateToken(existingUser.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("email", existingUser.getEmail());
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}