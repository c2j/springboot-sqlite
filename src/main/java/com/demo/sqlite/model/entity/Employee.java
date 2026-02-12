package com.demo.sqlite.model.entity;

import com.demo.sqlite.model.dto.request.EmployeeSignupRequestDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   private String name;
   private String surnames;
   private String email;
   @Column(name = "password_hash")
   private String passwordHash;

   public int getId() {
      return id;
   }

   public void setId(int id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getSurnames() {
      return surnames;
   }

   public void setSurnames(String surnames) {
      this.surnames = surnames;
   }

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPasswordHash() {
      return passwordHash;
   }

   public void setPasswordHash(String passwordHash) {
      this.passwordHash = passwordHash;
   }

   public static class Builder {
      public Builder name(String name) {
         this.name = name;
         return this;
      }

      public Builder surnames(String surnames) {
         this.surnames = surnames;
         return this;
      }

      public Builder email(String email) {
         this.email = email;
         return this;
      }

      public Builder passwordHash(String passwordHash) {
         this.passwordHash = passwordHash;
         return this;
      }

      public Employee build() {
         Employee employee = new Employee();
         employee.setId(id);
         employee.setName(name);
         employee.setSurnames(surnames);
         employee.setEmail(email);
         employee.setPasswordHash(passwordHash);
         return employee;
      }

      private int id;
      private String name;
      private String surnames;
      private String email;
      private String passwordHash;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static Employee fromSignupDTO(EmployeeSignupRequestDTO signupDTO, String passwordHash) {
      return Employee.builder().name(signupDTO.getName()).surnames(signupDTO.getSurnames())
            .email(signupDTO.getEmail()).passwordHash(passwordHash).build();
   }

}
