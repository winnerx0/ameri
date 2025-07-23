package com.winnerx0.ameri.utils;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.grid.jcache.JCacheProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

//    private final BucketConfiguration config;

    private ProxyManager<String> proxyManager;

//    public RateLimitingFilter(){
//        CacheManager cacheManager = Caching.getCachingProvider().getCacheManager();
//        MutableConfiguration<String, byte[]> config = new MutableConfiguration<>();
//        javax.cache.Cache<String, byte[]> cache = cacheManager.createCache("tokens", config);
//        this.proxyManager = new JCacheProxyManager<>(cache);
//        this.config = BucketConfiguration
//                .builder()
//                .addLimit(limit -> limit.capacity(3).refillGreedy(3, Duration.ofMinutes(5)))
//                .build();
//    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String key = request.getRemoteAddr();      // or any composite key
//        Bucket bucket = proxyManager.builder().build(key, config);

//        if (bucket.tryConsume(1)) {
//            filterChain.doFilter(request, response);
//        } else {
//            response.setStatus(429);
//            response.getWriter().write("Too Many Requests");
//        }
    }
}
