package com.zionex.t3series.web.util.interceptor;

import static com.zionex.t3series.web.constant.ApplicationConstants.CONTENT_TYPE_JSON;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.microsoft.sqlserver.jdbc.StringUtils;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.admin.user.permission.PermissionService;
import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExecPermissionInterceptor implements HandlerInterceptor {

    @Autowired
    private PermissionService permissionService;

    private final AuthenticationManager authenticationManager;
    private final LangPackService langPackService;

    @SuppressWarnings("unchecked")
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        ExecPermission execPermission = ((HandlerMethod) handler).getMethodAnnotation(ExecPermission.class);
        com.zionex.t3series.common.util.ExecPermission fpExecPermission = ((HandlerMethod) handler).getMethodAnnotation(com.zionex.t3series.common.util.ExecPermission.class);
        if (execPermission == null && fpExecPermission == null) {
            return true;
        }

        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        String userId = authenticationInfo.getUserId();

        String menuCd = "";
        String type = "";
        if (execPermission != null) {
            menuCd = execPermission.menuCd();
            type = execPermission.type();
        } else {
            menuCd = fpExecPermission.menuCd();
            type = fpExecPermission.type();
        }

        if (StringUtils.isEmpty(menuCd)) {
            menuCd = request.getParameter(ServiceConstants.PARAMETER_KEY_MENU_CD);
        }

        String message = "Fail check permission : No menu code";
        if (!StringUtils.isEmpty(menuCd)) {
            boolean checkPermission = permissionService.checkPermission(userId, menuCd, type);
            if (checkPermission) {
                return true;
            }
            message = String.format(langPackService.getLanguageValue("MSG_FAIL_PERMISSION_CHECK"),
                                    langPackService.getLanguageValue(menuCd), type);
        }

        JSONObject error = new JSONObject();
        error.put("errCode", HttpStatus.SERVICE_UNAVAILABLE.value());
        error.put("errMsg", message);

        response.setContentType(CONTENT_TYPE_JSON);
        PrintWriter out = response.getWriter();
        out.print(error);
        out.flush();
        out.close();

        return false;
    }

}
