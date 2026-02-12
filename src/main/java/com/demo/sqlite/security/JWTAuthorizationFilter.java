package com.demo.sqlite.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JWTAuthorizationFilter extends OncePerRequestFilter {

   private static final Logger log = LoggerFactory.getLogger(JWTAuthorizationFilter.class);
   private final static String HEADER_AUTHORIZATION_KEY = "Authorization";
   private final static String TOKEN_BEARER_PREFIX = "Bearer ";

   @Value("${app.production.mode:false}")
   private boolean productionMode;

   @Override
   protected void doFilterInternal(HttpServletRequest request,
         HttpServletResponse response,
         FilterChain filterChain) throws ServletException, IOException {
      try {
         if (isJWTValid(request, response)) {
            Claims claims = parseJWT(request);
            if (claims.get("roles") != null) {
               setUpSpringAuthentication(claims);
            } else {
               SecurityContextHolder.clearContext();
            }
         } else {
            SecurityContextHolder.clearContext();
         }
         filterChain.doFilter(request, response);
      } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SecurityException ex) {
         log.warn("Error logging in: {}", ex.getMessage());
         response.setStatus(HttpServletResponse.SC_FORBIDDEN);
         response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
      }
   }

   private Claims parseJWT(HttpServletRequest request) {
      String jwtToken = request.getHeader(HEADER_AUTHORIZATION_KEY).replace(TOKEN_BEARER_PREFIX, "");
      return JWTCoder.parseJWT(jwtToken);
   }

   private void setUpSpringAuthentication(Claims claims) {
      @SuppressWarnings("unchecked")
      List<String> roles = (List<String>) claims.get("roles");
      UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null,
            roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));

      UserAuthenticateInfo userAuthenticateInfo = UserAuthenticateInfo.builder()
            .userId(claims.get("userId", Integer.class))
            .subject(claims.getSubject())
            .roles(roles)
            .build();
      auth.setDetails(userAuthenticateInfo);
      SecurityContextHolder.getContext().setAuthentication(auth);
   }

   private boolean isJWTValid(HttpServletRequest request, HttpServletResponse response) throws IOException {
      String authenticationHeader = request.getHeader(HEADER_AUTHORIZATION_KEY);
      if (authenticationHeader == null || !authenticationHeader.startsWith(TOKEN_BEARER_PREFIX)) {
         return false;
      }

      String jwtToken = authenticationHeader.replace(TOKEN_BEARER_PREFIX, "");
      if (jwtToken == null || jwtToken.isEmpty()) {
         if (productionMode) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Missing JWT token");
         }
         return false;
      }

      // Validate JWT format: must contain exactly 2 periods
      // (header.payload.signature)
      long periodCount = jwtToken.chars().filter(ch -> ch == '.').count();
      if (periodCount != 2) {
         if (productionMode) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid JWT format");
         }
         return false;
      }

      return true;
   }

}