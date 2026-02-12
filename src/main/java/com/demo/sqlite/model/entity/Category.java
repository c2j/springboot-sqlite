package com.demo.sqlite.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   private String category;
   private String description;

   public int getId() {
      return id;
   }

   public void setId(int id) {
      this.id = id;
   }

   public String getCategory() {
      return category;
   }

   public void setCategory(String category) {
      this.category = category;
   }

   public String getDescription() {
      return description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder id(int id) {
         this.id = id;
         return this;
      }

      public Builder category(String category) {
         this.category = category;
         return this;
      }

      public Builder description(String description) {
         this.description = description;
         return this;
      }

      public Category build() {
         Category result = new Category();
         result.setId(id);
         result.setCategory(category);
         result.setDescription(description);
         return result;
      }

      private int id;
      private String category;
      private String description;
   }

}
