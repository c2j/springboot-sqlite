package com.demo.sqlite.model.dto.response;

import com.demo.sqlite.model.dto.ProductCartDTO;
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
public class ShoppingCartResultResponseDTO {

   private Integer clientId;
   private Double total;
   private Iterable<ProductCartDTO> products;

   public Integer getClientId() {
      return clientId;
   }

   public void setClientId(Integer clientId) {
      this.clientId = clientId;
   }

   public Double getTotal() {
      return total;
   }

   public void setTotal(Double total) {
      this.total = total;
   }

   public Iterable<ProductCartDTO> getProducts() {
      return products;
   }

   public void setProducts(Iterable<ProductCartDTO> products) {
      this.products = products;
   }

   public static ShoppingCartResultResponseDTOBuilder builder() {
      return new ShoppingCartResultResponseDTOBuilder();
   }

   public static class ShoppingCartResultResponseDTOBuilder {
      public ShoppingCartResultResponseDTOBuilder clientId(Integer clientId) {
         this.clientId = clientId;
         return this;
      }

      public ShoppingCartResultResponseDTOBuilder total(Double total) {
         this.total = total;
         return this;
      }

      public ShoppingCartResultResponseDTOBuilder products(Iterable<ProductCartDTO> products) {
         this.products = products;
         return this;
      }

      public ShoppingCartResultResponseDTO build() {
         ShoppingCartResultResponseDTO dto = new ShoppingCartResultResponseDTO();
         dto.setClientId(clientId);
         dto.setTotal(total);
         dto.setProducts(products);
         return dto;
      }

      private Integer clientId;
      private Double total;
      private Iterable<ProductCartDTO> products;
   }

}
