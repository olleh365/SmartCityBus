package com.example.smartbusapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class Chats {
    // vehicleno가 get때 출력되지 않도록 설정
    @JsonIgnore
    private String vehicleno;
    // messages 리스트 안에 date, id, senderId, text가 존재
    private List<Map<String, Object>> messages;
}
