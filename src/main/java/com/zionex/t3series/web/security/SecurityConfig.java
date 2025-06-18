package com.zionex.t3series.web.security;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.zionex.t3series.ApplicationProperties;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.security.authentication.AuthenticationFilter;
import com.zionex.t3series.web.security.authentication.CustomLogoutHandler;
import com.zionex.t3series.web.security.authentication.UserDetailService;
import com.zionex.t3series.web.security.encoder.SecurityPasswordEncoder;
import com.zionex.t3series.web.security.jwt.JwtAuthenticationEntryPoint;
import com.zionex.t3series.web.security.jwt.JwtAuthenticationFilter;
import com.zionex.t3series.web.security.jwt.JwtTokenProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserService userService;
    private final UserDetailService userDetailService;
    private final JwtTokenProvider jwtTokenProvider;
    private final List<String> corsAllowUrl;
    private final List<String> corsAllowPath;

    private static final String[] NOT_ALLOWED_PATTERN = { "/**", "/*" };

    private static final String DEV_SERVER = "http://localhost:3000";

    private String[] accessAllUrl = {
            "/",
            "/edu/**",
            "/js/**",
            "/css/**",
            "/fonts/**",
            "/images/**",
            "/docimages/**",
            "/externalimage/**",
            "/document/**",
            "/favicon.ico",
            "/license/**",
            "/zionex-msg/**",
            "/themes/**",
            "/system/settings/{config}",
            "/shrturl/**",
            "/util/exceldown"
    };

    private final String[] accessAdminUrl = {
            "/system/users",
            "/system/users/password-reset",
            "/system/users/login-unlock",
            "/system/users/permissions",
            "/system/users/{username}/permissions/**",
            "/system/groups/**",
            "/system/logs/*",
            "/system/menus/**",
            "/system/users/{group-cd}/except",
            "/system/users/delegations/**",
            "/system/users/*/delegations",
            "/system/themes/**"
    };

    private final String[] accessUserGetUrl = {
            "/system/users/{username}/permissions/{menu-cd}/{permission-type}",
            "/system/users/permissions/{menu-cd}",
            "/system/menus",
            "/system/menus/badges",
            "/system/themes"
    };

    private final String[] accessUserPostUrl = {
            "/system/menus/bookmark*",
            "/system/logs/view-execution"
    };

    public SecurityConfig(UserService userService, UserDetailService userDetailService,
                          JwtTokenProvider jwtTokenProvider, ApplicationProperties applicationProperties) throws Exception {
        this.userService = userService;
        this.userDetailService = userDetailService;
        this.jwtTokenProvider = jwtTokenProvider;
        corsAllowUrl = applicationProperties.getAuthentication().getCorsAllowUrl();
        corsAllowPath = applicationProperties.getAuthentication().getCorsAllowPath();

        if (!CollectionUtils.isEmpty(corsAllowPath)) {
            for (String path : corsAllowPath) {
                if (!isValidPattern(path)) {
                    throw new IllegalArgumentException(path + " is not an allowed pattern. Please change the cors-allow-path value.(application.yaml)");
                }
                int count = accessAllUrl.length;
                accessAllUrl = Arrays.copyOf(accessAllUrl, count + 1);
                accessAllUrl[count] = path;
            }
        }
    }

    private boolean isValidPattern(String path) {
        return !ArrayUtils.contains(NOT_ALLOWED_PATTERN, path) || (corsAllowUrl.contains(DEV_SERVER) && corsAllowUrl.size() == 1);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new SecurityPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setHideUserNotFoundExceptions(false);
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationFilter authenticationFilter() throws Exception {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(authenticationManagerBean(), jwtTokenProvider);
        authenticationFilter.setFilterProcessesUrl("/authentication");
        return authenticationFilter;
    }

    @Bean
    public LogoutHandler logoutHandler() {
        return new CustomLogoutHandler(jwtTokenProvider, userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests(authorize -> authorize
                        .antMatchers(accessAllUrl).permitAll()
                        .antMatchers(HttpMethod.GET, accessUserGetUrl).hasAuthority("USER")
                        .antMatchers(HttpMethod.POST, accessUserPostUrl).hasAuthority("USER")
                        .antMatchers(accessAdminUrl).hasAuthority("ADMIN")
                        .anyRequest().authenticated())
                .cors(cors -> {
                    if (CollectionUtils.isEmpty(corsAllowPath)) {
                        cors.configure(http);
                    } else {
                        cors.configurationSource(corsConfigurationSource());
                    }
                })
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions().disable())
                .formLogin(login -> login.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .logout(logout -> logout
                        .addLogoutHandler(logoutHandler())
                        .logoutSuccessUrl("/#/login")
                        .clearAuthentication(true))
                .addFilter(authenticationFilter())
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, userService), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(handling -> handling.authenticationEntryPoint(new JwtAuthenticationEntryPoint()));
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(corsAllowUrl);
        configuration.addAllowedHeader(CorsConfiguration.ALL);
        configuration.addAllowedMethod(CorsConfiguration.ALL);
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        for (String path : corsAllowPath) {
            source.registerCorsConfiguration(path, configuration);
        }
        return source;
    }

}
