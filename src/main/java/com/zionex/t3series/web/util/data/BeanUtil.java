package com.zionex.t3series.web.util.data;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class BeanUtil implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        applicationContext = context;
    }

    public static <T> T getBean(Class<T> classType) {
        return applicationContext.getBean(classType);
    }

    public static Object getBean(String beanName) {
        return applicationContext.getBean(beanName);
    }

}
