package com.demo.sqlite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "stock")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stock {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int code;
   private String description;
   @JsonIgnore
   private byte[] image;
   @Column(name = "category_id")
   private int categoryId;
   private int quantity;
   private double price;
   private String status;
   @Column(name = "created_by")
   private int createdBy;
   @Column(name = "updated_by")
   private int updatedBy;

   public int getCode() {
      return code;
   }

   public void setCode(int code) {
      this.code = code;
   }

   public String getDescription() {
      return description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public byte[] getImage() {
      return image;
   }

   public void setImage(byte[] image) {
      this.image = image;
   }

   public int getCategoryId() {
      return categoryId;
   }

   public void setCategoryId(int categoryId) {
      this.categoryId = categoryId;
   }

   public int getQuantity() {
      return quantity;
   }

   public void setQuantity(int quantity) {
      this.quantity = quantity;
   }

   public double getPrice() {
      return price;
   }

   public void setPrice(double price) {
      this.price = price;
   }

   public String getStatus() {
      return status;
   }

   public void setStatus(String status) {
      this.status = status;
   }

   public int getCreatedBy() {
      return createdBy;
   }

   public void setCreatedBy(int createdBy) {
      this.createdBy = createdBy;
   }

   public int getUpdatedBy() {
      return updatedBy;
   }

   public void setUpdatedBy(int updatedBy) {
      this.updatedBy = updatedBy;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder code(int code) {
         this.code = code;
         return this;
      }

      public Builder description(String description) {
         this.description = description;
         return this;
      }

      public Builder image(byte[] image) {
         this.image = image;
         return this;
      }

      public Builder categoryId(int categoryId) {
         this.categoryId = categoryId;
         return this;
      }

      public Builder quantity(int quantity) {
         this.quantity = quantity;
         return this;
      }

      public Builder price(double price) {
         this.price = price;
         return this;
      }

      public Builder status(String status) {
         this.status = status;
         return this;
      }

      public Builder createdBy(int createdBy) {
         this.createdBy = createdBy;
         return this;
      }

      public Builder updatedBy(int updatedBy) {
         this.updatedBy = updatedBy;
         return this;
      }

      public Stock build() {
         Stock stock = new Stock();
         stock.setCode(code);
         stock.setDescription(description);
         stock.setImage(image);
         stock.setCategoryId(categoryId);
         stock.setQuantity(quantity);
         stock.setPrice(price);
         stock.setStatus(status);
         stock.setCreatedBy(createdBy);
         stock.setUpdatedBy(updatedBy);
         return stock;
      }

      private int code;
      private String description;
      private byte[] image;
      private int categoryId;
      private int quantity;
      private double price;
      private String status;
      private int createdBy;
      private int updatedBy;
   }

}
