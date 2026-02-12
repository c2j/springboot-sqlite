package com.demo.sqlite.model.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Signup Client Request DTO")
public class ClientSignupRequestDTO {
   @Schema(example = "Carlos")
   @NotBlank(message = "Field 'name' is required")
   private String name;
   @Schema(example = "Cruz")
   @NotBlank(message = "Field 'surnames' is required")
   private String surnames;
   @Schema(example = "Av. Principal 123")
   @NotBlank(message = "Field 'direction' is required")
   private String direction;
   @Schema(example = "Jalisco")
   @NotBlank(message = "Field 'state' is required")
   private String state;
   @Schema(example = "45000")
   @NotBlank(message = "Field 'postal_code' is required")
   @JsonProperty("postal_code")
   private String postalCode;
   @Schema(example = "3300000000")
   @NotBlank(message = "Field 'phone' is required")
   private String phone;
   @Schema(example = "carlos@example.com")
   @NotBlank(message = "Field 'email' is required")
   @Email(message = "Field 'email' must be a valid email address")
   private String email;
   @Schema(example = "ok")
   @NotBlank(message = "Field 'password' is required")
   private String password;

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

   public String getPassword() {
      return password;
   }

   public void setPassword(String password) {
      this.password = password;
   }

}
