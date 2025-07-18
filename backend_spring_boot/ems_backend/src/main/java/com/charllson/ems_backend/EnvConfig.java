package com.charllson.ems_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    
    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure()
            .directory("./") // looks for .env in current directory
            .ignoreIfMissing() // doesn't throw exception if .env is missing
            .load();
    }
}