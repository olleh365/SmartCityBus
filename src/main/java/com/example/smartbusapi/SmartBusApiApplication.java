package com.example.smartbusapi;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.FileInputStream;
import java.io.IOException;

@EnableScheduling
@SpringBootApplication
public class SmartBusApiApplication {

    public static void main(String[] args) throws IOException {
        System.out.println("Start");
        try{
            ClassLoader classLoader = SmartBusApiApplication.class.getClassLoader();

            FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");//json파일 경로
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https:/du-smart-bus.firebaseio.com/") //db url
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            throw new RuntimeException("Firebase initialization failed", e);
        }
        SpringApplication.run(SmartBusApiApplication.class, args);
    }

}
