package com.demo.sqlite.model.dto.response;

import com.demo.sqlite.model.entity.Category;
import com.demo.sqlite.model.entity.Stock;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class StockResponseDTO {
   private int code;
   private String description;
   private int quantity;
   private double price;
   private Category category;
   private String status;
   private int createdBy;
   private int updatedBy;

   public StockResponseDTO(Integer code, String description, int category_id, String category_name,
         String category_description, Integer quantity, Double price, String status,
         Integer created_by, Integer updated_by) {
      this.code = code;
      this.description = description;
      this.category = Category.builder()
            .id(category_id)
            .category(category_name)
            .description(category_description)
            .build();
      this.quantity = quantity;
      this.price = price;
      this.status = status;
      this.createdBy = created_by;
      this.updatedBy = updated_by;
   }

   public static StockResponseDTO from(Stock stock, Category category) {
      return new StockResponseDTO(stock.getCode(), stock.getDescription(), category.getId(),
            category.getCategory(), category.getDescription(), stock.getQuantity(),
            stock.getPrice(), stock.getStatus(), stock.getCreatedBy(), stock.getUpdatedBy());
   }

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

   public Category getCategory() {
      return category;
   }

   public void setCategory(Category category) {
      this.category = category;
   }

}
