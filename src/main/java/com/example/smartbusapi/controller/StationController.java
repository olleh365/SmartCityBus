package com.example.smartbusapi.controller;

import com.example.smartbusapi.model.Station;
import com.example.smartbusapi.service.StationService;
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
public class StationController {

    @Value("${api.serviceKey}")
    private String serviceKey;

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @PostMapping("/create/station")
    public String createStation(@RequestBody Station station) throws InterruptedException, ExecutionException, IOException {
        getStationData(station);
        return "api db에 저장 완료";
    }

    @GetMapping("/get/station")
    public Station getStation(@RequestParam String nodenm) throws InterruptedException, ExecutionException{
        System.out.println("보낸 nodenm : " + nodenm);
        return stationService.getStation(nodenm);
    }

    @GetMapping("/get/station/all")
    public List<Station> getStationList() throws InterruptedException, ExecutionException{
        return stationService.getStationList();
    }

    @PutMapping("/update/station")
    public String updateStation(@RequestBody Station station) throws InterruptedException, ExecutionException{
        return stationService.updateStation(station);
    }

    @DeleteMapping("/delete/station")
    public String deleteStation(@RequestParam String nodenm) {
        return stationService.deleteStation(nodenm);
    }

    // 정류소 api 요청하는 함수
    private void getStationData (Station station) throws InterruptedException, ExecutionException, IOException {
        // 요청에 사용할 이름 리스트
        List<String> searchNms = Arrays.asList("대구대", "내리리", "상림리");
        // 도시 코드 리스트
        List<String> cityCode = Arrays.asList("22", "37100");
        // 2중 반복 지역(대구, 경산)별로 정류장 요청, 같은 정류장이여도 대구 버스가 오면 대구로 경산 버스가 오면 경산으로 요청해야함.
        for (String citycode : cityCode) {
            // 도시 이름을 보내기 위해 변수 추가
            String city = null;
            if (citycode == "22") { city = "대구"; }
            else { city = "경산"; }
            for (String searchNm : searchNms) {
                StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnNoList"); /*URL*/
                urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + serviceKey); /*Service Key*/
                urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지번호*/
                urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode("10", "UTF-8")); /*한 페이지 결과 수*/
                urlBuilder.append("&" + URLEncoder.encode("_type", "UTF-8") + "=" + URLEncoder.encode("json", "UTF-8")); /*데이터 타입(xml, json)*/
                urlBuilder.append("&" + URLEncoder.encode("cityCode", "UTF-8") + "=" + URLEncoder.encode(citycode, "UTF-8")); /*도시코드*/
                urlBuilder.append("&" + URLEncoder.encode("nodeNm", "UTF-8") + "=" + URLEncoder.encode(searchNm, "UTF-8")); /*정류소명*/
                // 정류소번호는 옵션이라 값 없이 보내도 출력에 정류소번호를 알려준다. 안넣으면 안알려줌.
                urlBuilder.append("&" + URLEncoder.encode("nodeNo", "UTF-8") + "=" + URLEncoder.encode("", "UTF-8")); /*정류소번호*/
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

                // JSON 파싱을 위한 ObjectMapper 생성
                ObjectMapper objectMapper = new ObjectMapper();
                // sb에 JSON 데이터를 저장
                JsonNode rootNode = objectMapper.readTree(sb.toString());
                // "response" 객체 안에 "body" 객체, "items" 배열 등으로 이동하며 원하는 데이터 추출
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
                            // 검색 결과가 단일 결과, 다중 결과로 나오기 때문에 조건에 따라 처리
                            if (item != null) {
                                if (item.isArray() && item.size() > 0) {
                                    for (int i = 0; i < item.size(); i++) {
                                        JsonNode curItem = item.get(i);
                                        processStation(curItem, station, city);
                                    }
                                } else {
                                    processStation(item, station, city);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // 사용할 정류소명 리스트
    private List<String> stationNms = Arrays.asList("대구대(정문1)", "대구대(정문2)", "대구대서문", "내리리입구", "상림리", "대구대삼거리(대구방향)");

    // 정류소 DB저장을 처리하는 함수
    private void processStation (JsonNode item, Station station, String city) throws ExecutionException, InterruptedException {
        // "gpslati", "gpslong", "nodeid", "nodenm", "nodeno" 추출
        JsonNode gpslatiNode = item.get("gpslati");
        JsonNode gpslongNode = item.get("gpslong");
        JsonNode nodeidNode = item.get("nodeid");
        JsonNode nodenmNode = item.get("nodenm");
        JsonNode nodenoNode = item.get("nodeno");
        System.out.println(gpslatiNode + " " + gpslongNode + " " + nodeidNode + " " + nodenmNode + " " + nodenoNode);
        // 대구대, 상림리, 내리리를 검색하면 필요하지 않은 정류장도 나온다.
        // 조건(contains 사용)으로 필요한 정류장만 저장하도록 설정.
        if (stationNms.contains(nodenmNode.asText()) && gpslatiNode != null && gpslongNode != null && nodeidNode != null && nodenmNode != null) {
            String gpslati = gpslatiNode.asText();
            String gpslong = gpslongNode.asText();
            String nodeid = nodeidNode.asText();
            String nodenm = nodenmNode.asText();
            // 정류소 번호가 없는 정류소는 생략
            String nodeno = null;
            if (nodenoNode != null) {nodeno = nodenoNode.asText();}
            System.out.println(gpslati + " " + gpslong + " " + nodeid + " " + nodenm + " " + nodeno);
            // 다중 컬렉션을 위한 도시 지정
            station.setCity(city);
            // Station 컬렉션에 설정
            station.setGpslati(gpslati);
            station.setGpslong(gpslong);
            station.setNodeid(nodeid);
            // 특수문자(), 공백은 NOSQL에 넣을 수 없기 때문에 다른문자로 대체한다.
            station.setNodenm(nodenm.replace(" ", "_").replace("(", "-").replace(")", "-"));
            // 정류소 번호가 없는 정류소도 있음, 조건문으로 처리
            if (nodeno != null) {station.setNodeno(nodeno);}
            stationService.createStation(station, city);
        }
    }
}
