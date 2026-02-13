package com.demo.sqlite.model.entity;

import com.demo.sqlite.model.dto.request.ClientSignupRequestDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "clients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   private String name;
   private String surnames;
   private String direction;
   private String state;
   @Column(name = "postal_code")
   private String postalCode;
   private String phone;
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

   public String getDirection() {
      return direction;
   }

   public void setDirection(String direction) {
      this.direction = direction;
   }

   public String getState() {
      return state;
   }

   public void setState(String state) {
      this.state = state;
   }

   public String getPostalCode() {
      return postalCode;
   }

   public void setPostalCode(String postalCode) {
      this.postalCode = postalCode;
   }

   public String getPhone() {
      return phone;
   }

   public void setPhone(String phone) {
      this.phone = phone;
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

      public Builder direction(String direction) {
         this.direction = direction;
         return this;
      }

      public Builder state(String state) {
         this.state = state;
         return this;
      }

      public Builder postalCode(String postalCode) {
         this.postalCode = postalCode;
         return this;
      }

      public Builder phone(String phone) {
         this.phone = phone;
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

      public Client build() {
         Client client = new Client();
         client.setId(id);
         client.setName(name);
         client.setSurnames(surnames);
         client.setDirection(direction);
         client.setState(state);
         client.setPostalCode(postalCode);
         client.setPhone(phone);
         client.setEmail(email);
         client.setPasswordHash(passwordHash);
         return client;
      }

      private int id;
      private String name;
      private String surnames;
      private String direction;
      private String state;
      private String postalCode;
      private String phone;
      private String email;
      private String passwordHash;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static Client fromSignupDTO(ClientSignupRequestDTO clientSignupDTO, String passwordHash) {
      return Client.builder().name(clientSignupDTO.getName())
            .surnames(clientSignupDTO.getSurnames()).direction(clientSignupDTO.getDirection())
            .state(clientSignupDTO.getState()).postalCode(clientSignupDTO.getPostalCode())
            .phone(clientSignupDTO.getPhone()).email(clientSignupDTO.getEmail())
            .passwordHash(passwordHash).build();
   }

}
