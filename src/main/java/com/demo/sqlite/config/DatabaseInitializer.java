package com.demo.sqlite.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DatabaseInitializer {
   private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);
   private final DataSource dataSource;

   public DatabaseInitializer(@Autowired DataSource dataSource) {
      this.dataSource = dataSource;
   }

   @PostConstruct
   public void initialize() {
      try (Connection connection = dataSource.getConnection()) {
         Statement statement = connection.createStatement();
         InputStream inputStream = this.getClass().getResourceAsStream("/tables-sqlite.sql");
         BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
         String line;
         StringBuilder script = new StringBuilder();
         while ((line = reader.readLine()) != null) {
            script.append(line).append("\n");
         }
         reader.close();
         statement.executeUpdate(script.toString());
         statement.close();
         connection.close();
         log.info("The SQL script was executed successfully.");
      } catch (Exception e) {
         log.error("Error executing SQL script", e);
      }

   }
}
