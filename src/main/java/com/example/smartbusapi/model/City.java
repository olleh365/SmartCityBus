package com.example.smartbusapi.model;


import lombok.Getter;
import lombok.Setter;

// lombok은 따로 생성자를 만들 필요가 없다. lombok이 생성자를 생성해주는 메소드임.
@Getter
@Setter
public class City {
    private String citycode;
    private String cityname;
}
