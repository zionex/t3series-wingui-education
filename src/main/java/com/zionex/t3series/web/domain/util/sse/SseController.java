package com.zionex.t3series.web.domain.util.sse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.zionex.t3series.web.domain.admin.user.User;

@RestController
public class SseController {

    private final SseEmitters sseEmitters;

    public SseController(SseEmitters sseEmitters) {
        this.sseEmitters = sseEmitters;
    }

    @GetMapping(value = "/sse_connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect(@RequestParam("VIEWID") String viewId, @RequestParam("SUBJECT") String subject) {
        SseEmitter emitter = new SseEmitter();
        sseEmitters.add(viewId, subject, emitter);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(emitter);
    }

    @PostMapping("/sse_update")
    public ResponseEntity<Void> sse_update(@RequestBody Map<String, Object> paramMap) {
        String viewId = (String) paramMap.get("VIEWID");
        String subject = (String) paramMap.get("SUBJECT");
        String userId = (String) paramMap.get("USERID");
        String content = (String) paramMap.get("CONTENT");

        sseEmitters.sse_update(viewId, subject, userId, content);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sse_getusers")
    public List<User> sse_getusers(@RequestBody Map<String, Object> paramMap) {
        String viewId = (String) paramMap.get("VIEWID");
        String subject = (String) paramMap.get("SUBJECT");

        return sseEmitters.sse_getusers(viewId, subject);
    }

}
