//package com.WTFCapestone.Capestone.security;
//
//import io.github.bucket4j.*;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.web.filter.OncePerRequestFilter;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.time.Duration;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Component
//public class RateLimitFilter extends OncePerRequestFilter {
//
//    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
//
//    private Bucket createNewBucket() {
//
//        Bandwidth limit =
//                Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
//
//        return Bucket.builder().addLimit(limit).build();
//    }
//
//    private Bucket resolveBucket(String ip) {
//        return buckets.computeIfAbsent(ip, k -> createNewBucket());
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String path = request.getRequestURI();
//
//        if (path.contains("/auth/login")) {
//
//            String ip = request.getRemoteAddr();
//            Bucket bucket = resolveBucket(ip);
//
//            if (!bucket.tryConsume(1)) {
//
//                // ⭐ DO NOT BLOCK
//                // Instead SLOW DOWN attacker
//
//                try {
//                    Thread.sleep(1200);   // delay request
//                } catch (InterruptedException e) {
//                    Thread.currentThread().interrupt();
//                }
//            }
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}











package com.WTFCapestone.Capestone.security;

import io.github.bucket4j.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket resolveBucket(String ip) {
        return buckets.computeIfAbsent(ip, k -> createNewBucket());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ only protect login endpoint
        if (path.contains("/auth/login")) {

            String ip = request.getRemoteAddr();
            Bucket bucket = resolveBucket(ip);

            if (!bucket.tryConsume(1)) {
                response.setStatus(429);
                response.getWriter().write("Too many login attempts. Try again later.");
                return;
            }
        }
        //here the user see this but this is protecting the server, I would love for the user to see account logged message
        //or "Too many attempts, account locked. tyr again after 15mins." from AuthServiceImpl instead of this

        filterChain.doFilter(request, response);
    }
}