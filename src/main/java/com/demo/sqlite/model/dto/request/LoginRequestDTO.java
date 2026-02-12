package com.demo.sqlite.model.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Login Request DTO")
public class LoginRequestDTO {
   @Schema(example = "john@example.com")
   @NotBlank(message = "Field 'email' is required")
   String email;
   @Schema(example = "ok")
   @NotBlank(message = "Field 'password' is required")
   String password;

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPassword() {
      return password;
   }

   public void setPassword(String password) {
      this.password = password;
   }

}
