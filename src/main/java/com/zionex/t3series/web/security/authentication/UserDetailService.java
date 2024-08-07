package com.zionex.t3series.web.security.authentication;

import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.admin.user.authority.AuthorityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {

    private final LoginPolicy loginPolicy;

    private final UserService userService;
    private final AuthorityService authorityService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getUser(username);
        if (user.getId() == null) {
            throw new UsernameNotFoundException(username);
        }

        userService.checkUserValidation(user);

        Set<GrantedAuthority> grantedAuthorities = authorityService.getGrantedAuthorities(username);

        if (user.getEnabled()) {
            if (loginPolicy.checkFailureCount(user)) {
                return new UserDetail(user.getUsername(), user.getPassword(), grantedAuthorities);
            } else {
                return new UserDetail(user.getUsername(), user.getPassword(), true, true, true, false, grantedAuthorities);
            }
        } else {
            return new UserDetail(user.getUsername(), user.getPassword(), false, true, true, true, grantedAuthorities);
        }

    }

}
