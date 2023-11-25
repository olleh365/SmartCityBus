package com.example.smartbusapi.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Station {
    private String city;    //도시이름
    private String gpslati; //정류소 Y좌표
    private String gpslong; //정류소 X좌표
    private String nodeid;  //정류소 ID
    private String nodenm;  //정류소 명
    private String nodeno;  //정류소 번호
}
