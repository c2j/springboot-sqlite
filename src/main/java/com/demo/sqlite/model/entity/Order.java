package com.demo.sqlite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   @Column(name = "client_id")
   private int clientId;
   @Column(name = "payment_method")
   private String paymentMethod;
   @Column(name = "created_at")
   private Timestamp createdAt;

   public int getId() {
      return id;
   }

   public void setId(int id) {
      this.id = id;
   }

   public int getClientId() {
      return clientId;
   }

   public void setClientId(int clientId) {
      this.clientId = clientId;
   }

   public String getPaymentMethod() {
      return paymentMethod;
   }

   public void setPaymentMethod(String paymentMethod) {
      this.paymentMethod = paymentMethod;
   }

   public Timestamp getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(Timestamp createdAt) {
      this.createdAt = createdAt;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder id(int id) {
         this.id = id;
         return this;
      }

      public Builder clientId(int clientId) {
         this.clientId = clientId;
         return this;
      }

      public Builder paymentMethod(String paymentMethod) {
         this.paymentMethod = paymentMethod;
         return this;
      }

      public Builder createdAt(Timestamp createdAt) {
         this.createdAt = createdAt;
         return this;
      }

      public Order build() {
         Order order = new Order();
         order.setId(id);
         order.setClientId(clientId);
         order.setPaymentMethod(paymentMethod);
         order.setCreatedAt(createdAt);
         return order;
      }

      private int id;
      private int clientId;
      private String paymentMethod;
      private Timestamp createdAt;
   }

}
