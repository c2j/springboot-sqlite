package com.demo.sqlite.model.dto;

import com.demo.sqlite.model.entity.Stock;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductOrderDTO {

   private int quantity;
   private double price;
   private Stock stock;

   public ProductOrderDTO(Integer quantity, Double price, Integer code, String description,
         int category, String status) {
      this.quantity = quantity;
      this.price = price;
      this.stock = Stock.builder().code(code).description(description).categoryId(category)
            .status(status).build();
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

   public Stock getStock() {
      return stock;
   }

   public void setStock(Stock stock) {
      this.stock = stock;
   }

}
