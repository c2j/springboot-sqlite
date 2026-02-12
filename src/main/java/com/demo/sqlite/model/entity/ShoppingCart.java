package com.demo.sqlite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "shopping_cart")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   @Column(name = "product_code")
   private int productCode;
   private int quantity;
   @Column(name = "client_id")
   private int clientId;

   public int getId() {
      return id;
   }

   public void setId(int id) {
      this.id = id;
   }

   public int getProductCode() {
      return productCode;
   }

   public void setProductCode(int productCode) {
      this.productCode = productCode;
   }

   public int getQuantity() {
      return quantity;
   }

   public void setQuantity(int quantity) {
      this.quantity = quantity;
   }

   public int getClientId() {
      return clientId;
   }

   public void setClientId(int clientId) {
      this.clientId = clientId;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder id(int id) {
         this.id = id;
         return this;
      }

      public Builder productCode(int productCode) {
         this.productCode = productCode;
         return this;
      }

      public Builder quantity(int quantity) {
         this.quantity = quantity;
         return this;
      }

      public Builder clientId(int clientId) {
         this.clientId = clientId;
         return this;
      }

      public ShoppingCart build() {
         ShoppingCart cart = new ShoppingCart();
         cart.setId(id);
         cart.setProductCode(productCode);
         cart.setQuantity(quantity);
         cart.setClientId(clientId);
         return cart;
      }

      private int id;
      private int productCode;
      private int quantity;
      private int clientId;
   }

}
