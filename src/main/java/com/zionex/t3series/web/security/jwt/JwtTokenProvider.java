package com.zionex.t3series.web.security.jwt;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.zionex.t3series.ApplicationProperties;
import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private String secretKey = "WelcomeToT3SmartSCM!";
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String AUTHORITY = "Authority";

    private long expirationTime = 43200 * 1000;

    private final UserService userService;
    private final ApplicationProperties applicationProperties;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
        int timeout = applicationProperties.getSession().getTokenValidTimeout();
        expirationTime = (timeout == 0) ? expirationTime : timeout * 1000;
    }

    public String createToken(UserDetails userDetails, String jti) {
        Claims claims = Jwts.claims().setSubject(userDetails.getUsername()).setId(jti);
        Date now = new Date();

        List<String> authorities = userDetails.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList());

        claims.put(AUTHORITY, authorities);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String createTokenTemp(String jti) {
        Claims claims = Jwts.claims().setId(jti);
        Date now = new Date();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    @SuppressWarnings("unchecked")
    public Authentication getAuthentication(String jwtToken) {
        Claims claims = parseClaims(jwtToken);
        Set<SimpleGrantedAuthority> grantedAuthorities = ((List<String>) claims.get(AUTHORITY))
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(claims.getSubject(), "", grantedAuthorities);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String getUsername(String jwtToken) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken).getBody().getSubject();
    }

    public String resolveToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.isNotBlank(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return token;
        }

        return null;
    }

    public Claims parseClaims(String jwtToken) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken).getBody();
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: " + e.getMessage());
            throw new IllegalArgumentException("Invalid JWT signature", e);
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: " + e.getMessage());
            throw new IllegalArgumentException("Expired JWT token", e);
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: " + e.getMessage());
            throw new IllegalArgumentException("Invalid JWT token", e);
        } catch (Exception e) {
            log.error("Error while parsing JWT token: " + e.getMessage());
            throw new IllegalStateException("Error while parsing JWT token", e);
        }
    }

    public boolean validateToken(String jwtToken) {
        try {
            Claims claims = parseClaims(jwtToken);
            if (claims.getExpiration().before(new Date())) {
                return false;
            } else {
                User user = userService.getUser(claims.getSubject());
                if (StringUtils.equals(user.getJti(), claims.getId())) {
                    LocalDateTime jtiExpiredDttm = user.getSessionExpiredDttm();
                    return LocalDateTime.now().isBefore(jtiExpiredDttm);
                } else {
                    return false;
                }
            }
        } catch (Exception e) {
            log.error("Exception occurred while validating token", e);
            return false;
        }
    }

    public String getTokenId(HttpServletRequest request) {
        String token = resolveToken(request);
        try {
            Claims claims = parseClaims(token);
            return claims.isEmpty() ? null : claims.getId();
        } catch (Exception e) {
            log.error("Exception occurred while parsing token", e);
            return null;
        }
    }

}
