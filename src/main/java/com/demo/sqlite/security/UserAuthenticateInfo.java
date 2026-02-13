package com.demo.sqlite.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthenticateInfo {
   private int userId;
   private String subject;
   private List<String> roles;

   public int getUserId() {
      return userId;
   }

   public void setUserId(int userId) {
      this.userId = userId;
   }

   public String getSubject() {
      return subject;
   }

   public void setSubject(String subject) {
      this.subject = subject;
   }

   public List<String> getRoles() {
      return roles;
   }

   public void setRoles(List<String> roles) {
      this.roles = roles;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder userId(int userId) {
         this.userId = userId;
         return this;
      }

      public Builder subject(String subject) {
         this.subject = subject;
         return this;
      }

      public Builder roles(List<String> roles) {
         this.roles = roles;
         return this;
      }

      public UserAuthenticateInfo build() {
         UserAuthenticateInfo info = new UserAuthenticateInfo();
         info.setUserId(userId);
         info.setSubject(subject);
         info.setRoles(roles);
         return info;
      }

      private int userId;
      private String subject;
      private List<String> roles;
   }

   public static UserAuthenticateInfo fromAuth(Authentication auth) {
      return (UserAuthenticateInfo) auth.getDetails();
   }

}
