package com.zionex.t3series.web.util.interceptor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.zionex.t3series.web.security.jwt.JwtTokenProvider;
import com.zionex.t3series.web.util.BeanUtil;

/**
 * JWT기준 세션 단위 속성을 유지 관리한다.
 * 데이터가 계속 쌓아지기 때문에 세션이 종료되면 해당 내용도 삭제가 되도록
 * 해야 한다.
 */
@Component
public class SessionAttributeManager {

    static Map<String, Map<String, Object>> properties=new HashMap<String, Map<String, Object>>();

    public static Map<String, Object> getAttribute(String tokenId){
        if(tokenId ==null)
            return null;

        Map<String, Object> attribute = properties.get(tokenId);
        if(attribute ==null) {
            attribute=new HashMap<String, Object>();
            properties.put(tokenId, attribute);
        }
        return attribute;
    }   

    public static Object getAttribute(String tokenId,String key){
        if(tokenId ==null)
            return null;

        Map<String, Object> attr= getAttribute(tokenId);
        if(attr !=null) {
            return attr.get(key);
        }
        return null;
    }

    public static String getTokenId(HttpServletRequest request) {
        ApplicationContext applicationContext = RequestContextUtils.findWebApplicationContext(request);
        JwtTokenProvider jwtTokenProvider = (JwtTokenProvider) applicationContext.getBean("jwtTokenProvider");

        String token=jwtTokenProvider.resolveToken(request);
        return token;
    }
    public static Map<String, Object> getAttributes(HttpServletRequest request){
        String tokenId = getTokenId(request);
        if(tokenId==null)
            return null;
        return getAttribute(tokenId);
    }

    public static Object getAttribute(HttpServletRequest request,String key){
        String tokenId = getTokenId(request);
        if(tokenId==null)
            return null;

        Map<String, Object> attr= getAttribute(tokenId);
        if(attr !=null) {
            return attr.get(key);
        }
        return null;
    }

    public static Map<String, Object> setAttribute(HttpServletRequest request, String key, Object value){

        String tokenId = getTokenId(request);
        if(tokenId==null)
            return null;

        Map<String, Object> attribute = properties.get(tokenId);
        if(attribute==null) {
            attribute=new HashMap<String, Object>();
            properties.put(tokenId, attribute);
        }

        attribute.put(key, value);

        return attribute;
    } 

    public static Map<String, Object> setAttribute(String tokenId, String key, Object value){
        if(tokenId==null)
            return null;

        Map<String, Object> attribute = properties.get(tokenId);
        if(attribute==null) {
            attribute=new HashMap<String, Object>();
            properties.put(tokenId, attribute);
        }

        attribute.put(key, value);

        return attribute;
    } 
    
    @Scheduled(fixedRateString = "50000")
    public void processValidation() {

        JwtTokenProvider jwtTokenProvider = (JwtTokenProvider)BeanUtil.getBean("jwtTokenProvider");
        Set<String> tokens=properties.keySet();
        Iterator tokenIter=tokens.iterator();
        
        List<String> removeList=new ArrayList<String>();
        while(tokenIter.hasNext()) {
            String token = (String)tokenIter.next();
            if(jwtTokenProvider.validateToken(token)==false) {
                removeList.add(token);
            }
        }

        for(int i=0; i < removeList.size();i++) {
            String token = removeList.get(i);
            properties.remove(token);
        }
    }
}
