package com.zionex.t3series.web.domain.admin.user.authority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;
    private final AuthorityQueryRepository authorityQueryRepository;

    public List<Authority> getAuthorities() {
        return authorityRepository.findAll();
    }

    public List<String> getAuthorities(String username) {
        return authorityQueryRepository.getAuthorities(username);
    }

    public Set<GrantedAuthority> getGrantedAuthorities(String username) {
        List<String> authorities = getAuthorities(username);
        return authorities
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    public boolean existsAuthority(String username, String authority) {
        return authorityQueryRepository.existsByUserAndAuthority(username, authority);
    }

    public void saveAuthorities(List<Authority> authorities) {
        authorityRepository.saveAll(authorities);
    }

    public void saveAuthority(Authority authority) {
        if (!authorityRepository.existsByUserIdAndAuthority(authority.getUserId(), authority.getAuthority())) {
            authorityRepository.save(authority);
        }
    }

    public void deleteAuthorities(List<String> userIds) {
        authorityRepository.deleteByUserIdIn(userIds);
    }

    public void deleteAuthority(String userId, String authority) {
        authorityRepository.deleteByUserIdAndAuthority(userId, authority);
    }
}
