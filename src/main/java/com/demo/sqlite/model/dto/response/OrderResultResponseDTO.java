package com.demo.sqlite.model.dto.response;

import com.demo.sqlite.model.dto.ProductOrderDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResultResponseDTO {

   private Integer id;
   private String paymentMethod;
   private Double total;
   private Timestamp createdAt;
   private List<ProductOrderDTO> products;

   public Integer getId() {
      return id;
   }

   public void setId(Integer id) {
      this.id = id;
   }

   public String getPaymentMethod() {
      return paymentMethod;
   }

   public void setPaymentMethod(String paymentMethod) {
      this.paymentMethod = paymentMethod;
   }

   public Double getTotal() {
      return total;
   }

   public void setTotal(Double total) {
      this.total = total;
   }

   public Timestamp getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(Timestamp createdAt) {
      this.createdAt = createdAt;
   }

   public List<ProductOrderDTO> getProducts() {
      return products;
   }

   public void setProducts(List<ProductOrderDTO> products) {
      this.products = products;
   }

   public static Builder builder() {
      return new Builder();
   }

   public static class Builder {
      public Builder id(Integer id) {
         this.id = id;
         return this;
      }

      public Builder paymentMethod(String paymentMethod) {
         this.paymentMethod = paymentMethod;
         return this;
      }

      public Builder total(Double total) {
         this.total = total;
         return this;
      }

      public Builder createdAt(Timestamp createdAt) {
         this.createdAt = createdAt;
         return this;
      }

      public Builder products(List<ProductOrderDTO> products) {
         this.products = products;
         return this;
      }

      public OrderResultResponseDTO build() {
         OrderResultResponseDTO dto = new OrderResultResponseDTO();
         dto.setId(id);
         dto.setPaymentMethod(paymentMethod);
         dto.setTotal(total);
         dto.setCreatedAt(createdAt);
         dto.setProducts(products);
         return dto;
      }

      private Integer id;
      private String paymentMethod;
      private Double total;
      private Timestamp createdAt;
      private List<ProductOrderDTO> products;
   }

}
