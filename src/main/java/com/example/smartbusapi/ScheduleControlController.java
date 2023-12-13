package com.example.smartbusapi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScheduleControlController {

    private final dataSchedule dataSchedule;

    public ScheduleControlController(dataSchedule dataSchedule) {
        this.dataSchedule = dataSchedule;
    }

    @GetMapping("/schedule/enable")
    public String enableScheduledTasks() {
        dataSchedule.setRunScheduledTasks(true);
        return "스케줄러 활성화";
    }

    @GetMapping("/schedule/disable")
    public String disableScheduledTasks() {
        dataSchedule.setRunScheduledTasks(false);
        return "스케줄러 비활성화";
    }
}