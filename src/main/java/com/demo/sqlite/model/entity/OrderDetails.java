package com.demo.sqlite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "order_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetails {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   @Column(name = "order_id")
   private int orderId;
   @Column(name = "product_code")
   private int productCode;
   private int quantity;
   private double price;

   public int getId() {
      return id;
   }

   public void setId(int id) {
      this.id = id;
   }

   public int getOrderId() {
      return orderId;
   }

   public void setOrderId(int orderId) {
      this.orderId = orderId;
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

   public double getPrice() {
      return price;
   }

   public void setPrice(double price) {
      this.price = price;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder id(int id) {
         this.id = id;
         return this;
      }

      public Builder orderId(int orderId) {
         this.orderId = orderId;
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

      public Builder price(double price) {
         this.price = price;
         return this;
      }

      public OrderDetails build() {
         OrderDetails details = new OrderDetails();
         details.setId(id);
         details.setOrderId(orderId);
         details.setProductCode(productCode);
         details.setQuantity(quantity);
         details.setPrice(price);
         return details;
      }

      private int id;
      private int orderId;
      private int productCode;
      private int quantity;
      private double price;
   }

}
