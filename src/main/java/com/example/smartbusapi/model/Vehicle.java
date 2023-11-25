package com.example.smartbusapi.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Vehicle {
    String vehicleno;   //차량 번호
    String routenm;     //노선 번호
    String nodeid;      //정류소 ID
    String congestion;  //혼잡도
}
