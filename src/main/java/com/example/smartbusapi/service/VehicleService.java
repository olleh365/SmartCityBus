package com.example.smartbusapi.service;

import com.example.smartbusapi.model.Vehicle;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class VehicleService {

    public String createVehicle(@RequestBody Vehicle vehicle) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("vehicleno")
                .document(vehicle.getVehicleno()).set(vehicle);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public Vehicle getVehicle(@RequestParam String vehicleno) throws InterruptedException, ExecutionException {
        System.out.println("받은 vehicleno : " + vehicleno);
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("vehicleno").document(vehicleno);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Vehicle vehicle;
        if(document.exists()){
            vehicle = document.toObject(Vehicle.class);
            return vehicle;
        }
        return null;
    }

    public List<Vehicle> getVehicleList() throws InterruptedException, ExecutionException {
        System.out.println("버스 정보 출력");
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference collectionReference = dbFirestore.collection("vehicleno");
        ApiFuture<QuerySnapshot> query = collectionReference.get();
        QuerySnapshot querySnapshot  = query.get();
        List<Vehicle> allVehicles = new ArrayList<>();
        for (QueryDocumentSnapshot document : querySnapshot) {
            Vehicle vehicleInfo = document.toObject(Vehicle.class);
            allVehicles.add(vehicleInfo);
        }

        return allVehicles;
    }

    public String updateVehicle(@RequestBody Vehicle vehicle) throws InterruptedException, ExecutionException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("vehicleno").document(vehicle.getVehicleno()).set(vehicle);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public String deleteVehicle(@RequestParam String vehicleno) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("vehicleno").document(vehicleno).delete();
        return "삭제 성공 : " + vehicleno;
    }
}
