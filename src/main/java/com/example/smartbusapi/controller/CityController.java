package com.example.smartbusapi.controller;

import com.example.smartbusapi.model.City;
import com.example.smartbusapi.service.CityService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.concurrent.ExecutionException;

@RestController
public class CityController {

    @Value("${api.serviceKey}")
    private String serviceKey;

    public final CityService cityService;

    public CityController(CityService cityService){
        this.cityService = cityService;
    }

    @PostMapping("/create/city")
    public String createCity(@RequestBody City city) throws InterruptedException, ExecutionException, IOException {
        // OpenAPI 도시코드 목록 조회
        StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/1613000/BusLcInfoInqireService/getCtyCodeList"); /*URL*/
        urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=" + serviceKey); /*Service Key*/
        urlBuilder.append("&" + URLEncoder.encode("_type","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8")); /*데이터 타입(xml, json)*/
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        System.out.println("Response code: " + conn.getResponseCode());
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        // JSON 파싱을 위한 ObjectMapper 생성
        ObjectMapper objectMapper = new ObjectMapper();
        // sb에 JSON 데이터를 저장
        JsonNode rootNode = objectMapper.readTree(sb.toString());
        // "response" 객체 안에 "body" 객체, "items" 배열, "item"배열 등으로 이동하며 원하는 데이터 추출
        JsonNode response = rootNode.get("response");
        System.out.println("response : " + response);
        if (response != null) {
            JsonNode body = response.get("body");
            System.out.println("body : " + body);
            if (body != null) {
                JsonNode items = body.get("items");
                System.out.println("items : " + items);
                if (items != null) {
                    // "item" 객체 가져오기
                    JsonNode item = items.get("item");
                    System.out.println("item : " + item);
                    // item이 비어있는가, 배열인가, 사이즈가 있는가 확인하는 문장 필요시 주석 제거
//                    System.out.println(item != null);
//                    System.out.println(item.isArray());
//                    System.out.println(item.size());
                    if (item != null && item.isArray() && item.size() > 0) {
                        for (int i = 0; i < item.size(); i++) {
                            JsonNode curItem = item.get(i);
                            System.out.println(curItem);
                            // "cityname"과 "citycode" 추출
                            JsonNode cityNameNode = curItem.get("cityname");
                            JsonNode cityCodeNode = curItem.get("citycode");
                            System.out.println(cityNameNode + " " + cityCodeNode);
                            if (cityNameNode != null && cityCodeNode != null) {
                                String cityname = cityNameNode.asText();
                                String citycode = cityCodeNode.asText();
                                // cityname와 citycode를 City 컬렉션에 설정
                                // cityname 속성에 / 문자가 포함되어 있는 경우, 이를 - 문자로 대체
                                // NOSQL에는 / 문자를 넣을 수 없기 때문이다.
                                city.setCityname(cityname.replace("/", "-"));
                                city.setCitycode(citycode);
                                cityService.createCity(city);
                            }
                        }
                    }
                }
            }
        }
        return "api db에 저장 완료";
    }

    @GetMapping("/get/city")
    public City getCity(@RequestParam String cityname) throws InterruptedException, ExecutionException{
        System.out.println("보낸 cityname : " + cityname);
        return cityService.getCity(cityname);
    }

    @PutMapping("/update/city")
    public String updateCity(@RequestBody City city) throws InterruptedException, ExecutionException{
        return cityService.updateCity(city);
    }

    @DeleteMapping("/delete/city")
    public String deleteCity(@RequestParam String cityname) {
        return cityService.deleteCity(cityname);
    }

}