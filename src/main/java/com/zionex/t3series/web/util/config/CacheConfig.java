package com.zionex.t3series.web.util.config;

import java.util.List;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    public final static String CODE_CACHE = "CodeCache";

    @Bean
    public CacheManager cacheManager() {
        System.out.println("[+] CacheConfig Start !!! ");

        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setAllowNullValues(false);
        cacheManager.setCacheNames(List.of(CODE_CACHE));
        return cacheManager;
    }

}
