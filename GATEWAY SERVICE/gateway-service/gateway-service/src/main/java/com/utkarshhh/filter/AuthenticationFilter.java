package com.utkarshhh.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> securityContext.getAuthentication())
                .filter(authentication -> authentication instanceof JwtAuthenticationToken)
                .cast(JwtAuthenticationToken.class)
                .flatMap(jwtAuth -> {
                    Jwt jwt = jwtAuth.getToken();

                    // Extract user info from JWT token
                    String userId = jwt.getClaimAsString("sub");
                    String userName = jwt.getClaimAsString("name");
                    String userEmail = jwt.getClaimAsString("email");

                    // Fallback if claims are missing
                    if (userName == null) userName = jwt.getClaimAsString("preferred_username");
                    if (userEmail == null) userEmail = jwt.getClaimAsString("email");

                    // Log for debugging
                    System.out.println("🔑 Gateway adding headers:");
                    System.out.println("   User-Id: " + userId);
                    System.out.println("   User-Name: " + userName);
                    System.out.println("   User-Email: " + userEmail);

                    // Add headers to downstream services
                    ServerHttpRequest request = exchange.getRequest().mutate()
                            .header("User-Id", userId != null ? userId : "")
                            .header("User-Name", userName != null ? userName : "unknown")
                            .header("User-Email", userEmail != null ? userEmail : "noemail@example.com")
                            .build();

                    return Mono.just(exchange.mutate().request(request).build());
                })
                .defaultIfEmpty(exchange)
                .flatMap(chain::filter);
    }

    @Override
    public int getOrder() {
        return -100; // Run before other filters
    }
}