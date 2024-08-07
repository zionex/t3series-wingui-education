package com.zionex.t3series.web.domain.admin.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zionex.t3series.ApplicationProperties;
import com.zionex.t3series.web.util.ResponseData;

import lombok.extern.java.Log;

@Log
@RestController
public class ImageUploadController extends ResponseData {

    private final ApplicationProperties.Service.File fileProps;

    public ImageUploadController(ApplicationProperties applicationProperties) {
        this.fileProps = applicationProperties.getService().getFile();
    }

    @RequestMapping(value = "/common/uimage", method = { RequestMethod.POST, RequestMethod.GET })
    public void uploadImage(@RequestParam("file") MultipartFile file, HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String externalPath = fileProps.getExternalPath();
            String uploadPath = externalPath + fileProps.getName() + "/" + fileProps.getCategory().getSystem();

            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = file.getOriginalFilename();
            int index = fileName.replaceAll("\\\\", "/").lastIndexOf("/");
            fileName = fileName.substring(index + 1);

            String location = uploadPath + File.separator + fileName;
            File imgFile = new File(location);

            byte[] data = file.getBytes();
            FileOutputStream out = new FileOutputStream(location);
            out.write(data);
            out.close();

            String fileUrl = "/docimages/" + imgFile.getName();

            responseResult(response, fileUrl);

        } catch (Exception e) {
            e.printStackTrace();
            log.warning(e.getMessage());
            responseError(response, e.getMessage());
        }
    }

    @RequestMapping(value = "/docimages/{image}", method = { RequestMethod.POST, RequestMethod.GET })
    protected ResponseEntity<UrlResource> exportExcel(HttpServletRequest request, HttpServletResponse response, @PathVariable String image) throws MalformedURLException, UnsupportedEncodingException {
        String externalPath = fileProps.getExternalPath();
        String uploadPath = externalPath + fileProps.getName() + "/" + fileProps.getCategory().getSystem();

        String location = uploadPath + File.separator + image;
        File imgFile = new File(location);

        if (imgFile.exists()) {

        }

        String fileName = StringUtils.cleanPath(image.replaceAll("\r", "").replaceAll("\n", "")).replaceAll("../", "");
        String contentDisposition = "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + "\"";

        UrlResource resource = new UrlResource("file:" + location);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);
    }

}
