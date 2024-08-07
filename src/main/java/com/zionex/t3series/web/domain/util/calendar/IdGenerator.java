package com.zionex.t3series.web.domain.util.calendar;
import java.util.UUID;

public class IdGenerator {

    public static String generateId() {
        // UUID 생성
        UUID uuid = UUID.randomUUID();

        // UUID를 문자열로 변환하고 하이픈 제거
        return uuid.toString().replace("-", "");
    }
}