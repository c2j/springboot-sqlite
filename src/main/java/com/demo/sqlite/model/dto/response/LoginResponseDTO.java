package com.demo.sqlite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
   private String email;
   private String token;
   private String type = "Bearer";

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getToken() {
      return token;
   }

   public void setToken(String token) {
      this.token = token;
   }

   public String getType() {
      return type;
   }

   public void setType(String type) {
      this.type = type;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder email(String email) {
         this.email = email;
         return this;
      }

      public Builder token(String token) {
         this.token = token;
         return this;
      }

      public Builder type(String type) {
         this.type = type;
         return this;
      }

      public LoginResponseDTO build() {
         LoginResponseDTO dto = new LoginResponseDTO();
         dto.setEmail(email);
         dto.setToken(token);
         dto.setType(type);
         return dto;
      }

      private String email;
      private String token;
      private String type = "Bearer";
   }

}
