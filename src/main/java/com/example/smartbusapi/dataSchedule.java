package com.example.smartbusapi;

import com.example.smartbusapi.controller.RouteController;
import com.example.smartbusapi.controller.VehicleController;
import com.example.smartbusapi.model.Route;
import com.example.smartbusapi.model.Vehicle;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class dataSchedule {

    private final RouteController routeController;
    private final VehicleController vehicleController;

    // 스케줄된 작업 실행 여부를 제어하기 위한 플래그
    private boolean runScheduledTasks = false;

    public dataSchedule(RouteController routeController, VehicleController vehicleController) {
        this.routeController = routeController;
        this.vehicleController = vehicleController;
    }

    // 플래그의 값을 설정하는 메서드
    public void setRunScheduledTasks(boolean runScheduledTasks) {
        this.runScheduledTasks = runScheduledTasks;
    }
    // 일정 주기마다 route, vehicle 최신화 하는 함수
    @Scheduled(fixedDelay = 60000) // 10분
    public void scheduled_route() {
        try {
            if (runScheduledTasks) {
                System.out.println("Route 스케줄러 실행");
                routeController.createRoute(new Route());
            } else {
//                System.out.println("Route 스케줄러 건너뛰기");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // vehicle에 대한 스케줄된 작업
    @Scheduled(fixedDelay = 60000, initialDelay = 6000) // 10분, 초기 딜레이 1분
    public void scheduledVehicle() {
        try {
            if (runScheduledTasks) {
                System.out.println("Vehicle 스케줄러 실행");
                vehicleController.createVehicle(new Vehicle());
            } else {
//                System.out.println("Vehicle 스케줄러 건너뛰기");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
