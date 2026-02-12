package com.demo.sqlite.model.dto;

import com.demo.sqlite.model.entity.Stock;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCartDTO {

   private Integer cartId;
   private Integer quantity;
   private Stock stock;

   public Integer getCartId() {
      return cartId;
   }

   public void setCartId(Integer cartId) {
      this.cartId = cartId;
   }

   public Integer getQuantity() {
      return quantity;
   }

   public void setQuantity(Integer quantity) {
      this.quantity = quantity;
   }

   public Stock getStock() {
      return stock;
   }

   public void setStock(Stock stock) {
      this.stock = stock;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder cartId(Integer cartId) {
         this.cartId = cartId;
         return this;
      }

      public Builder quantity(Integer quantity) {
         this.quantity = quantity;
         return this;
      }

      public Builder stock(Stock stock) {
         this.stock = stock;
         return this;
      }

      public ProductCartDTO build() {
         ProductCartDTO dto = new ProductCartDTO();
         dto.setCartId(cartId);
         dto.setQuantity(quantity);
         dto.setStock(stock);
         return dto;
      }

      private Integer cartId;
      private Integer quantity;
      private Stock stock;
   }

}
