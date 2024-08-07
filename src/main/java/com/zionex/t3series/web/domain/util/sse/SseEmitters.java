package com.zionex.t3series.web.domain.util.sse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;

import lombok.extern.slf4j.Slf4j;

class NotiInfo {

    public String viewId;
    public String subject;
    public SseEmitter emitter;

    public Set<String> userList;

    public NotiInfo(String viewId, String subject, SseEmitter emitter) {
        this.viewId = viewId;
        this.subject = subject;
        this.emitter = emitter;
        userList = new HashSet<String>();
    }

    public void addUser(String userName) {
        this.userList.add(userName);
    }

    public List<String> getUserList() {
        List<String> arr = new ArrayList<>(this.userList);
        return arr;
    }
}

@Component
@Slf4j
public class SseEmitters {

    private final List<NotiInfo> emitters = new CopyOnWriteArrayList<>();

    @Autowired
    private UserService userService;

    void removeNotiInfo(SseEmitter emitter) {

        for (int i = 0; i < this.emitters.size(); i++) {
            NotiInfo notiInfo = (NotiInfo) this.emitters.get(i);
            if (notiInfo.emitter == emitter) {
                // log.info("{} {} eitter complete and removed: {}", notiInfo.viewId, notiInfo.subject, notiInfo.emitter);
                this.emitters.remove(i);
                notiInfo = null;
                break;
            }
        }

    }

    SseEmitter add(String viewId, String subject, SseEmitter emitter) {
        this.emitters.add(new NotiInfo(viewId, subject, emitter));
        // log.info("new emitter added: {} {} {}", viewId, subject, emitter);
        // log.info("emitter list size: {}", emitters.size());

        emitter.onCompletion(() -> {
            this.removeNotiInfo(emitter); // 만료되면 리스트에서 삭제
        });
        emitter.onTimeout(() -> {
            // log.info("onTimeout callback");
            emitter.complete();
        });

        return emitter;
    }

    private boolean isEqual(String v1, String v2) {
        if (StringUtils.isEmpty(v1) && StringUtils.isEmpty(v2)) {
            return true;
        } else {
            if (StringUtils.isEmpty(v1) || StringUtils.isEmpty(v2))
                return false;
            else if (v1.equals(v2))
                return true;
            else
                return false;
        }

    }

    @SuppressWarnings("unchecked")
    public void sse_update(String viewId, String subject, String userId, String content) {
        JSONObject data = new JSONObject();
        data.put("viewId", viewId);
        data.put("subject", subject);
        data.put("userId", userId);
        data.put("content", content);

        emitters.forEach(notiInfo -> {
            /* viewId와 subject가 같은 subscriber 에게 보낸다. */
            if (isEqual(notiInfo.viewId, viewId) && isEqual(notiInfo.subject, subject)) {
                notiInfo.addUser(userId);

                SseEmitter emitter = notiInfo.emitter;
                try {
                    emitter.send(SseEmitter.event()
                            .name("content")
                            .data(data.toJSONString()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    public List<User> sse_getusers(String viewId, String subject) {
        List<User> ret = new ArrayList<User>();

        for (int i = 0; i < emitters.size(); i++) {
            NotiInfo notiInfo = emitters.get(i);
            if (isEqual(notiInfo.viewId, viewId) && isEqual(notiInfo.subject, subject)) {

                List<String> usrs = notiInfo.getUserList();
                usrs.forEach(userName -> {
                    User user = userService.getUserOrNull(userName);
                    if (user != null)
                        ret.add(user);
                });

                break;
            }
        }
        return ret;
    }

}
