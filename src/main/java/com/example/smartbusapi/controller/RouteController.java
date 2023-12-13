package com.example.smartbusapi.controller;

import com.example.smartbusapi.model.Route;
import com.example.smartbusapi.service.RouteService;
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
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
public class RouteController {

    @Value("${api.serviceKey}")
    private String serviceKey;

    private final RouteService routeService;

    public RouteController(RouteService routeService) { this.routeService = routeService; }

    @PostMapping("/create/route")
    public String createRoute(@RequestBody Route route)throws InterruptedException, ExecutionException, IOException {
        getRouteData(route);
        return "api db에 저장 완료";
    }

    @GetMapping("/get/route")
    public Route getRoute(@RequestParam String routeid) throws InterruptedException, ExecutionException {
        System.out.println("보낸 routeid : " + routeid);
        return routeService.getRoute(routeid);
    }

    @GetMapping("/get/route/all")
    public List<Route> getRouteList() throws InterruptedException, ExecutionException{
        return routeService.getRouteList();
    }

    @PutMapping("/update/route")
    public String updateRoute(@RequestBody Route route) throws InterruptedException, ExecutionException{
        return routeService.updateRoute(route);
    }

    @DeleteMapping("/delete/route")
    public String deleteRoute(@RequestParam String routeid) {
        return routeService.deleteRoute(routeid);
    }

    // 노선 API 요청 함수
    private void getRouteData(Route route) throws InterruptedException, ExecutionException, IOException {
        // 같은 정류장이지만 도시별로 요청해야함
        List<List<String>> reqDatas = Arrays.asList(Arrays.asList("22","DGB7121008400"), Arrays.asList("37100", "GYB360008400"));

        for (List<String> reqData : reqDatas) {
            StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList"); /*URL*/
            urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + serviceKey); /*Service Key*/
            urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지번호*/
            urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode("10", "UTF-8")); /*한 페이지 결과 수*/
            urlBuilder.append("&" + URLEncoder.encode("_type", "UTF-8") + "=" + URLEncoder.encode("json", "UTF-8")); /*데이터 타입(xml, json)*/
            urlBuilder.append("&" + URLEncoder.encode("cityCode", "UTF-8") + "=" + URLEncoder.encode(reqData.get(0), "UTF-8")); /*도시코드 [상세기능3 도시코드 목록 조회]에서 조회 가능*/
            urlBuilder.append("&" + URLEncoder.encode("nodeId", "UTF-8") + "=" + URLEncoder.encode(reqData.get(1), "UTF-8")); /*정류소ID [국토교통부(TAGO)_버스정류소정보]에서 조회가능*/
            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
//                System.out.println("Response code: " + conn.getResponseCode());
            BufferedReader rd;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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

            System.out.println("도시 코드 : " + reqData.get(0));

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(sb.toString());
            JsonNode response = rootNode.get("response");
//                System.out.println("response : " + response);
            if (response != null) {
                JsonNode body = response.get("body");
//                    System.out.println("body : " + body);
                if (body != null) {
                    JsonNode items = body.get("items");
//                        System.out.println("items : " + items);
                    if (items != null) {
                        // "item" 객체 가져오기
                        JsonNode item = items.get("item");
                        System.out.println("item : " + item);
                        // 검색 결과가 단일 결과, 다중 결과로 나오기 때문에 조건에 따라 처리
                        if (item != null) {
                            if (item.isArray() && item.size() > 0) {
                                for (int i = 0; i < item.size(); i++) {
                                    JsonNode curItem = item.get(i);
                                    if (checkData(curItem)) {
                                        System.out.println(curItem + " 미 중복 추가 완료");
                                        processVehicle(curItem, route);}
                                }
                            } else {
                                if (checkData(item)) {
                                    System.out.println(item + " 미 중복 추가 완료");
                                    processVehicle(item, route);}
                            }
                        }
                    }
                }
            }
        }
    }

    // 노선 DB 저장을 처리하는 함수
    private void processVehicle (JsonNode item, Route route) throws InterruptedException, ExecutionException {
        JsonNode routeidNode = item.get("routeid");
        JsonNode routenoNode = item.get("routeno");
//        System.out.println(routeidNode + " " + routenoNode);
        if (routeidNode != null && routenoNode != null) {
            String routeid = routeidNode.asText();
            String routeno = routenoNode.asText();
            System.out.println(routeid + " " + routeno);
            // Route 컬렉션에 설정
            route.setRouteid(routeid);
            route.setRouteno(routeno);
            routeService.createRoute(route);
        }
    }

    // api에서 응답받은 정보가 DB 안에 있는지 확인하는 함수
    private boolean checkData (JsonNode item) throws InterruptedException, ExecutionException{
        System.out.println("데이터 체크 시작");
        String routeid = item.get("routeid").asText();
        // Route 컬렉션에 있는지 없는지 확인, 없으면 null반환
        Route checkRoute = routeService.getRoute(routeid);

        // null이라면 true 반환
        return checkRoute == null;
    }
}
